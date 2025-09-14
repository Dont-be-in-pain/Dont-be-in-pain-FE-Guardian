import { Image, StyleSheet, Text, View } from "react-native";

export default function TopPanel() {
  return (
    <View>
      {/* 상단 라이트 블루 배경 */}
      <View style={styles.header1}></View>

      {/* 두 번째 박스 */}
      <View style={styles.header}>
        {/* 로고 + 텍스트를 가로 중앙 정렬 */}
        <View style={styles.logoRow}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>MediConnect</Text>
        </View>
      </View>

      {/* 떠 있는 환자 정보 카드 */}
      <View style={styles.patientCard}>
        <Text style={styles.title}>김철수 님의 건강기록</Text>
        <Text style={styles.sub}>남, 65세</Text>
        <Text style={styles.caption}>환자 건강을 조회해보세요!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header1: {
    backgroundColor: "rgba(211, 225, 245, 0.3)",
    height: 60,
  },
  header: {
    backgroundColor: "#D3E1F5",
    paddingVertical: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: "90%",
    alignSelf: "center",
    marginTop: -50, // 위의 라이트 블루 배경과 겹치도록
    height: 100,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  logoRow: {
    flexDirection: "row",   // 가로 정렬
    alignItems: "center",   // 세로 가운데
    justifyContent: "center", // 부모 박스 가로 중앙
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    opacity: 0.7, // 투명도
  },
  brand: { fontSize: 22, fontWeight: "800", color: "#1E3D8F" },

  patientCard: {
    marginTop: -40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 17, fontWeight: "800", color: "#0A0A0A", marginBottom: 4 },
  sub: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 6 },
  caption: { fontSize: 12, color: "#8B8B8B" },
});
