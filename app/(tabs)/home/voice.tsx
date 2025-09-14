import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Tab = "original" | "standard" | "medical";

const DUMMY_ORIGINAL =
  "어제부터 목이 칼칼하고 좀 매워. 약은 대충 먹었는데 아직도 좀 불편혀.";

export default function VoiceRecordScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("original");
  const [busy, setBusy] = useState(false);

  // 더미 텍스트
  const [originalText, setOriginalText] = useState<string>("");
  const [standardText, setStandardText] = useState<string>("");
  const [medicalText, setMedicalText] = useState<string>("");

  // 화면 진입 시 더미 로드
  useEffect(() => {
    loadDummy();
  }, []);

  const loadDummy = () => {
    Speech.stop();
    setOriginalText(DUMMY_ORIGINAL);
    setStandardText("");
    setMedicalText("");
    setActiveTab("original");
  };

  // 변환(모의) — 실제에선 서버 STT/변환 API 호출
  const convertTexts = async () => {
    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 600)); // 로딩 연출
      const std = toStandard(originalText || DUMMY_ORIGINAL);
      const med = toMedical(std);
      setStandardText(std);
      setMedicalText(med);
      setActiveTab("standard");
    } finally {
      setBusy(false);
    }
  };

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text || "내용이 없습니다.", {
      language: "ko-KR",
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const speakActive = () => {
    if (activeTab === "original") speak(originalText);
    else if (activeTab === "standard") speak(standardText);
    else speak(medicalText);
  };

  const activeLabel =
    activeTab === "original"
      ? "원문(사투리·일상어)"
      : activeTab === "standard"
      ? "표준어"
      : "전문의료어";

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* 단계 진행 헤더 */}
      <View style={styles.step}>
        <StepItem index={1} label="녹음(더미)" active={!!originalText} />
        <StepDivider />
        <StepItem index={2} label="변환" active={!!standardText || busy} />
        <StepDivider />
        <StepItem index={3} label="보기/듣기" active={!!standardText || !!medicalText} />
      </View>

      {/* 더미 컨트롤 카드 */}
      <View style={styles.recordCard}>
        <Text style={styles.cardTitle}>증상 음성 기록 (더미)</Text>
        <Text style={styles.cardSub}>
          지금은 환자앱에서 받은 녹음 대신 더미 데이터를 사용하고 있어요.
          {"\n"}표준어/전문의료어 변환 흐름만 먼저 확인해보세요.
        </Text>

        <View style={styles.recRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={loadDummy} activeOpacity={0.9}>
            <MaterialCommunityIcons name="database-refresh" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>샘플 불러오기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilBtn, !originalText && { opacity: 0.5 }]}
            onPress={() => speak(originalText)}
            disabled={!originalText}
          >
            <Ionicons name="play" size={18} color="#294A9B" />
            <Text style={styles.utilBtnText}>원문 읽어주기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilBtn, (!originalText || busy) && { opacity: 0.6 }]}
            onPress={convertTexts}
            disabled={!originalText || busy}
          >
            {busy ? (
              <ActivityIndicator size="small" />
            ) : (
              <MaterialCommunityIcons name="auto-fix" size={18} color="#294A9B" />
            )}
            <Text style={styles.utilBtnText}>변환하기</Text>
          </TouchableOpacity>
        </View>

        {/* 원문(사투리) 미리보기 */}
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>원문(사투리·일상어)</Text>
          <Text style={styles.previewText}>
            {originalText || "샘플을 불러오면 원문이 표시됩니다."}
          </Text>
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        <TabButton text="원문" active={activeTab === "original"} onPress={() => setActiveTab("original")} />
        <TabButton text="표준어" active={activeTab === "standard"} onPress={() => setActiveTab("standard")} />
        <TabButton text="전문의료어" active={activeTab === "medical"} onPress={() => setActiveTab("medical")} />
      </View>

      {/* 결과 카드 */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.cardTitle}>{activeLabel}</Text>
          <TouchableOpacity style={styles.speakBtn} onPress={speakActive}>
            <Ionicons name="volume-high" size={16} color="#fff" />
            <Text style={styles.speakBtnText}>읽어주기</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultText}>
          {activeTab === "original"
            ? originalText || "샘플을 불러오면 원문이 표시됩니다."
            : activeTab === "standard"
            ? standardText || "표준어 변환 결과가 없습니다."
            : medicalText || "전문의료어 변환 결과가 없습니다."}
        </Text>

        {/* 공유(추후 연동) */}
        
      </View>
    </ScrollView>
  );
}

/* ── 간단 표준어/의료어 변환 (모의) ───────────────────────────── */
function toStandard(src: string): string {
  if (!src) return "";
  let s = src;
  s = s.replace(/매워/g, "따갑고 불편해요");
  s = s.replace(/불편혀/g, "불편해요");
  s = s.replace(/대충 먹었/g, "규칙적으로 복용하지 않았");
  s = s.replace(/혀\./g, "요.");
  // 어미 정돈
  if (!/[.!?]$/.test(s.trim())) s = s.trim() + "요.";
  return s;
}

function toMedical(std: string): string {
  const base = std || "";
  return [
    "• 주요 호소: 인후부 불편감(따가움/이물감 추정)",
    "• 경과: 전일 이후 지속",
    "• 복약 이행: 불규칙 복용 가능성",
    `• 환자 진술(정제): ${base}`,
    "• 임상 메모(샘플): 상기도 자극/경미한 인후염 가능성. 수분 섭취 및 휴식 권고.",
  ].join("\n");
}

/* ── 프레젠테이션 컴포넌트 ─────────────────────────────────────── */
function StepItem({ index, label, active }: { index: number; label: string; active?: boolean }) {
  return (
    <View style={styles.stepItem}>
      <View style={[styles.stepBullet, active && { backgroundColor: "#294A9B" }]}>
        <Text style={[styles.stepBulletText, active && { color: "#fff" }]}>{index}</Text>
      </View>
      <Text style={[styles.stepLabel, active && { color: "#294A9B", fontWeight: "800" }]}>{label}</Text>
    </View>
  );
}
function StepDivider() {
  return <View style={styles.stepDivider} />;
}

function TabButton({
  text,
  active,
  onPress,
}: {
  text: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabBtn,
        active && { backgroundColor: "#294A9B", borderColor: "#294A9B" },
      ]}
      activeOpacity={0.9}
    >
      <Text style={[styles.tabBtnText, active && { color: "#fff", fontWeight: "800" }]}>{text}</Text>
    </TouchableOpacity>
  );
}

/* ── 스타일 ───────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBulletText: { fontSize: 12, fontWeight: "800", color: "#374151" },
  stepLabel: { fontSize: 12, color: "#6B7280" },
  stepDivider: { flex: 1, height: 1, backgroundColor: "#E5E7EB", marginHorizontal: 10 },

  recordCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937" },
  cardSub: { marginTop: 6, color: "#4B5563", lineHeight: 20, fontSize: 13 },

  recRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" },
  primaryBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#294A9B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: { color: "white", fontWeight: "700" },

  utilBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE3FF",
  },
  utilBtnText: { color: "#294A9B", fontWeight: "700" },

  preview: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewLabel: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  previewText: { color: "#111827", lineHeight: 20 },

  tabs: { flexDirection: "row", gap: 8, marginTop: 10, marginBottom: 8 },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE3FF",
    backgroundColor: "#F6F8FF",
  },
  tabBtnText: { color: "#294A9B", fontWeight: "700" },

  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2F7D32",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  speakBtnText: { color: "#fff", fontWeight: "700" },
  resultText: { marginTop: 10, color: "#111827", lineHeight: 20},

});
