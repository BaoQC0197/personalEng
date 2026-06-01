"use client";

// MÀN HÌNH QUẢN LÝ TỪ VỰNG.
// Liệt kê mọi câu theo chủ đề + tìm kiếm + nút XÓA (xóa thật trong file JSON
// qua /api/phrases/delete). Mục đích: em tự gỡ những câu generate ra nhưng
// với em không thông dụng — giữ đúng triết lý "thế giới của em".

import { useMemo, useState } from "react";
import type { Phrase, Topic } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";

interface PhraseManagerProps {
  phrases: Phrase[];
  topics: Topic[];
}

export default function PhraseManager({ phrases, topics }: PhraseManagerProps) {
  const { isStarred } = useProgress();
  const [list, setList] = useState<Phrase[]>(phrases);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) =>
      `${p.en} ${p.vi} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(q)
    );
  }, [list, query]);

  const byTopic = useMemo(() => {
    const map: Record<string, Phrase[]> = {};
    for (const p of visible) (map[p.topicId] ??= []).push(p);
    return map;
  }, [visible]);

  async function handleDelete(p: Phrase) {
    if (
      !window.confirm(
        `Xóa câu này khỏi dữ liệu?\n\n"${p.en}"\n\nKhông thể hoàn tác.`
      )
    )
      return;
    setDeleting(p.id);
    try {
      const res = await fetch("/api/phrases/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, topicId: p.topicId }),
      });
      if (!res.ok) throw new Error();
      setList((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      window.alert("Xóa lỗi — kiểm tra server (npm run dev) còn chạy không.");
    } finally {
      setDeleting(null);
    }
  }

  const topicInfo = (id: string) => topics.find((t) => t.id === id);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Tìm câu cần xóa (tiếng Anh, nghĩa, tag)..."
        className="mb-6 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />

      {topics
        .filter((t) => (byTopic[t.id]?.length ?? 0) > 0)
        .map((t) => {
          const items = byTopic[t.id];
          const totalInTopic = list.filter((p) => p.topicId === t.id).length;
          return (
            <section key={t.id} className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                <span>{t.icon}</span>
                {t.title}
                <span className="font-normal normal-case text-slate-400">
                  ({totalInTopic} câu)
                </span>
              </h2>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {items.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-start gap-3 p-3 ${
                      i > 0 ? "border-t border-slate-100" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 font-medium text-slate-800">
                        {isStarred(p.id) && (
                          <span className="text-amber-400">★</span>
                        )}
                        {p.en}
                      </p>
                      <p className="text-sm text-slate-500">{p.vi}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deleting === p.id}
                      title="Xóa câu này"
                      className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deleting === p.id ? "Đang xóa…" : "🗑️ Xóa"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

      {visible.length === 0 && (
        <p className="py-10 text-center text-slate-400">
          Không tìm thấy câu nào khớp.
        </p>
      )}
    </div>
  );
}
