// API "Sổ tay từ vựng".
// GET    -> danh sách ghi chú.
// POST   -> thêm ghi chú { term, note }.
// DELETE -> xóa ghi chú theo ?id=...
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readNotes, addNote, removeNote } from "@/lib/vocabNotes";

export const dynamic = "force-dynamic";

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
      randomUUID(),
      new Date().toISOString()
    );
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json({ error: "Không thêm được." }, { status: 400 });
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
