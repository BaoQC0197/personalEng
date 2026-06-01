"use client";

// SỔ TAY TỪ VỰNG — em tự take note từ/cụm thấy "lạ mà quan trọng".
// Thêm nhanh (từ + ghi chú tuỳ chọn), xem danh sách, xóa. Lưu file qua /api/notes.

import { useEffect, useState } from "react";
import type { VocabNote } from "@/lib/types";

export default function VocabNotes({
  initialNotes = [],
}: {
  initialNotes?: VocabNote[];
}) {
  // Hiện NGAY danh sách dựng sẵn từ server (không chờ 10s).
  const [notes, setNotes] = useState<VocabNote[]>(initialNotes);
  const [loading] = useState(false);
  const [term, setTerm] = useState("");
  const [note, setNote] = useState("");

  // Đồng bộ NGẦM phòng dữ liệu cache hơi cũ (không chặn, lỗi thì kệ).
  useEffect(() => {
    let alive = true;
    fetch("/api/notes")
      .then((r) => r.json())
      .then((list: VocabNote[]) => {
        if (!alive || !Array.isArray(list)) return;
        setNotes((prev) => {
          const ids = new Set(list.map((n) => n.id));
          const localExtra = prev.filter(
            (n) => !ids.has(n.id) && n.id.startsWith("temp-")
          );
          return [...localExtra, ...list];
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const t = term.trim();
    if (!t) return;
    // Hiện ngay (optimistic), không bắt em chờ API.
    const tempId = "temp-" + Date.now() + "-" + Math.round(performance.now());
    const optimistic: VocabNote = {
      id: tempId,
      term: t,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [optimistic, ...prev]);
    setTerm("");
    setNote("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: t, note: optimistic.note ?? "" }),
      });
      if (!res.ok) throw new Error();
      const entry: VocabNote = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === tempId ? entry : n)));
    } catch {
      setNotes((prev) => prev.filter((n) => n.id !== tempId));
      window.alert("Lưu lỗi — kiểm tra mạng rồi thử lại nhé.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Xóa ghi chú này?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id)); // xóa lạc quan
    try {
      await fetch(`/api/notes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      /* nếu lỗi mạng, lần tải sau sẽ đồng bộ lại */
    }
  }

  return (
    <div>
      {/* Form thêm nhanh */}
      <form
        onSubmit={add}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Từ / cụm muốn ghi nhớ (vd: heads-up, get the hang of it...)"
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-[15px] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Ghi chú (tuỳ chọn): nghĩa, vì sao thấy hay, gặp ở đâu..."
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        <button
          type="submit"
          disabled={!term.trim()}
          className="mt-2 w-full rounded-xl bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 sm:w-auto sm:px-6"
        >
          ➕ Thêm vào sổ tay
        </button>
      </form>

      {/* Danh sách */}
      {loading ? (
        <p className="py-10 text-center text-slate-400">Đang tải…</p>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <p className="text-4xl">📝</p>
          <p className="mt-3 text-slate-500">
            Chưa có ghi chú nào. Gặp từ nào hay, thêm vào đây ngay nhé!
          </p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">
            {notes.length} ghi chú
          </p>
          <div className="grid gap-3">
            {notes.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-slate-800">
                    {n.term}
                  </p>
                  {n.note && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                      {n.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(n.id)}
                  title="Xóa ghi chú"
                  aria-label="Xóa ghi chú"
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm text-rose-500 transition hover:bg-rose-50"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
