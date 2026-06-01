// API "Sổ tay từ vựng".
// GET    -> danh sách ghi chú.
// POST   -> thêm ghi chú { term, note }.
// DELETE -> xóa ghi chú theo ?id=...
import { NextResponse } from "next/server";
import { readNotes, addNote, removeNote } from "@/lib/vocabNotes";

// id ngẫu nhiên không phụ thuộc import "crypto" (tránh lỗi bundle trên serverless).
function genId(): string {
  const g = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (g?.randomUUID) return g.randomUUID();
  return "n-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json(await readNotes());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const term = String(body.term ?? "").trim();
    if (!term) {
      return NextResponse.json({ error: "Thiếu từ vựng." }, { status: 400 });
    }
    const entry = await addNote(
      term,
      String(body.note ?? ""),
      genId(),
      new Date().toISOString()
    );
    return NextResponse.json(entry);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Không thêm được.", detail },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Thiếu id." }, { status: 400 });
  }
  const remaining = await removeNote(id);
  return NextResponse.json({ ok: true, remaining });
}
