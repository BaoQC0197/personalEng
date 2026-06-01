"use client";

// HỌC THEO THẺ TRẮC NGHIỆM cho 1 chủ đề.
// - Mỗi session CHỈ chạy những câu CHƯA thuộc (random thứ tự).
// - Mặt thẻ hiện TIẾNG VIỆT, chọn câu TIẾNG ANH đúng trong 4 đáp án (Việt→Anh).
// - Chọn đúng KHÔNG tự đánh dấu đã thuộc — em phải tự bấm "Đã thuộc".
// - Sai → hiện đáp án đúng + ghi chú, thẻ quay lại cuối hàng để ôn.
// - Mỗi thẻ có nút sao vàng ⭐ để đánh dấu "câu quan trọng".
// - Hết hàng → màn hoàn thành.

import { useEffect, useMemo, useState } from "react";
import type { Phrase } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import { speak } from "@/lib/speech";
import { recognitionSupported } from "@/lib/speechRecognition";
import SpeakCheck from "./SpeakCheck";

interface TopicQuizProps {
  phrases: Phrase[];
}

/** Trộn ngẫu nhiên (Fisher–Yates), không đổi mảng gốc. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Choice {
  en: string;
  correct: boolean;
}
function buildOptions(target: Phrase, pool: Phrase[]): Choice[] {
  const distractors = shuffle(pool.filter((p) => p.id !== target.id))
    .slice(0, 3)
    .map((p) => ({ en: p.en, correct: false }));
  return shuffle([{ en: target.en, correct: true }, ...distractors]);
}

export default function TopicQuiz({ phrases }: TopicQuizProps) {
  const { progress, ready, toggle, toggleStar, isLearned, isStarred } =
    useProgress();

  const [round, setRound] = useState(0);
  const [queue, setQueue] = useState<Phrase[] | null>(null);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [cleared, setCleared] = useState<Set<string>>(new Set());
  const [wrongOnce, setWrongOnce] = useState<Set<string>>(new Set());
  const [picked, setPicked] = useState<string | null>(null);

  // Chế độ bắt buộc luyện nói (ghim theo thiết bị). spoken = đã đạt/skip thẻ này.
  const [speakMode, setSpeakMode] = useState(false);
  const [spoken, setSpoken] = useState(false);
  useEffect(() => {
    try {
      setSpeakMode(localStorage.getItem("pe:speakmode") === "1");
    } catch {
      /* bỏ qua */
    }
  }, []);
  const recoSupported = recognitionSupported();
  function toggleSpeakMode() {
    setSpeakMode((v) => {
      const nv = !v;
      try {
        localStorage.setItem("pe:speakmode", nv ? "1" : "0");
      } catch {
        /* bỏ qua */
      }
      return nv;
    });
  }

  // Dựng session khi tiến độ đã nạp xong / khi bấm "Học lại".
  // Chỉ lấy những câu CHƯA thuộc, random thứ tự.
  useEffect(() => {
    if (!ready) return;
    const notLearned = phrases.filter(
      (p) => (progress[p.id]?.status ?? "learning") !== "learned"
    );
    const q = shuffle(notLearned);
    setQueue(q);
    setSessionTotal(q.length);
    setCleared(new Set());
    setWrongOnce(new Set());
    setPicked(null);
    // Cố ý KHÔNG phụ thuộc `progress`: chỉ dựng lại session khi ready/round đổi,
    // không dựng lại mỗi lần em bấm "đã thuộc" giữa chừng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, round]);

  const current = queue?.[0];

  const options = useMemo(
    () => (current ? buildOptions(current, phrases) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id, round]
  );

  if (!ready || queue === null) {
    return <p className="py-10 text-center text-slate-400">Đang tải…</p>;
  }

  if (phrases.length === 0) {
    return (
      <p className="py-10 text-center text-slate-400">
        Chủ đề này chưa có câu nào.
      </p>
    );
  }

  // ===== Đã thuộc hết: session rỗng ngay từ đầu =====
  if (sessionTotal === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mb-2 text-4xl">🌟</div>
        <h2 className="text-xl font-bold text-emerald-800">
          Em đã thuộc hết chủ đề này!
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          Muốn ôn lại? Vào tab <b>Đã thuộc</b> và trả vài câu về &quot;chưa
          thuộc&quot;, rồi quay lại đây.
        </p>
      </div>
    );
  }

  const doneCount = cleared.size;

  // ===== Màn hoàn thành =====
  if (!current) {
    const firstTry = sessionTotal - wrongOnce.size;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mb-2 text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-emerald-800">Xong hàng rồi!</h2>
        <p className="mt-2 text-sm text-emerald-700">
          Em đã qua hết <b>{sessionTotal}</b> thẻ chưa thuộc. Đúng ngay lần đầu:{" "}
          <b>
            {firstTry}/{sessionTotal}
          </b>
          .
        </p>
        <p className="mt-1 text-xs text-emerald-600">
          Nhớ bấm ⭐ cho câu quan trọng và ✓ cho câu đã thật sự thuộc nhé.
        </p>
        <button
          onClick={() => setRound((r) => r + 1)}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          🔁 Học lại (chỉ câu chưa thuộc)
        </button>
      </div>
    );
  }

  const answered = picked !== null;
  const pickedCorrect =
    answered && options.find((o) => o.en === picked)?.correct === true;
  const learnedNow = isLearned(current.id);
  const starredNow = isStarred(current.id);

  function choose(en: string) {
    if (picked !== null) return;
    setPicked(en);
    const isCorrect = options.find((o) => o.en === en)?.correct ?? false;
    // Luôn đọc to câu đúng (dù chọn đúng hay sai) để luyện nghe mỗi thẻ.
    speak(current!.en);
    if (!isCorrect) {
      setWrongOnce((w) => new Set(w).add(current!.id));
    }
  }

  // Sang thẻ tiếp: nếu đúng HOẶC em đã tự đánh dấu thuộc → rời hàng;
  // nếu sai và chưa đánh dấu thuộc → đẩy xuống cuối hàng để ôn lại.
  function goNext() {
    const id = current!.id;
    const leaveQueue = pickedCorrect || isLearned(id);
    if (leaveQueue) {
      setCleared((c) => new Set(c).add(id));
      setQueue((q) => (q ? q.slice(1) : q));
    } else {
      setQueue((q) => (q ? [...q.slice(1), q[0]] : q));
    }
    setPicked(null);
    setSpoken(false);
  }

  const mustSpeak = answered && speakMode && recoSupported && !spoken;

  return (
    <div>
      {/* Tiến độ session */}
      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
        <span>
          Đã xong <b className="text-slate-700">{doneCount}</b>/{sessionTotal}{" "}
          (câu chưa thuộc)
        </span>
        <span>Còn trong hàng: {queue.length}</span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${(doneCount / sessionTotal) * 100}%` }}
        />
      </div>

      {/* Bật/tắt bắt buộc luyện nói */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <button
          onClick={toggleSpeakMode}
          className={`rounded-lg border px-3 py-1.5 font-medium transition ${
            speakMode
              ? "border-violet-300 bg-violet-50 text-violet-700"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          🎤 Bắt buộc luyện nói: {speakMode ? "BẬT" : "TẮT"}
        </button>
        {speakMode && !recoSupported && (
          <span className="text-xs text-amber-600">
            Thiết bị/trình duyệt này chưa hỗ trợ nhận diện giọng — bước nói sẽ bỏ qua.
          </span>
        )}
      </div>

      {/* Mặt thẻ: tiếng Việt + sao quan trọng */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => toggleStar(current.id)}
          title={starredNow ? "Bỏ đánh dấu quan trọng" : "Đánh dấu câu quan trọng"}
          aria-label="Đánh dấu câu quan trọng"
          className="absolute right-4 top-4 text-2xl leading-none transition hover:scale-110"
        >
          <span className={starredNow ? "text-amber-400" : "text-slate-300"}>
            {starredNow ? "★" : "☆"}
          </span>
        </button>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          Chọn câu tiếng Anh đúng
        </p>
        <p className="pr-8 text-xl font-semibold text-slate-800">{current.vi}</p>
      </div>

      {/* 4 đáp án */}
      <div className="mt-4 grid gap-3">
        {options.map((o) => {
          let style =
            "border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50";
          if (answered) {
            if (o.correct) {
              style = "border-emerald-400 bg-emerald-50 text-emerald-800";
            } else if (o.en === picked) {
              style = "border-rose-400 bg-rose-50 text-rose-700";
            } else {
              style = "border-slate-200 bg-white text-slate-400";
            }
          }
          return (
            <button
              key={o.en}
              type="button"
              disabled={answered}
              onClick={() => choose(o.en)}
              className={`rounded-xl border px-4 py-3 text-left text-[15px] font-medium transition ${style}`}
            >
              {o.en}
              {answered && o.correct && <span className="ml-2">✓</span>}
              {answered && !o.correct && o.en === picked && (
                <span className="ml-2">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sau khi trả lời: phản hồi + đánh dấu thuộc + tiếp tục */}
      {answered && (
        <div
          className={`mt-4 rounded-xl border p-4 text-sm ${
            pickedCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {pickedCorrect ? (
                <p className="font-semibold">✓ Chính xác!</p>
              ) : (
                <p>
                  Chưa đúng. Đáp án đúng:{" "}
                  <b className="text-emerald-700">{current.en}</b>
                </p>
              )}
              {pickedCorrect && (
                <p className="text-emerald-800">{current.en}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => speak(current.en)}
              title="Nghe lại"
              aria-label="Nghe lại câu tiếng Anh"
              className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-white/60 hover:text-brand-600"
            >
              🔊
            </button>
          </div>
          {current.note && <p className="mt-1">💡 {current.note}</p>}
          {!pickedCorrect && !learnedNow && (
            <p className="mt-1 text-xs opacity-80">
              Thẻ này sẽ quay lại cuối hàng để em ôn thêm.
            </p>
          )}

          {/* Bước luyện nói (nếu bật & thiết bị hỗ trợ) */}
          {speakMode && recoSupported && (
            <SpeakCheck
              key={current.id}
              target={current.en}
              onPass={() => setSpoken(true)}
            />
          )}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggle(current.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  learnedNow
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {learnedNow ? "✓ Đã thuộc (bấm để bỏ)" : "Đánh dấu đã thuộc"}
              </button>
              <button
                onClick={() => toggleStar(current.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  starredNow
                    ? "bg-amber-100 text-amber-700"
                    : "border border-amber-300 bg-white text-amber-600 hover:bg-amber-50"
                }`}
              >
                {starredNow ? "★ Quan trọng" : "☆ Quan trọng"}
              </button>
            </div>
            <div className="sm:ml-auto sm:flex sm:items-center sm:gap-3">
              {mustSpeak && (
                <button
                  onClick={goNext}
                  className="text-xs text-slate-400 underline hover:text-slate-600"
                >
                  Bỏ qua
                </button>
              )}
              <button
                onClick={goNext}
                disabled={mustSpeak}
                title={mustSpeak ? "Đọc đạt ≥70% để qua câu tiếp" : undefined}
                className="w-full rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
