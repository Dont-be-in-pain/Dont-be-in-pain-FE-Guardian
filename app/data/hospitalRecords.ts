// app/data/hospitalRecords.ts
export type HospitalMeta = { id: "SNUH" | "AMC" | (string & {}); name: string };

export const HOSPITALS: HospitalMeta[] = [
  { id: "SNUH", name: "서울대병원" },
  { id: "AMC", name: "아산병원" },
];

export const DATE_PRESETS = ["최근 7일", "최근 30일", "올해", "전체"] as const;
export type DatePreset = typeof DATE_PRESETS[number];

export type HospitalRecord = {
  id: string;
  hospitalId: HospitalMeta["id"];
  hospitalName: string;
  visitDate: string; // 'YYYY-MM-DD'
  department: string;
  doctor: string;
  diagnosis: string[];
  medications: string[];
  notes: string;
  vitals?: { bp?: string; hr?: number; temp?: number };
  attachments?: { type: "pdf" | "image"; name: string }[];
};

export const HOSPITAL_RECORDS: HospitalRecord[] = [
  {
    id: "AMC-2025-09-01-001",
    hospitalId: "AMC",
    hospitalName: "아산병원",
    visitDate: "2025-09-01",
    department: "순환기내과",
    doctor: "박의사",
    diagnosis: ["고혈압"],
    medications: ["암로디핀 5mg"],
    notes: "혈압 가정 모니터링 권장(아침/저녁). 2주 뒤 외래 추적.",
    vitals: { bp: "142/90", hr: 88, temp: 36.9 },
    attachments: [{ type: "pdf", name: "심전도_결과.pdf" }],
  },
  {
    id: "SNUH-2025-08-31-001",
    hospitalId: "SNUH",
    hospitalName: "서울대병원",
    visitDate: "2025-08-31",
    department: "호흡기내과",
    doctor: "김의사",
    diagnosis: ["상기도 감염", "기침"],
    medications: ["아세트아미노펜 500mg", "덱스트로메토르판 시럽"],
    notes: "야간 기침 증가. 3일 후 증상 지속 시 재내원.",
    vitals: { bp: "122/78", hr: 82, temp: 37.3 },
    attachments: [{ type: "pdf", name: "진료확인서.pdf" }],
  },
  {
    id: "SNUH-2025-07-12-002",
    hospitalId: "SNUH",
    hospitalName: "서울대병원",
    visitDate: "2025-07-12",
    department: "가정의학과",
    doctor: "이의사",
    diagnosis: ["위염 의심"],
    medications: ["에소메프라졸 20mg"],
    notes: "식사 조절 및 자극적 음식 제한. 복약 순응도 체크 필요.",
    vitals: { bp: "118/76", hr: 76, temp: 36.8 },
  },
  {
    id: "AMC-2025-06-21-003",
    hospitalId: "AMC",
    hospitalName: "아산병원",
    visitDate: "2025-06-21",
    department: "정형외과",
    doctor: "최의사",
    diagnosis: ["무릎 통증"],
    medications: ["이부프로펜 200mg", "파스"],
    notes: "운동 전 스트레칭 및 얼음찜질. 필요 시 물리치료 권장.",
    vitals: { bp: "124/80", hr: 74, temp: 36.6 },
  },
  {
    id: "SNUH-2025-05-05-004",
    hospitalId: "SNUH",
    hospitalName: "서울대병원",
    visitDate: "2025-05-05",
    department: "안과",
    doctor: "정의사",
    diagnosis: ["안구건조증"],
    medications: ["인공눈물 점안액"],
    notes: "화면 사용 시 20-20-20 룰 안내. 실내 습도 유지.",
  },
  {
    id: "AMC-2025-04-10-005",
    hospitalId: "AMC",
    hospitalName: "아산병원",
    visitDate: "2025-04-10",
    department: "이비인후과",
    doctor: "한의사",
    diagnosis: ["알레르기 비염"],
    medications: ["로라타딘 10mg"],
    notes: "꽃가루 농도 높은 날 외출 시 마스크 착용.",
  },
];

export function formatKDate(d: string) {
  const [y, m, dd] = d.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, dd);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${y}.${String(m).padStart(2, "0")}.${String(dd).padStart(2, "0")} (${days[dt.getDay()]})`;
}

export function getRecordById(id: string) {
  return HOSPITAL_RECORDS.find((r) => r.id === id);
}

function inPreset(dateStr: string, preset: DatePreset) {
  if (preset === "전체") return true;
  const now = new Date();
  const date = new Date(dateStr + "T00:00:00");
  if (preset === "올해") return date.getFullYear() === now.getFullYear();
  const diffDays = Math.floor((+now - +date) / (1000 * 60 * 60 * 24));
  if (preset === "최근 7일") return diffDays <= 7;
  if (preset === "최근 30일") return diffDays <= 30;
  return true;
}

export function listRecords(params: { hospitalId?: HospitalMeta["id"] | "ALL"; preset: DatePreset }) {
  const { hospitalId = "ALL", preset } = params;
  return HOSPITAL_RECORDS
    .filter((r) => (hospitalId === "ALL" ? true : r.hospitalId === hospitalId))
    .filter((r) => inPreset(r.visitDate, preset))
    .sort((a, b) => (a.visitDate < b.visitDate ? 1 : -1));
}
