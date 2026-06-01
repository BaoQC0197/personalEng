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
  // Chẩn đoán tạm: lộ URL (không bí mật) + thử fetch thô tới Supabase & internet.
  const u = process.env.SUPABASE_URL ?? "";
  const diag: Record<string, unknown> = {
    urlJSON: JSON.stringify(u),
    urlLen: u.length,
    hasKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
  try {
    const r = await fetch("https://example.com", { cache: "no-store" });
    diag.internet = r.status;
  } catch (e) {
    diag.internet = "FAIL: " + (e instanceof Error ? e.message : String(e));
  }
  try {
    const r = await fetch(u.trim() + "/rest/v1/", {
      headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "" },
      cache: "no-store",
    });
    diag.supabase = r.status;
  } catch (e) {
    diag.supabase = "FAIL: " + (e instanceof Error ? e.message : String(e));
  }
  return NextResponse.json({ notes: await readNotes(), diag });
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
    const cause = (e as { cause?: unknown })?.cause;
    const causeStr =
      cause instanceof Error
        ? `${cause.name}: ${cause.message} ${(cause as { code?: string }).code ?? ""}`
        : cause
        ? JSON.stringify(cause)
        : "";
    return NextResponse.json(
      { error: "Không thêm được.", detail, cause: causeStr },
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
