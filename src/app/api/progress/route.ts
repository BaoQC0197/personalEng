// API tiến độ học.
// GET  -> { configured, progress }. configured=false => client tự dùng localStorage.
// POST -> { phraseId, action: "toggleLearned" | "toggleStar" } -> cập nhật & trả về entry.
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  readAllProgress,
  toggleLearnedDb,
  toggleStarDb,
} from "@/lib/progressDb";

// Edge runtime: cold start gần như bằng 0 (route này chỉ gọi Supabase qua fetch).
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ configured: false, progress: {} });
  }
  return NextResponse.json({ configured: true, progress: await readAllProgress() });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ configured: false });
  }
  try {
    const { phraseId, action } = await request.json();
    if (!phraseId) {
      return NextResponse.json({ error: "Thiếu phraseId." }, { status: 400 });
    }
    const now = new Date().toISOString();
    const entry =
      action === "toggleStar"
        ? await toggleStarDb(String(phraseId), now)
        : await toggleLearnedDb(String(phraseId), now);
    if (!entry) {
      return NextResponse.json({ error: "Cập nhật lỗi." }, { status: 400 });
    }
    return NextResponse.json({ phraseId, entry });
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }
}
