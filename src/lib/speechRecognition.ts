// ===== Nhận diện giọng nói (Web Speech API - SpeechRecognition) =====
// Dùng để LUYỆN NÓI: em nói câu tiếng Anh -> máy nhận ra chữ -> so với câu đúng.
// Chạy khi bấm mic (không ảnh hưởng tải trang). Cần mạng + quyền micro.
// Tốt trên Chrome/Android; iOS Safari hỗ trợ hạn chế.

/* eslint-disable @typescript-eslint/no-explicit-any */

export function recognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}

/** Bật mic, nghe 1 câu, trả về chuỗi nhận diện được (hoặc reject nếu lỗi). */
export function recognizeOnce(lang = "en-US"): Promise<string> {
  return new Promise((resolve, reject) => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      reject(new Error("unsupported"));
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    let settled = false;

    rec.onresult = (e: any) => {
      settled = true;
      const transcript = e.results?.[0]?.[0]?.transcript ?? "";
      resolve(String(transcript));
    };
    rec.onerror = (e: any) => {
      if (settled) return;
      settled = true;
      reject(new Error(e?.error || "error"));
    };
    rec.onend = () => {
      if (settled) return;
      settled = true;
      reject(new Error("no-speech"));
    };

    try {
      rec.start();
    } catch {
      reject(new Error("start-failed"));
    }
  });
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Chấm điểm: % số từ trong câu đúng mà em đã nói trúng (0-100). */
export function scoreMatch(target: string, said: string): number {
  const t = normalize(target).split(" ").filter(Boolean);
  if (t.length === 0) return 0;
  const saidWords = normalize(said).split(" ").filter(Boolean);
  const pool = [...saidWords];
  let hit = 0;
  for (const w of t) {
    const idx = pool.indexOf(w);
    if (idx !== -1) {
      hit++;
      pool.splice(idx, 1); // mỗi từ nói chỉ tính 1 lần
    }
  }
  return Math.round((hit / t.length) * 100);
}
