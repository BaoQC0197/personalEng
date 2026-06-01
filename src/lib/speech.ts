// ===== Lớp đọc tiếng Anh (Web Speech API) =====
// Chạy hoàn toàn trong trình duyệt/HĐH, KHÔNG gọi mạng -> không gây lag.
// Cho phép chọn & GHIM giọng (Nam/Nữ). Lưu localStorage vì danh sách giọng
// khác nhau theo từng thiết bị (không đồng bộ Supabase).

const PREF_KEY = "personal-english:voice:v1";

export type Gender = "male" | "female" | "unknown";

/** Đoán giới tính giọng theo tên (Web Speech không có trường gender chuẩn). */
export function guessGender(name: string): Gender {
  const n = name.toLowerCase();
  const female = [
    "zira", "samantha", "victoria", "susan", "karen", "moira", "tessa",
    "fiona", "female", "woman", "aria", "jenny", "michelle", "sonia",
    "libby", "natasha", "clara", "amber", "eva", "joanna", "salli",
    "kendra", "kimberly", "ivy", "emma", "catherine", "linda", "heera",
    "hazel", "serena", "allison", "ava", "nora", "google us english",
    "google uk english female",
  ];
  const male = [
    "david", "mark", "george", "james", "daniel", "alex", "fred", "aaron",
    "arthur", "oliver", "ryan", "guy", "davis", "tony", "brandon", "eric",
    "christopher", "male", "rishi", "prabhat", "google uk english male",
  ];
  if (female.some((f) => n.includes(f))) return "female";
  if (male.some((m) => n.includes(m))) return "male";
  return "unknown";
}

/** Danh sách giọng tiếng Anh có trên thiết bị. */
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("en"));
}

export function loadVoicePref(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}

export function saveVoicePref(voiceName: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREF_KEY, voiceName);
  } catch {
    /* bỏ qua */
  }
}

/** Chọn giọng theo giới tính (lấy giọng đầu tiên khớp). */
export function pickVoiceByGender(gender: Gender): SpeechSynthesisVoice | null {
  const voices = getEnglishVoices();
  return voices.find((v) => guessGender(v.name) === gender) ?? null;
}

/** Lấy giọng đang ưu tiên: theo tên đã ghim, else giọng en-US, else giọng đầu. */
function preferredVoice(): SpeechSynthesisVoice | null {
  const voices = getEnglishVoices();
  if (voices.length === 0) return null;
  const prefName = loadVoicePref();
  return (
    (prefName && voices.find((v) => v.name === prefName)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0]
  );
}

/** Đọc to một câu tiếng Anh bằng giọng đã ghim. */
export function speak(text: string, rate = 0.95): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = preferredVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = "en-US";
  }
  u.rate = rate;
  synth.speak(u);
}
