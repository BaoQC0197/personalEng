// ===== Lớp truy cập TIẾN ĐỘ học (đã thuộc / đang học) =====
// Hiện lưu ở localStorage của trình duyệt.
// Sau này lên Supabase: thay phần thân load()/save() bằng query Supabase
// (kèm user_id) mà không phải sửa giao diện.

import type { ProgressMap, PhraseProgress } from "./types";

const STORAGE_KEY = "personal-english:progress:v1";

/** Đọc toàn bộ tiến độ từ localStorage. */
export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

/** Ghi toàn bộ tiến độ xuống localStorage. */
export function saveProgress(progress: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Bỏ qua nếu localStorage đầy / bị chặn.
  }
}

/** Lấy trạng thái 1 cụm từ (mặc định "đang học"). */
export function getPhraseProgress(
  progress: ProgressMap,
  phraseId: string
): PhraseProgress {
  return (
    progress[phraseId] ?? {
      status: "learning",
      reviewedCount: 0,
      starred: false,
      updatedAt: "",
    }
  );
}

/**
 * Đảo trạng thái đã thuộc của 1 cụm từ và trả về ProgressMap mới.
 * Lưu ý: thời gian được truyền vào để tránh phụ thuộc trực tiếp Date trong logic.
 */
export function toggleLearned(
  progress: ProgressMap,
  phraseId: string,
  nowIso: string
): ProgressMap {
  const current = getPhraseProgress(progress, phraseId);
  const nextStatus = current.status === "learned" ? "learning" : "learned";
  const next: PhraseProgress = {
    status: nextStatus,
    reviewedCount:
      nextStatus === "learned"
        ? current.reviewedCount + 1
        : current.reviewedCount,
    starred: current.starred ?? false, // giữ nguyên dấu sao khi đổi trạng thái
    updatedAt: nowIso,
  };
  return { ...progress, [phraseId]: next };
}

/** Đảo dấu sao "quan trọng" của 1 cụm từ, trả về ProgressMap mới. */
export function toggleStarred(
  progress: ProgressMap,
  phraseId: string,
  nowIso: string
): ProgressMap {
  const current = getPhraseProgress(progress, phraseId);
  const next: PhraseProgress = {
    ...current,
    starred: !current.starred,
    updatedAt: nowIso,
  };
  return { ...progress, [phraseId]: next };
}

/** Xoá toàn bộ tiến độ (reset). */
export function clearProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
