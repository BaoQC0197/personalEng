"use client";

// Danh sách cụm từ của 1 chủ đề: có thanh tiến độ, lọc trạng thái, tìm kiếm.

import { useMemo, useState } from "react";
import type { Phrase, StatusFilter } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import PhraseCard from "./PhraseCard";
import ProgressBar from "./ProgressBar";

interface PhraseListProps {
  phrases: Phrase[];
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "learning", label: "Đang học" },
  { value: "learned", label: "Đã thuộc" },
];

export default function PhraseList({ phrases }: PhraseListProps) {
  const { progress, ready, toggle } = useProgress();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const learnedCount = useMemo(
    () => phrases.filter((p) => progress[p.id]?.status === "learned").length,
    [phrases, progress]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return phrases.filter((p) => {
      const status = progress[p.id]?.status ?? "learning";
      if (filter !== "all" && status !== filter) return false;
      if (q) {
        const haystack = `${p.en} ${p.vi} ${(p.tags ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [phrases, progress, filter, query]);

  return (
    <div>
      <ProgressBar learned={learnedCount} total={phrases.length} className="mb-5" />

      {/* Thanh công cụ: tìm kiếm + lọc */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Tìm cụm từ, nghĩa, tag..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <div className="flex shrink-0 gap-1 rounded-xl bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f.value
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách */}
      {!ready ? (
        <p className="py-10 text-center text-slate-400">Đang tải...</p>
      ) : visible.length === 0 ? (
        <p className="py-10 text-center text-slate-400">
          Không có cụm từ nào khớp bộ lọc.
        </p>
      ) : (
        <div className="grid gap-4">
          {visible.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              learned={progress[phrase.id]?.status === "learned"}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
