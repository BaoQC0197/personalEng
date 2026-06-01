// ===== Lớp truy cập "Sổ tay từ vựng" — chạy phía server =====
// Đọc/ghi file src/data/vocab-notes.json (mảng các ghi chú).
// Em tự take note từ vựng thấy lạ/quan trọng; sau này thầy có thể đọc file này
// để biến thành câu học chính thức (giống luồng /habits).
// Lưu file chỉ chạy local; lên Supabase sau sẽ đổi phần thân.

import { promises as fs } from "fs";
import path from "path";
import type { VocabNote } from "./types";
import { getSupabase } from "./supabase";

const FILE_PATH = path.join(process.cwd(), "src", "data", "vocab-notes.json");

/* eslint-disable @typescript-eslint/no-explicit-any */
const rowToNote = (r: any): VocabNote => ({
  id: r.id,
  term: r.term,
  note: r.note ?? undefined,
  createdAt: r.created_at ?? "",
});
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Đọc toàn bộ ghi chú (mới nhất ở đầu). */
export async function readNotes(): Promise<VocabNote[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("vocab_notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToNote);
  }
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    const list = JSON.parse(raw) as VocabNote[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writeNotes(list: VocabNote[]): Promise<void> {
  await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2) + "\n", "utf-8");
}

/** Thêm 1 ghi chú mới lên đầu danh sách. */
export async function addNote(
  term: string,
  note: string,
  id: string,
  nowIso: string
): Promise<VocabNote> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("vocab_notes")
      .insert({ term: term.trim(), note: note.trim() || null })
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "insert failed");
    return rowToNote(data);
  }
  const list = await readNotes();
  const entry: VocabNote = {
    id,
    term: term.trim(),
    note: note.trim() || undefined,
    createdAt: nowIso,
  };
  await writeNotes([entry, ...list]);
  return entry;
}

/** Xóa 1 ghi chú theo id. Trả về số còn lại. */
export async function removeNote(id: string): Promise<number> {
  const sb = getSupabase();
  if (sb) {
    await sb.from("vocab_notes").delete().eq("id", id);
    const { count } = await sb
      .from("vocab_notes")
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  }
  const list = await readNotes();
  const next = list.filter((n) => n.id !== id);
  await writeNotes(next);
  return next.length;
}
