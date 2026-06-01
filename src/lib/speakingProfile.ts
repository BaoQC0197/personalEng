// ===== Lớp truy cập "Thói quen nói chuyện của em" =====
// Đọc/ghi file src/data/speaking-profile.json (chạy phía server).
// Mục đích: em nhập cách mình nói tiếng Việt -> lưu file thật -> thầy đọc
// file này để generate câu tiếng Anh đúng giọng của em.
// Sau này lên Supabase: thay phần thân read()/write() bằng query (kèm user_id)
// mà không phải sửa giao diện / API route.

import { promises as fs } from "fs";
import path from "path";
import type { SpeakingProfile } from "./types";
import { getSupabase } from "./supabase";

const FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "speaking-profile.json"
);

const EMPTY: SpeakingProfile = {
  fillers: "",
  dailyLines: "",
  personality: "",
  stuckSituations: "",
  updatedAt: "",
};

/** Đọc hồ sơ thói quen nói chuyện (Supabase nếu có, không thì file). */
export async function readSpeakingProfile(): Promise<SpeakingProfile> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from("speaking_profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return {
      fillers: data?.fillers ?? "",
      dailyLines: data?.daily_lines ?? "",
      personality: data?.personality ?? "",
      stuckSituations: data?.stuck_situations ?? "",
      updatedAt: data?.updated_at ?? "",
    };
  }
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<SpeakingProfile>) };
  } catch {
    return EMPTY;
  }
}

/** Ghi hồ sơ thói quen nói chuyện (chỉ nhận 4 ô nội dung). */
export async function writeSpeakingProfile(
  input: Omit<SpeakingProfile, "updatedAt">,
  nowIso: string
): Promise<SpeakingProfile> {
  const next: SpeakingProfile = {
    fillers: input.fillers ?? "",
    dailyLines: input.dailyLines ?? "",
    personality: input.personality ?? "",
    stuckSituations: input.stuckSituations ?? "",
    updatedAt: nowIso,
  };
  const sb = getSupabase();
  if (sb) {
    await sb.from("speaking_profile").upsert(
      {
        id: 1,
        fillers: next.fillers,
        daily_lines: next.dailyLines,
        personality: next.personality,
        stuck_situations: next.stuckSituations,
        updated_at: nowIso,
      },
      { onConflict: "id" }
    );
    return next;
  }
  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
  return next;
}
