import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CentralPanel() {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {/* 1행 */}
      <Card
        style={{ backgroundColor: "#E7F6EA" }}
        icon={<Ionicons name="checkmark-circle" size={22} color="#2F7D32" />}
        title="Good"
        titleColor="#2F7D32"
        desc="Today"
        onPress={() => router.push("../(tabs)/home/status")}
      />

      <Card
        icon={<Ionicons name="mic" size={20} color="#294A9B" />}
        title="음성 기록"
        titleColor="#294A9B"
        desc="내가 어제부터 목이 ..."
        rightBottom="2 days ago"
        onPress={() => router.push("/(tabs)/home/voice")}
      />

      {/* 2행 */}
      <Card
        icon={<Ionicons name="document-text" size={20} color="#294A9B" />}
        title="질문지"
        titleColor="#294A9B"
        desc={
          <Text style={{ color: "#C62828", fontWeight: "700" }}>Unwell</Text>
        }
        rightBottom="5 days ago"
        onPress={() => router.push("/(tabs)/home/question")}
      />

      <Card
        icon={
          <MaterialCommunityIcons name="chart-line" size={20} color="#294A9B" />
        }
        title="건강 데이터"
        titleColor="#294A9B"
        desc={
          <View style={styles.sparkWrap}>
            <View style={[styles.dot, { left: 6, bottom: 16 }]} />
            <View style={[styles.dot, { left: 26, bottom: 10 }]} />
            <View style={[styles.dot, { left: 46, bottom: 18 }]} />
            <View style={[styles.dot, { left: 66, bottom: 8 }]} />
            {/* 연결선(대충 보이도록) */}
            <View style={[styles.bar, { left: 10, bottom: 14, width: 20 }]} />
            <View style={[styles.bar, { left: 30, bottom: 12, width: 20 }]} />
            <View style={[styles.bar, { left: 50, bottom: 15, width: 20 }]} />
          </View>
        }
        rightBottom="1W"
        onPress={() => router.push("/(tabs)/home/health-data")}
      />

      {/* 3행 */}
      <Card
        icon={<Ionicons name="information-circle" size={20} color="#294A9B" />}
        title="건강"
        titleColor="#294A9B"
        desc={"Health record sent\n3days ago"}
        onPress={() => router.push("/(tabs)/home/health-data")}
      />

      <Card
        icon={<Ionicons name="medkit" size={20} color="#294A9B" />}
        title="병원 전송"
        titleColor="#294A9B"
        desc={"Health record sent"}
        onPress={() => router.push("/(tabs)/home/transfer")}
      />
    </View>
  );
}

/* ───── 공통 카드 ───── */
function Card({
  icon,
  title,
  titleColor = "#1A2D6B",
  desc,
  rightBottom,
  onPress,
  style,
}: {
  icon: React.ReactNode;
  title: string;
  titleColor?: string;
  desc?: React.ReactNode | string;
  rightBottom?: string;
  onPress?: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconBadge}>{icon}</View>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
      </View>

      {!!desc &&
        (typeof desc === "string" ? (
          <Text style={styles.cardDesc}>{desc}</Text>
        ) : (
          desc
        ))}

      {!!rightBottom && <Text style={styles.rightBottom}>{rightBottom}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // 폭은 퍼센트로
    height: 120, // ← Figma 비율 유지 (≈1.25)
    backgroundColor: "#D3E1F5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 0,

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D7E5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardDesc: { fontSize: 12, color: "#556070", marginTop: 4, lineHeight: 16 },

  rightBottom: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 11,
    color: "#7C8CB8",
    fontWeight: "600",
  },

  // 간단 스파크라인
  sparkWrap: {
    marginTop: 6,
    height: 54,
    backgroundColor: "#F6F8FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8FF",
    overflow: "hidden",
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B5BCC",
  },
  bar: {
    position: "absolute",
    height: 2,
    backgroundColor: "#3B5BCC",
    borderRadius: 1,
  },

  bottomLine: {
    height: 0.8, // 선의 두께
    backgroundColor: "#BDBDBD", // 선의 색상
    marginTop: 16, // 상단 여백
    width: "100%", // 선의 길이를 줄여 가운데 정렬
    alignSelf: "center", // 가운데 정렬
  },
});
