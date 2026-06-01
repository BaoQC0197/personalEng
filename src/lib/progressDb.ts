// ===== Lớp truy cập TIẾN ĐỘ trên Supabase (phía server) =====
// Dùng bởi API /api/progress. App 1 người dùng nên không cần user_id.

import { getSupabase } from "./supabase";
import type { ProgressMap, PhraseProgress } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProgress(r: any): PhraseProgress {
  return {
    status: r.status === "learned" ? "learned" : "learning",
    reviewedCount: r.reviewed_count ?? 0,
    starred: r.starred ?? false,
    updatedAt: r.updated_at ?? "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Đọc toàn bộ tiến độ thành map phraseId -> tiến độ. */
export async function readAllProgress(): Promise<ProgressMap> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from("user_progress").select("*");
  if (error || !data) return {};
  const map: ProgressMap = {};
  for (const r of data) map[r.phrase_id] = rowToProgress(r);
  return map;
}

async function currentOf(phraseId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("user_progress")
    .select("*")
    .eq("phrase_id", phraseId)
    .maybeSingle();
  return {
    sb,
    status: data?.status === "learned" ? "learned" : "learning",
    reviewedCount: data?.reviewed_count ?? 0,
    starred: data?.starred ?? false,
  };
}

/** Đảo trạng thái đã thuộc của 1 câu. */
export async function toggleLearnedDb(
  phraseId: string,
  nowIso: string
): Promise<PhraseProgress | null> {
  const cur = await currentOf(phraseId);
  if (!cur) return null;
  const nextStatus = cur.status === "learned" ? "learning" : "learned";
  const row = {
    phrase_id: phraseId,
    status: nextStatus,
    reviewed_count:
      nextStatus === "learned" ? cur.reviewedCount + 1 : cur.reviewedCount,
    starred: cur.starred,
    updated_at: nowIso,
  };
  const { error } = await cur.sb
    .from("user_progress")
    .upsert(row, { onConflict: "phrase_id" });
  if (error) return null;
  return rowToProgress(row);
}

/** Đảo dấu sao quan trọng của 1 câu. */
export async function toggleStarDb(
  phraseId: string,
  nowIso: string
): Promise<PhraseProgress | null> {
  const cur = await currentOf(phraseId);
  if (!cur) return null;
  const row = {
    phrase_id: phraseId,
    status: cur.status,
    reviewed_count: cur.reviewedCount,
    starred: !cur.starred,
    updated_at: nowIso,
  };
  const { error } = await cur.sb
    .from("user_progress")
    .upsert(row, { onConflict: "phrase_id" });
  if (error) return null;
  return rowToProgress(row);
}
