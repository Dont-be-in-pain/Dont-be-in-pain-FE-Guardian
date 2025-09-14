import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

type MetricKey = "temp" | "hr" | "sleep" | "med";

type DataPoint = {
  label: string; // D1~ / 1~30
  temp: number;  // ℃
  hr: number;    // bpm
  sleep: number; // h
  med: number;   // %
};

// 더미 데이터 생성
function makeDummy(range: "week" | "month"): DataPoint[] {
  const n = range === "week" ? 7 : 30;
  const arr: DataPoint[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      label: range === "week" ? `D${i + 1}` : String(i + 1),
      temp: +(36.4 + Math.random() * 0.9).toFixed(1),
      hr: Math.round(65 + Math.random() * 20),
      sleep: +(6 + Math.random() * 2.5).toFixed(1),
      med: Math.round(85 + Math.random() * 15), // 85~100%
    });
  }
  return arr;
}

function summarize(data: DataPoint[], key: MetricKey) {
  const vals = data.map((d) => d[key]);
  const avg =
    Math.round((vals.reduce((a, b) => a + (Number(b) || 0), 0) / vals.length) * 10) / 10;
  const min = Math.min(...(vals as number[]));
  const max = Math.max(...(vals as number[]));
  return { avg, min, max };
}

export default function HealthDataScreen() {
  const [range, setRange] = useState<"week" | "month">("week");
  const [metric, setMetric] = useState<MetricKey>("temp");

  const data = useMemo(() => makeDummy(range), [range]);
  const { avg, min, max } = summarize(data, metric);

  const unit = metric === "temp" ? "℃" : metric === "hr" ? "bpm" : metric === "sleep" ? "h" : "%";
  const title =
    metric === "temp"
      ? "체온"
      : metric === "hr"
      ? "심박수"
      : metric === "sleep"
      ? "수면"
      : "복약 이행률";

  // 바차트 스케일
  const maxRef =
    metric === "temp" ? 37.8 : metric === "hr" ? 100 : metric === "sleep" ? 9.5 : 100;
  const minRef = metric === "temp" ? 35.5 : metric === "hr" ? 50 : metric === "sleep" ? 0 : 0;

  const speakSummary = () => {
    const text =
      range === "week"
        ? `최근 7일 ${title} 평균은 ${avg}${unit}, 최소 ${min}${unit}, 최대 ${max}${unit}입니다.`
        : `최근 30일 ${title} 평균은 ${avg}${unit}, 최소 ${min}${unit}, 최대 ${max}${unit}입니다.`;
    Speech.stop();
    Speech.speak(text, { language: "ko-KR", rate: 1.0, pitch: 1.0 });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>건강 데이터</Text>
        <View style={styles.rangeRow}>
          <RangeBtn text="7일" active={range === "week"} onPress={() => setRange("week")} />
          <RangeBtn text="30일" active={range === "month"} onPress={() => setRange("month")} />
        </View>
      </View>

      {/* 메트릭 토글 */}
      <View style={styles.metricRow}>
        <MetricBtn text="체온" active={metric === "temp"} onPress={() => setMetric("temp")} />
        <MetricBtn text="심박" active={metric === "hr"} onPress={() => setMetric("hr")} />
        <MetricBtn text="수면" active={metric === "sleep"} onPress={() => setMetric("sleep")} />
        <MetricBtn text="복약" active={metric === "med"} onPress={() => setMetric("med")} />
      </View>

      {/* 카드: 요약 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          {title} 요약 ({range === "week" ? "최근 7일" : "최근 30일"})
        </Text>
        <View style={styles.summaryRow}>
          <SummaryItem label="평균" value={`${avg}${unit}`} />
          <SummaryItem label="최소" value={`${min}${unit}`} />
          <SummaryItem label="최대" value={`${max}${unit}`} />
        </View>

        <TouchableOpacity style={styles.speakBtn} onPress={speakSummary} activeOpacity={0.9}>
          <Ionicons name="volume-high" size={16} color="#fff" />
          <Text style={styles.speakText}>요약 읽어주기</Text>
        </TouchableOpacity>
      </View>

      {/* 미니 바차트 */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{title} 차트</Text>
        <View style={styles.chartWrap}>
          {data.map((d, i) => {
            const v = Number(d[metric]);
            const ratio = Math.max(0, Math.min(1, (v - minRef) / (maxRef - minRef)));
            const h = 8 + ratio * 96; // 최소 8, 최대 104
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: h }]} />
                <Text style={styles.barLabel}>{d.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 메모/권장 */}
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>권장 사항 (예시)</Text>
        <Text style={styles.noteText}>
          • 수분 섭취와 가벼운 스트레칭을 권장합니다.{"\n"}• 고열(38℃ 이상) 또는 휴식에도 증상 지속 시
          병원 문의를 고려하세요.{"\n"}• 복약 알림을 활용하여 이행률을 유지하세요.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ── 작은 컴포넌트들 ─────────────────────────────────────────── */
function RangeBtn({ text, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.rangeBtn, active && styles.rangeBtnActive]}
      activeOpacity={0.9}
    >
      <Text style={[styles.rangeText, active && styles.rangeTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

function MetricBtn({ text, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.metricBtn, active && styles.metricBtnActive]}
      activeOpacity={0.9}
    >
      <Text style={[styles.metricText, active && styles.metricTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

/* ── 스타일 ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pageTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  rangeRow: { flexDirection: "row", gap: 8 },

  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  rangeBtnActive: { backgroundColor: "#294A9B" },
  rangeText: { color: "#374151", fontWeight: "700" },
  rangeTextActive: { color: "#fff" },

  metricRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 10 },
  metricBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE3FF",
    backgroundColor: "#F6F8FF",
  },
  metricBtnActive: { backgroundColor: "#294A9B", borderColor: "#294A9B" },
  metricText: { color: "#294A9B", fontWeight: "800" },
  metricTextActive: { color: "#fff" },

  summaryCard: {
    backgroundColor: "#E7F6EA",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DFF3E4",
    marginBottom: 12,
  },
  summaryTitle: { fontWeight: "800", color: "#1F2937", marginBottom: 8 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: "800", color: "#111827" },
  speakBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#2F7D32",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  speakText: { color: "#fff", fontWeight: "800" },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  chartTitle: { fontWeight: "800", color: "#1F2937", marginBottom: 8 },
  chartWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingVertical: 8,
    height: 140,
  },
  barCol: { alignItems: "center", width: 18 },
  bar: {
    width: 16,
    backgroundColor: "#3B5BCC",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: { marginTop: 6, fontSize: 10, color: "#6B7280" },

  noteCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFE4D5",
    marginBottom: 14,
  },
  noteTitle: { fontWeight: "800", color: "#7C2D12", marginBottom: 6 },
  noteText: { color: "#7C2D12", lineHeight: 20 },
});
