"use client";

// Lớp bọc ngoài 1 chủ đề: CHIA PHẦN, mỗi phần 20 câu (tự động theo tổng số).
// - Chọn 1 phần → học theo thẻ (TopicQuiz).
// - Mỗi phần hiện tiến độ "đã thuộc x/20" + nút XEM các câu đã thuộc (và trả về
//   chưa thuộc).

import { useMemo, useState } from "react";
import type { Phrase } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import TopicQuiz from "./TopicQuiz";
import PhraseCard from "./PhraseCard";

interface TopicLearnProps {
  phrases: Phrase[];
}

const PART_SIZE = 20;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TopicLearn({ phrases }: TopicLearnProps) {
  const { progress, ready, toggle, toggleStar, isStarred } = useProgress();
  const [selected, setSelected] = useState<number | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);

  const parts = useMemo(() => chunk(phrases, PART_SIZE), [phrases]);

  if (phrases.length === 0) {
    return (
      <p className="py-10 text-center text-slate-400">
        Chủ đề này chưa có câu nào.
      </p>
    );
  }

  // ===== Xem danh sách CÂU ĐÃ THUỘC của 1 phần =====
  if (viewing !== null && parts[viewing]) {
    const learnedPhrases = parts[viewing].filter(
      (p) => progress[p.id]?.status === "learned"
    );
    return (
      <div>
        <button
          onClick={() => setViewing(null)}
          className="mb-4 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          ← Quay lại các phần
        </button>
        <h2 className="mb-3 text-lg font-bold text-slate-700">
          Phần {viewing + 1} · đã thuộc{" "}
          <span className="text-emerald-600">{learnedPhrases.length}</span> câu
        </h2>
        {learnedPhrases.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Phần này chưa có câu nào đã thuộc.
          </p>
        ) : (
          <div className="grid gap-3">
            {learnedPhrases.map((p) => (
              <PhraseCard
                key={p.id}
                phrase={p}
                learned
                onToggle={toggle}
                starred={isStarred(p.id)}
                onToggleStar={toggleStar}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== Học 1 phần cụ thể =====
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

  // Chỉ 1 phần & chưa xem đã-thuộc → vào học luôn.
  if (parts.length === 1) {
    return <TopicQuiz phrases={parts[0]} />;
  }

  // ===== Màn chọn phần =====
  const learnedIn = (part: Phrase[]) =>
    part.filter((p) => progress[p.id]?.status === "learned").length;

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">
        Chia làm <b>{parts.length}</b> phần, mỗi phần {PART_SIZE} câu:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((part, i) => {
          const from = i * PART_SIZE + 1;
          const to = from + part.length - 1;
          const learned = ready ? learnedIn(part) : 0;
          const done = learned === part.length;
          return (
            <div
              key={i}
              className={`rounded-2xl border p-4 ${
                done
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                onClick={() => setSelected(i)}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-800">
                    Phần {i + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    câu {from}–{to}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${(learned / part.length) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Đã thuộc {learned}/{part.length}
                  {done && " ✓"}
                </p>
              </button>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSelected(i)}
                  className="flex-1 rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Học phần này
                </button>
                {learned > 0 && (
                  <button
                    onClick={() => setViewing(i)}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    👁 Xem {learned}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
