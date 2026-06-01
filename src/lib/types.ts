// ===== Kiểu dữ liệu lõi của ứng dụng =====
// Thiết kế để dễ chuyển sang Supabase sau này: mỗi interface ứng với 1 bảng.

/** Một chủ đề học, ví dụ: "Công việc QA", "Giao tiếp đồng nghiệp". */
export interface Topic {
  /** id duy nhất, dùng làm slug trên URL. vd: "qa-testing" */
  id: string;
  /** Tên hiển thị tiếng Việt. vd: "Công việc QA / Testing" */
  title: string;
  /** Mô tả ngắn về chủ đề. */
  description: string;
  /** Emoji icon hiển thị cho đẹp. */
  icon: string;
  /** Mã màu accent (tailwind gradient classes) cho thẻ chủ đề. */
  accent: string;
}

/** Một cụm từ / câu cần học. */
export interface Phrase {
  /** id duy nhất toàn cục. vd: "qa-001" */
  id: string;
  /** id của chủ đề chứa cụm từ này. */
  topicId: string;
  /** Câu / cụm tiếng Anh. */
  en: string;
  /** Nghĩa tiếng Việt. */
  vi: string;
  /** Phiên âm IPA (tuỳ chọn). vd: "/ˈbʌɡ/" */
  ipa?: string;
  /**
   * Các đoạn cần highlight trong câu tiếng Anh (để ghi nhớ phần trọng tâm).
   * Phải khớp chính xác chuỗi con trong `en`. vd: ["reproduce", "the bug"]
   */
  highlights?: string[];
  /** Ghi chú / mẹo dùng (tuỳ chọn). vd: "Dùng trong daily standup" */
  note?: string;
  /** Ví dụ thêm trong ngữ cảnh (tuỳ chọn). */
  example?: string;
  /** Nhãn phụ để lọc, vd: ["standup", "bug report"]. */
  tags?: string[];
}

/** Tiến độ học của 1 cụm từ — lưu riêng (localStorage giờ, Supabase sau). */
export interface PhraseProgress {
  /** "learned" = đã thuộc, "learning" = đang học (mặc định). */
  status: "learning" | "learned";
  /** Số lần đánh dấu đã thuộc (để thống kê đơn giản). */
  reviewedCount: number;
  /** Đánh dấu "câu quan trọng" (sao vàng ⭐). Độc lập với status. */
  starred?: boolean;
  /** Mốc thời gian cập nhật gần nhất (ISO string). */
  updatedAt: string;
}

/** Toàn bộ tiến độ: map từ phraseId -> tiến độ. */
export type ProgressMap = Record<string, PhraseProgress>;

/** Bộ lọc trạng thái trên giao diện. */
export type StatusFilter = "all" | "learning" | "learned";

/**
 * Một ghi chú từ vựng em tự take note — từ/cụm em thấy "quái lạ mà quan trọng,
 * sao giờ mới biết". Lưu file `src/data/vocab-notes.json`; Supabase sau.
 */
export interface VocabNote {
  /** id duy nhất. */
  id: string;
  /** Từ/cụm tiếng Anh (hoặc bất cứ thứ gì em muốn ghi). */
  term: string;
  /** Ghi chú của em: nghĩa, vì sao đáng nhớ, ngữ cảnh gặp... (tuỳ chọn). */
  note?: string;
  /** Mốc tạo (ISO string). */
  createdAt: string;
}

/**
 * "Thói quen nói chuyện của em" — kho em tự bỏ vào cách mình nói tiếng Việt
 * hằng ngày, để thầy đọc và generate ra câu tiếng Anh đúng giọng của em.
 * Lưu file `src/data/speaking-profile.json` giờ; Supabase sau (1 bảng riêng).
 */
export interface SpeakingProfile {
  /** ① Từ cửa miệng / từ nối khi em nói. vd: "thật ra thì, kiểu như..." */
  fillers: string;
  /** ② Câu em lặp đi lặp lại hằng ngày ở chỗ làm. */
  dailyLines: string;
  /** ③ Tính cách & phong cách nói của em (thẳng/hài/lịch sự...). */
  personality: string;
  /** ④ Tình huống gần đây em muốn nói bằng tiếng Anh mà bí. */
  stuckSituations: string;
  /** Mốc cập nhật gần nhất (ISO string). */
  updatedAt: string;
}
