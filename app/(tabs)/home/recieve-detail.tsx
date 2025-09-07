// app/(tabs)/home/receive-detail.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getRecordById, formatKDate } from "../../data/hospitalRecords";

export default function ReceiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rec = useMemo(() => (id ? getRecordById(id) : undefined), [id]);

  if (!rec) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#6B7280" }}>기록을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
      <View style={styles.header}>
        <Text style={styles.hName}>{rec.hospitalName}</Text>
        <Text style={styles.hDate}>{formatKDate(rec.visitDate)}</Text>
        <Text style={styles.hMeta}>
          {rec.department} · {rec.doctor}
        </Text>
      </View>

      <Card title="요약">
        <Row icon="document-text-outline" label="메모">
          <Text style={styles.body}>{rec.notes || "-"}</Text>
        </Row>
      </Card>

      <Card title="진단">
        {rec.diagnosis?.length ? rec.diagnosis.map((d, i) => <Bullet key={i} text={d} />) : (
          <Text style={styles.muted}>-</Text>
        )}
      </Card>

      <Card title="처방">
        {rec.medications?.length ? rec.medications.map((m, i) => <Bullet key={i} text={m} />) : (
          <Text style={styles.muted}>-</Text>
        )}
      </Card>

      <Card title="활력징후">
        <View style={{ gap: 8 }}>
          <Row icon="heart-outline" label="심박수">
            <Text style={styles.body}>{rec.vitals?.hr ? `${rec.vitals.hr} bpm` : "-"}</Text>
          </Row>
          <Row icon="speedometer-outline" label="혈압">
            <Text style={styles.body}>{rec.vitals?.bp ? `${rec.vitals.bp} mmHg` : "-"}</Text>
          </Row>
          <Row icon="thermometer-outline" label="체온">
            <Text style={styles.body}>{rec.vitals?.temp ? `${rec.vitals.temp} °C` : "-"}</Text>
          </Row>
        </View>
      </Card>

      {!!rec.attachments?.length && (
        <Card title="첨부">
          {rec.attachments.map((a, i) => (
            <Row key={i} icon="attach-outline" label={a.type.toUpperCase()}>
              <Text style={styles.body}>{a.name}</Text>
            </Row>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHd}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={{ padding: 12, gap: 10 }}>{children}</View>
    </View>
  );
}

function Row({
  icon, label, children,
}: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; children?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={16} color="#294A9B" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
      <Text style={{ color: "#9CA3AF", lineHeight: 20 }}>•</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    margin: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE3FF",
  },
  hName: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  hDate: { marginTop: 6, color: "#111827", fontWeight: "700" },
  hMeta: { marginTop: 4, color: "#4B5563" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHd: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardTitle: { fontWeight: "800", color: "#111827" },

  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowIcon: {
    width: 26, height: 26, borderRadius: 6, backgroundColor: "#F6F8FF",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#DDE3FF",
  },
  rowLabel: { width: 88, color: "#6B7280", fontWeight: "700" },
  body: { color: "#1F2937", lineHeight: 20 },
  muted: { color: "#9CA3AF" },
});
