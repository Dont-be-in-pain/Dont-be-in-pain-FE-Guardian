import { View, Text } from "react-native";

export default function statusScreen() {
  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>✅ Good</Text>
      <Text>오늘은 건강 상태가 좋아요!</Text>
    </View>
  );
}
