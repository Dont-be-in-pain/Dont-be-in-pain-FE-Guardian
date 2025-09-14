// app/(tabs)/home/receive.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  HOSPITALS,
  DATE_PRESETS,
  type HospitalMeta,
  type DatePreset,
  listRecords,
  formatKDate,
} from "../../data/hospitalRecords";

export default function ReceiveScreen() {
  const router = useRouter();
  const [hospitalId, setHospitalId] = useState<HospitalMeta["id"] | "ALL">("ALL");
  const [preset, setPreset] = useState<DatePreset>("최근 30일");

  const items = useMemo(() => listRecords({ hospitalId, preset }), [hospitalId, preset]);

  return (
    <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 28 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>병원 전송 결과 조회</Text>
        <Text style={styles.heroSub}>
          병원과 기간을 선택하면 해당 범위의 진찰 결과 목록이 표시됩니다.
        </Text>
      </View>

      {/* 병원 필터 */}
      <View style={styles.section}>
        <Text style={styles.label}>병원</Text>
        <View style={styles.rowWrap}>
          <Chip text="전체 병원" active={hospitalId === "ALL"} onPress={() => setHospitalId("ALL")} />
          {HOSPITALS.map((h) => (
            <Chip
              key={h.id}
              text={h.name}
              active={hospitalId === h.id}
              onPress={() => setHospitalId(h.id)}
            />
          ))}
        </View>
      </View>

      {/* 기간 필터 */}
      <View style={styles.section}>
        <Text style={styles.label}>기간</Text>
        <View style={styles.rowWrap}>
          {DATE_PRESETS.map((p) => (
            <Chip key={p} text={p} active={preset === p} onPress={() => setPreset(p)} />
          ))}
        </View>
      </View>

      {/* 목록 */}
      <View style={{ gap: 8 }}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.id}
            style={styles.row}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: "/(tabs)/home/recieve-detail", params: { id: it.id } })}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="business-outline" size={16} color="#294A9B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>
                {it.hospitalName} · {formatKDate(it.visitDate)}
              </Text>
              <Text style={styles.rowSub}>
                {it.department} · {it.doctor}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
        {!items.length && (
          <View style={styles.empty}>
            <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
            <Text style={{ color: "#6B7280" }}>해당 조건의 전송 결과가 없습니다.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function Chip({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.chip,
        active && { backgroundColor: "#294A9B", borderColor: "#294A9B" },
      ]}
    >
      <Text style={[styles.chipText, active && { color: "#fff" }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE3FF",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  heroSub: { marginTop: 6, color: "#4B5563", lineHeight: 20, fontSize: 13 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: "700" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipText: { color: "#374151", fontWeight: "700", fontSize: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowIcon: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: "#F6F8FF", borderWidth: 1, borderColor: "#DDE3FF",
    alignItems: "center", justifyContent: "center",
  },
  rowTitle: { fontWeight: "800", color: "#111827" },
  rowSub: { color: "#6B7280", marginTop: 2, fontSize: 12 },

  empty: {
    marginTop: 8,
    paddingVertical: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    gap: 8,
  },
});
