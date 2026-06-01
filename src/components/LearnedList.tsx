"use client";

// Hiển thị toàn bộ cụm từ đã thuộc (mọi chủ đề), kèm nút reset tiến độ.

import { useMemo } from "react";
import Link from "next/link";
import type { Phrase, Topic } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import { clearProgress } from "@/lib/storage";
import PhraseCard from "./PhraseCard";

interface LearnedListProps {
  phrases: Phrase[];
  topics: Topic[];
}

export default function LearnedList({ phrases, topics }: LearnedListProps) {
  const { progress, ready, toggle, toggleStar, isStarred } = useProgress();

  const topicTitle = (id: string) =>
    topics.find((t) => t.id === id)?.title ?? id;

  const learned = useMemo(
    () => phrases.filter((p) => progress[p.id]?.status === "learned"),
    [phrases, progress]
  );

  // Gom theo chủ đề.
  const grouped = useMemo(() => {
    const map: Record<string, Phrase[]> = {};
    for (const p of learned) {
      (map[p.topicId] ??= []).push(p);
    }
    return map;
  }, [learned]);

  const handleReset = () => {
    if (window.confirm("Xoá toàn bộ tiến độ đã thuộc? Hành động này không thể hoàn tác.")) {
      clearProgress();
      window.location.reload();
    }
  };

  if (!ready) {
    return <p className="py-10 text-center text-slate-400">Đang tải...</p>;
  }

  if (learned.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
        <p className="text-4xl">🌱</p>
        <p className="mt-3 text-slate-500">
          Chưa có cụm từ nào được đánh dấu đã thuộc.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Bắt đầu học
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Tổng cộng <strong className="text-emerald-600">{learned.length}</strong>{" "}
          cụm từ đã thuộc 🎉
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
        >
          Reset tiến độ
        </button>
      </div>

      {Object.entries(grouped).map(([topicId, items]) => (
        <section key={topicId}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
            {topicTitle(topicId)}
          </h2>
          <div className="grid gap-4">
            {items.map((phrase) => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                learned
                onToggle={toggle}
                starred={isStarred(phrase.id)}
                onToggleStar={toggleStar}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
