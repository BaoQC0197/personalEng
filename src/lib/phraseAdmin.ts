// ===== Lớp QUẢN LÝ nội dung (xóa câu) — chạy phía server =====
// Đọc/ghi trực tiếp các file src/data/phrases/<topicId>.json.
// Dùng cho màn hình "Quản lý từ vựng": em tự xóa câu generate ra mà với em
// không thông dụng (giữ đúng triết lý "chỉ học câu thuộc thế giới của em").
// Lưu ý: ghi file chỉ chạy được khi dev local; lên Supabase sau sẽ đổi phần thân.

import { promises as fs } from "fs";
import path from "path";
import type { Phrase } from "./types";
import { getSupabase } from "./supabase";

const PHRASES_DIR = path.join(process.cwd(), "src", "data", "phrases");

/** topicId chỉ được chứa chữ thường, số, gạch ngang (chặn path traversal). */
function safeTopicId(topicId: string): boolean {
  return /^[a-z0-9-]+$/.test(topicId);
}

function fileFor(topicId: string): string {
  return path.join(PHRASES_DIR, `${topicId}.json`);
}

/** Xóa 1 câu khỏi file chủ đề của nó. Trả về số câu còn lại. */
export async function deletePhrase(
  topicId: string,
  phraseId: string
): Promise<{ ok: boolean; remaining: number }> {
  if (!safeTopicId(topicId)) return { ok: false, remaining: -1 };

  // Có Supabase -> xóa trong DB (nguồn dữ liệu thật trên production).
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("phrases").delete().eq("id", phraseId);
    if (error) return { ok: false, remaining: -1 };
    const { count } = await sb
      .from("phrases")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", topicId);
    return { ok: true, remaining: count ?? 0 };
  }

  const file = fileFor(topicId);
  let list: Phrase[];
  try {
    list = JSON.parse(await fs.readFile(file, "utf-8")) as Phrase[];
  } catch {
    return { ok: false, remaining: -1 };
  }

  const next = list.filter((p) => p.id !== phraseId);
  if (next.length === list.length) {
    // Không tìm thấy id — coi như đã xóa rồi.
    return { ok: true, remaining: next.length };
  }

  await fs.writeFile(file, JSON.stringify(next, null, 2) + "\n", "utf-8");
  return { ok: true, remaining: next.length };
}
