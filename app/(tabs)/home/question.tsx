import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const QUICK_CHIPS = ["발열", "기침", "호흡곤란", "식욕저하", "수면", "복약 누락"];

export default function QuestionScreen() {
  const [text, setText] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const readAloud = () => {
    Speech.stop();
    Speech.speak(text || "입력된 내용이 없습니다.", {
      language: "ko-KR",
      rate: 1.0,
      pitch: 1.0,
    });
  };

  const mockSTT = async () => {
    // 나중에 실제 STT 연동 전까지 샘플 텍스트 주입
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    const sample =
      "어제 저녁부터 기침이 잦고 체온이 37.6도 정도 됩니다. 밤에 두 번 깼고 식사는 반 공기만 했습니다.";
    setText((prev) => (prev ? prev + "\n" : "") + sample);
    setBusy(false);
  };

  const submit = () => {
    if (!text.trim()) {
      Alert.alert("알림", "질문 또는 증상 내용을 입력해주세요.");
      return;
    }
    // TODO: 서버로 전송 로직
    Alert.alert("제출 완료", "환자에게 전달할 질문/증상이 저장되었습니다.");
    setText("");
  };

  const addChip = (chip: string) => {
    setText((t) => (t ? `${t}\n- ${chip}` : `- ${chip}`));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.title}>질문지</Text>
        <Text style={styles.sub}>
          보호자가 환자 상태에 대해 궁금한 점을 적어주세요. 나중에 환자에게 전송됩니다.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={readAloud} activeOpacity={0.9}>
            <Ionicons name="volume-high" size={18} color="#fff" />
            <Text style={styles.primaryText}>입력 내용 읽어주기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, busy && { opacity: 0.6 }]}
            onPress={mockSTT}
            disabled={busy}
            activeOpacity={0.9}
          >
            {busy ? (
              <ActivityIndicator size="small" />
            ) : (
              <MaterialCommunityIcons name="microphone" size={18} color="#294A9B" />
            )}
            <Text style={styles.secondaryText}>샘플 음성→텍스트</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>자주 쓰는 항목</Text>
        <View style={styles.chips}>
          {QUICK_CHIPS.map((c) => (
            <TouchableOpacity key={c} style={styles.chip} onPress={() => addChip(c)}>
              <Text style={styles.chipText}>#{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>질문/증상 내용</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 밤새 기침이 심했고, 아침 체온 37.6도였습니다. 약은 어제 저녁 한 번 빠뜨렸습니다."
          placeholderTextColor="#9CA3AF"
          multiline
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 12 }]} onPress={submit} activeOpacity={0.9}>
          <Ionicons name="paper-plane" size={18} color="#fff" />
          <Text style={styles.primaryText}>제출하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  title: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  sub: { marginTop: 6, color: "#4B5563", lineHeight: 20, fontSize: 13 },
  actions: { flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#294A9B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryText: { color: "#fff", fontWeight: "800" },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F6F8FF",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE3FF",
  },
  secondaryText: { color: "#294A9B", fontWeight: "800" },

  section: { backgroundColor: "#fff", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  label: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: "#374151", fontWeight: "700", fontSize: 12 },

  input: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    textAlignVertical: "top",
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
});
