import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 상세 화면
import HealthDataScreen from "../../(tabs)/home/health-data";
import QuestionScreen from "../../(tabs)/home/question";
import ReceiveScreen from "../../(tabs)/home/receive"; // ← 수신(필터+목록)
import StatusScreen from "../../(tabs)/home/status";
import VoiceRecordScreen from "../../(tabs)/home/voice";

const { width: SCREEN_W } = Dimensions.get("window");

// 패널 상태 타입
type ActiveKey = "status" | "voice" | "question" | "health-data" | "receive";

export default function CentralPanel() {
  const [active, setActive] = useState<ActiveKey | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openScreen = (screen: ActiveKey) => {
    setActive(screen);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  };

  const closeScreen = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setActive(null));
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_W, 0], // 오른쪽 밖 → 제자리
  });

  // 배경 음영은 아주 살짝만 (7%)
  const scrimOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
  });

  const headerTitle =
    active === "status" ? "오늘의 건강 상태"
    : active === "voice" ? "음성 기록 변환"
    : active === "question" ? "질문지"
    : active === "health-data" ? "건강 데이터"
    : "병원 전송 결과 조회";

  const headerSub =
    active === "status" ? "요약 · 주요 지표 · 메모"
    : active === "voice" ? "사투리/일상어 → 표준어/전문의료어"
    : active === "question" ? "보호자가 입력 · 샘플 음성→텍스트"
    : active === "health-data" ? "최근 7·30일 요약/차트"
    : "병원/기간 필터 후 리스트에서 선택";

  const headerBadge =
    active === "status" ? "STATUS"
    : active === "voice" ? "VOICE"
    : active === "question" ? "QUESTION"
    : active === "health-data" ? "DATA"
    : "RECEIVE";

  return (
    <View style={{ flex: 1 }}>
      {/* 카드 목록 */}
      <View style={styles.grid}>
        {/* 1행 */}
        <Card
          style={{ backgroundColor: "#E7F6EA" }}
          icon={<Ionicons name="checkmark-circle" size={22} color="#2F7D32" />}
          title="Good"
          titleColor="#2F7D32"
          desc="Today"
          onPress={() => openScreen("status")}
        />
        <Card
          icon={<Ionicons name="mic" size={20} color="#294A9B" />}
          title="음성 기록"
          titleColor="#294A9B"
          desc="내가 어제부터 목이 ..."
          rightBottom="2 days ago"
          onPress={() => openScreen("voice")}
        />

        {/* 2행 */}
        <Card
          icon={<Ionicons name="document-text" size={20} color="#294A9B" />}
          title="질문지"
          titleColor="#294A9B"
          desc={<Text style={{ color: "#C62828", fontWeight: "700" }}>Unwell</Text>}
          rightBottom="5 days ago"
          onPress={() => openScreen("question")}
        />
        <Card
          icon={<MaterialCommunityIcons name="chart-line" size={20} color="#294A9B" />}
          title="건강 데이터"
          titleColor="#294A9B"
          desc={"데이터 간단 요약"}
          rightBottom="1W"
          onPress={() => openScreen("health-data")}
        />

        {/* 3행 */}
        <Card
          icon={<Ionicons name="send-outline" size={20} color="#294A9B" />}
          title="병원 전송 (수신)"
          titleColor="#294A9B"
          desc={"병원/기간 선택 → 목록"}
          onPress={() => openScreen("receive")}
        />
        <Card
          icon={<Ionicons name="information-circle" size={20} color="#294A9B" />}
          title="안내"
          titleColor="#294A9B"
          desc={"받은 결과를 확인하세요"}
          onPress={() => {}}
        />
      </View>

      {/* 스크림 + 슬라이드 상세 패널 (가로 95%, 라운드) */}
      {active && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.scrim, { opacity: scrimOpacity }]}
          />
          <Pressable style={StyleSheet.absoluteFill} onPress={closeScreen} />

          <Animated.View
            style={[
              styles.overlayPanel,
              { width: SCREEN_W * 0.95, left: SCREEN_W * 0.025, transform: [{ translateX }] },
            ]}
          >
            {/* 헤더 */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.iconBtn} onPress={closeScreen} activeOpacity={0.9}>
                <Ionicons name="chevron-back" size={20} color="#1F2937" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
                <Text style={styles.headerSub}>{headerSub}</Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{headerBadge}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 본문 */}
            <View style={styles.contentWrap}>
              {active === "status" && <StatusScreen />}
              {active === "voice" && <VoiceRecordScreen />}
              {active === "question" && <QuestionScreen />}
              {active === "health-data" && <HealthDataScreen />}
              {active === "receive" && <ReceiveScreen />}
              {/* 필요하면 ReceiveDetailScreen을 슬라이드 안에서도 재사용 가능 */}
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

/* ───── 공통 카드 ───── */
function Card({
  icon, title, titleColor = "#1A2D6B", desc, rightBottom, onPress, style,
}: {
  icon: React.ReactNode; title: string; titleColor?: string;
  desc?: React.ReactNode | string; rightBottom?: string; onPress?: () => void; style?: any;
}) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBadge}>{icon}</View>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
      </View>
      {!!desc && (typeof desc === "string" ? <Text style={styles.cardDesc}>{desc}</Text> : desc)}
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
    width: "48%",
    height: 135,
    backgroundColor: "#D3E1F5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  iconBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: "#D7E5FF",
    alignItems: "center", justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardDesc: { fontSize: 12, color: "#556070", marginTop: 4, lineHeight: 16 },
  rightBottom: { position: "absolute", right: 10, bottom: 8, fontSize: 11, color: "#7C8CB8", fontWeight: "600" },

  scrim: { backgroundColor: "#000" },
  overlayPanel: {
    position: "absolute", top: 16, bottom: 16, backgroundColor: "#fff",
    borderRadius: 22, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 12, elevation: 9,
  },

  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3F4F6",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  headerBadge: {
    backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#DDE3FF",
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  headerBadgeText: { color: "#294A9B", fontWeight: "800", fontSize: 11 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },
  contentWrap: { flex: 1, padding: 12 },
});
