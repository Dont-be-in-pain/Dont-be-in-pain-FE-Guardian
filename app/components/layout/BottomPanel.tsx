import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomPanel() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.wrap}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => router.push("/(tabs)/settings")}
          activeOpacity={0.9}
        >
          <Ionicons name="settings-sharp" size={18} color="#fff" />
          <Text style={[styles.btnText, { color: "#fff" }]}>설정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={() => router.push("../patient/list")}
          activeOpacity={0.9}
        >
          <Text style={[styles.btnText, { color: "#2A4D9B" }]}>김철수</Text>
          <Ionicons name="chevron-forward" size={18} color="#2A4D9B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -90, 
    backgroundColor: "#F4F6FF",
  },
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  btnPrimary: { backgroundColor: "#2A4D9B" },
  btnGhost: {
    backgroundColor: "#E8EEFF",
    borderWidth: 1,
    borderColor: "#D7E1FF",
  },
  btnText: { fontSize: 15, fontWeight: "800" },
});
