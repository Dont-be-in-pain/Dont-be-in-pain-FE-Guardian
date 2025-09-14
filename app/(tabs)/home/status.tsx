import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Metric = { label: string; value: string; sub?: string; icon: React.ReactNode };

export default function StatusScreen() {
  // 실제 데이터 연결 전, 샘플 지표
  const metrics: Metric[] = useMemo(
    () => [
      {
        label: "체온",
        value: "36.7°C",
        sub: "정상",
        icon: <MaterialCommunityIcons name="thermometer" size={18} color="#2F7D32" />,
      },
      {
        label: "심박수",
        value: "72 bpm",
        sub: "안정",
        icon: <Ionicons name="heart" size={18} color="#D84315" />,
      },
      {
        label: "수면",
        value: "7h 40m",
        sub: "양호",
        icon: <Ionicons name="moon" size={18} color="#294A9B" />,
      },
      {
        label: "복약",
        value: "92%",
        sub: "금주 11/12회",
        icon: <Ionicons name="medkit" size={18} color="#6A1B9A" />,
      },
    ],
    []
  );

  const todaySummary =
    "오늘은 전반적으로 양호한 상태예요. 체온 36.7도, 심박수 안정, 수면 7시간 40분, 복약 이행률 92%입니다. 불편감은 특별히 보고되지 않았습니다.";

  const speakSummary = () => {
    Speech.speak(todaySummary, { language: "ko-KR", rate: 1.0, pitch: 1.0 });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Hero 상태 카드 */}
      <View style={styles.hero}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#2F7D32" />
          <Text style={styles.statusText}>Good</Text>
        </View>
        <Text style={styles.heroTitle}>오늘은 건강 상태가 좋아요!</Text>
        <Text style={styles.heroSub}>
          최신 데이터 기준으로 이상 징후가 없어요. 가벼운 스트레칭과 수분 섭취를 권장합니다.
        </Text>

        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={speakSummary}>
            <Ionicons name="volume-high" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>오늘 요약 읽어주기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 주요 지표 4-그리드 */}
      <View style={styles.grid}>
        {metrics.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={styles.iconBadge}>{m.icon}</View>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
            <Text style={styles.metricValue}>{m.value}</Text>
            {!!m.sub && <Text style={styles.metricSub}>{m.sub}</Text>}
          </View>
        ))}
      </View>

      {/* 증상/메모 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>오늘 메모</Text>
        <View style={styles.chips}>
          <Chip text="식사: 3회" />
          <Chip text="수분: 7컵" />
          <Chip text="산책: 20분" />
        </View>
        <Text style={styles.memo}>
          어제보다 컨디션이 좋아졌고, 가벼운 기침은 오전에 1–2회 있었습니다. 오후엔 해소됨.
        </Text>
      </View>
    </ScrollView>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#E7F6EA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#DFF3E4",
    borderRadius: 999,
  },
  statusText: { color: "#2F7D32", fontWeight: "800", fontSize: 12 },
  heroTitle: { fontSize: 18, fontWeight: "800", marginTop: 10, color: "#1E2A3A" },
  heroSub: { marginTop: 6, color: "#4B5563", lineHeight: 20, fontSize: 13 },
  heroActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  primaryBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#2F7D32",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: { color: "white", fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#F6F8FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8FF",
  },
  metricHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: { fontWeight: "800", color: "#1A2D6B", fontSize: 13 },
  metricValue: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  metricSub: { marginTop: 2, color: "#6B7280", fontSize: 12 },
  section: { marginTop: 6, backgroundColor: "#fff", padding: 12 },
  sectionTitle: { fontWeight: "800", fontSize: 15, marginBottom: 8, color: "#1F2937" },
  chips: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 8 },
  chip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8FF",
  },
  chipText: { color: "#3B5BCC", fontWeight: "700", fontSize: 12 },
  memo: { color: "#4B5563", lineHeight: 20 },
});
