import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomPanel from "../components/layout/BottomPanel";
import CentralPanel from "../components/layout/CentralPanel";
import TopPanel from "../components/layout/TopPanel";

export default function HomeLayout() {
  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TopPanel />
        <CentralPanel />
        <View style={styles.dividerRow}>
          <View style={styles.bottomLine} />
        </View>
      </ScrollView>
      <BottomPanel />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F4F6FF" },

  // BottomPanel이 살짝 떠 있으므로 여유 패딩을 넉넉히 줌
  scroll: { paddingBottom: 140 },
  dividerRow: {
    flexBasis: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  bottomLine: {
    height: 1,
    width: "82%",
    backgroundColor: "#BDBDBD",
    borderRadius: 1,
  },
});
