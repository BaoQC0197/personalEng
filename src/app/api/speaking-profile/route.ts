// API đọc/ghi "Thói quen nói chuyện của em".
// GET  -> trả về hồ sơ hiện tại.
// POST -> lưu 4 ô nội dung em vừa nhập xuống file.
import { NextResponse } from "next/server";
import {
  readSpeakingProfile,
  writeSpeakingProfile,
} from "@/lib/speakingProfile";

// Luôn chạy động (đọc/ghi file), không cache.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const profile = await readSpeakingProfile();
  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await writeSpeakingProfile(
      {
        fillers: String(body.fillers ?? ""),
        dailyLines: String(body.dailyLines ?? ""),
        personality: String(body.personality ?? ""),
        stuckSituations: String(body.stuckSituations ?? ""),
      },
      new Date().toISOString()
    );
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json(
      { error: "Không lưu được hồ sơ." },
      { status: 400 }
    );
  }
}
