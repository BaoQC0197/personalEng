"use client";

// CHẾ ĐỘ LUYỆN NHỚ (active recall): hiện tiếng Việt + tình huống,
// người học tự bật ra tiếng Anh TRƯỚC, rồi lật thẻ kiểm tra.
// Mục tiêu: chuyển vốn từ "bị động" (nhìn hiểu) -> "chủ động" (nói ra được).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Phrase, Topic } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import { speak } from "@/lib/speech";
import { recognitionSupported } from "@/lib/speechRecognition";
import SpeakCheck from "./SpeakCheck";
import Highlight from "./Highlight";

interface PracticeSessionProps {
  phrases: Phrase[];
  topics: Topic[];
}

/** Trộn ngẫu nhiên mảng (Fisher–Yates), không làm thay đổi mảng gốc. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeSession({ phrases, topics }: PracticeSessionProps) {
  const { toggle, isLearned, ready } = useProgress();

  // --- Cấu hình trước khi bắt đầu ---
  const [scope, setScope] = useState<string>("all");
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [started, setStarted] = useState(false);

  // --- Trạng thái phiên luyện ---
  const [deck, setDeck] = useState<Phrase[]>([]);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [remembered, setRemembered] = useState(0);
  const [reviewed, setReviewed] = useState(0);

  const pool = useMemo(() => {
    let list = scope === "all" ? phrases : phrases.filter((p) => p.topicId === scope);
    if (onlyUnlearned) list = list.filter((p) => !isLearned(p.id));
    return list;
  }, [phrases, scope, onlyUnlearned, isLearned]);

  const start = () => {
    setDeck(shuffle(pool));
    setPos(0);
    setRevealed(false);
    setRemembered(0);
    setReviewed(0);
    setStarted(true);
  };

  const current = deck[pos];

  // Lật thẻ -> tự đọc câu tiếng Anh bằng giọng đã ghim (đồng bộ với chế độ quiz).
  useEffect(() => {
    if (revealed && current) speak(current.en);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  const next = (gotIt: boolean) => {
    setReviewed((n) => n + 1);
    if (gotIt) {
      setRemembered((n) => n + 1);
      if (current && !isLearned(current.id)) toggle(current.id);
    } else if (current) {
      // Chưa nhớ -> cho thẻ này quay lại cuối hàng để ôn lại.
      setDeck((d) => [...d, current]);
    }
    setRevealed(false);
    setPos((p) => p + 1);
  };

  if (!ready) {
    return <p className="py-10 text-center text-slate-400">Đang tải...</p>;
  }

  // ---------- Màn hình cấu hình ----------
  if (!started) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-800">Luyện nhớ chủ động</h2>
        <p className="mt-1 text-sm text-slate-500">
          Nhìn <strong>tiếng Việt</strong>, tự bật ra <strong>tiếng Anh</strong>{" "}
          trong đầu (hoặc nói thành tiếng), rồi lật thẻ để kiểm tra. Đây là cách
          chữa đúng bệnh “hiểu mà nói không ra”.
        </p>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Chọn chủ đề
        </label>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          <option value="all">Tất cả chủ đề</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.title}
            </option>
          ))}
        </select>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyUnlearned}
            onChange={(e) => setOnlyUnlearned(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Chỉ luyện những câu <strong>chưa thuộc</strong>
        </label>

        <p className="mt-4 text-sm text-slate-500">
          Số thẻ trong phiên: <strong className="text-brand-600">{pool.length}</strong>
        </p>

        <button
          type="button"
          onClick={start}
          disabled={pool.length === 0}
          className="mt-5 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Bắt đầu luyện →
        </button>
      </div>
    );
  }

  // ---------- Màn hình kết thúc ----------
  if (pos >= deck.length) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-3 text-lg font-bold text-slate-800">Hoàn thành phiên!</h2>
        <p className="mt-2 text-slate-600">
          Em đã ôn <strong>{reviewed}</strong> lượt, bật ra đúng{" "}
          <strong className="text-emerald-600">{remembered}</strong> câu.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Luyện lại
          </button>
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Đổi chủ đề
          </button>
        </div>
      </div>
    );
  }

  // ---------- Thẻ đang luyện ----------
  const topicTitle = topics.find((t) => t.id === current.topicId)?.title ?? "";

  return (
    <div>
      {/* Tiến trình */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>
          Thẻ {pos + 1}/{deck.length}
        </span>
        <span>✓ {remembered} nhớ được</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${(pos / deck.length) * 100}%` }}
        />
      </div>

      <div className="animate-pop-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {topicTitle}
          {current.tags && current.tags.length > 0 && (
            <span className="ml-2 font-normal text-slate-400">
              · {current.tags.join(", ")}
            </span>
          )}
        </p>

        {/* MẶT TRƯỚC: tiếng Việt */}
        <p className="mt-3 text-xl font-medium text-slate-800">{current.vi}</p>
        <p className="mt-1 text-sm text-slate-400">
          👉 Hãy tự nói câu này bằng tiếng Anh trước khi lật thẻ.
        </p>

        {/* MẶT SAU: tiếng Anh */}
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-5 w-full rounded-xl border-2 border-dashed border-brand-300 py-4 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Lật thẻ — Hiện tiếng Anh
          </button>
        ) : (
          <div className="mt-5 animate-pop-in">
            <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <p className="text-lg font-medium text-slate-800">
                <Highlight text={current.en} highlights={current.highlights} />
              </p>
              <button
                type="button"
                onClick={() => speak(current.en)}
                title="Nghe phát âm"
                className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-brand-600"
              >
                🔊
              </button>
            </div>
            {current.note && (
              <p className="mt-2 text-sm text-slate-500">💡 {current.note}</p>
            )}

            {/* Luyện nói (nếu thiết bị hỗ trợ) — chỉ là công cụ tập, không bắt buộc */}
            {recognitionSupported() && (
              <SpeakCheck key={current.id} target={current.en} onPass={() => {}} />
            )}

            {/* Tự chấm */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => next(false)}
                className="rounded-xl bg-rose-100 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
              >
                ↻ Chưa nhớ, ôn lại
              </button>
              <button
                type="button"
                onClick={() => next(true)}
                className="rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                ✓ Bật ra được!
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-slate-400 transition hover:text-slate-600">
          Thoát phiên luyện
        </Link>
      </div>
    </div>
  );
}
