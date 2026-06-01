// API xóa 1 câu khỏi dữ liệu (file JSON của chủ đề).
// POST body: { id, topicId }
import { NextResponse } from "next/server";
import { deletePhrase } from "@/lib/phraseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    const topicId = String(body.topicId ?? "");
    if (!id || !topicId) {
      return NextResponse.json({ error: "Thiếu id/topicId." }, { status: 400 });
    }
    const result = await deletePhrase(topicId, id);
    if (!result.ok) {
      return NextResponse.json({ error: "Không xóa được." }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }
}
