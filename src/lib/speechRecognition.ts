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

export interface RecoController {
  stop: () => void;
  abort: () => void;
}

export interface RecoHandlers {
  lang?: string;
  onInterim?: (text: string) => void; // chữ tạm thời lúc đang nói
  onDone?: (said: string) => void; // chuỗi gộp khi kết thúc (gồm nhiều phương án)
  onError?: (code: string) => void;
}

// Giữ phiên đang chạy để hủy trước khi mở phiên mới (tránh xung đột).
let active: any = null;

/**
 * Bắt đầu nhận diện kiểu "bấm để nói → nói cả câu → bấm dừng".
 * continuous + interim để không bị cắt sớm; gom tối đa 3 phương án/đoạn để
 * công bằng hơn với giọng có âm sắc (vẫn cần nói trúng từ mới được tính).
 */
export function startRecognition(h: RecoHandlers): RecoController | null {
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!SR) {
    h.onError?.("unsupported");
    return null;
  }
  if (active) {
    try {
      active.abort();
    } catch {
      /* bỏ qua */
    }
    active = null;
  }

  const rec = new SR();
  active = rec;
  rec.lang = h.lang ?? "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 3;

  const collected: string[] = [];
  let hadError = false;

  rec.onresult = (e: any) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) {
        const n = Math.min(r.length, 3);
        for (let a = 0; a < n; a++) collected.push(r[a].transcript);
      } else {
        interim += r[0].transcript;
      }
    }
    if (interim) h.onInterim?.(interim);
  };
  rec.onerror = (e: any) => {
    hadError = true;
    h.onError?.(e?.error || "error");
  };
  rec.onend = () => {
    if (active === rec) active = null;
    if (!hadError) h.onDone?.(collected.join(" "));
  };

  try {
    rec.start();
  } catch {
    if (active === rec) active = null;
    h.onError?.("start-failed");
    return null;
  }

  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* bỏ qua */
      }
    },
    abort: () => {
      try {
        rec.abort();
      } catch {
        /* bỏ qua */
      }
    },
  };
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
