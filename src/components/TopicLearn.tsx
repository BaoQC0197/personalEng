"use client";

// Lớp bọc ngoài 1 chủ đề: CHIA PHẦN, mỗi phần 20 câu (tự động theo tổng số).
// Em chọn 1 phần → vào học theo thẻ (TopicQuiz) đúng 20 câu của phần đó.
// Mỗi phần hiện tiến độ "đã thuộc x/20" để em biết phần nào cần ôn.

import { useMemo, useState } from "react";
import type { Phrase } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import TopicQuiz from "./TopicQuiz";

interface TopicLearnProps {
  phrases: Phrase[];
}

const PART_SIZE = 20;

/** Chia mảng thành các phần kích thước cố định. */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TopicLearn({ phrases }: TopicLearnProps) {
  const { progress, ready } = useProgress();
  const [selected, setSelected] = useState<number | null>(null);

  const parts = useMemo(() => chunk(phrases, PART_SIZE), [phrases]);

  if (phrases.length === 0) {
    return (
      <p className="py-10 text-center text-slate-400">
        Chủ đề này chưa có câu nào.
      </p>
    );
  }

  // Chỉ 1 phần → vào học luôn, khỏi cần chọn.
  if (parts.length === 1 && selected === null) {
    return <TopicQuiz phrases={parts[0]} />;
  }

  // Đang học 1 phần cụ thể.
  if (selected !== null && parts[selected]) {
    const from = selected * PART_SIZE + 1;
    const to = from + parts[selected].length - 1;
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="mb-4 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          ← Chọn phần khác
        </button>
        <h2 className="mb-4 text-lg font-bold text-slate-700">
          Phần {selected + 1}{" "}
          <span className="font-normal text-slate-400">
            · câu {from}–{to}
          </span>
        </h2>
        <TopicQuiz key={selected} phrases={parts[selected]} />
      </div>
    );
  }

  // Màn chọn phần.
  const learnedIn = (part: Phrase[]) =>
    part.filter((p) => progress[p.id]?.status === "learned").length;

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        Chủ đề chia làm <b>{parts.length}</b> phần, mỗi phần {PART_SIZE} câu. Chọn
        một phần để học:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((part, i) => {
          const from = i * PART_SIZE + 1;
          const to = from + part.length - 1;
          const learned = ready ? learnedIn(part) : 0;
          const done = learned === part.length;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-2xl border p-4 text-left transition hover:shadow-md ${
                done
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-brand-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Phần {i + 1}</span>
                {done && <span className="text-sm">✓</span>}
              </div>
              <p className="text-xs text-slate-400">
                câu {from}–{to}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${(learned / part.length) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Đã thuộc {learned}/{part.length}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
