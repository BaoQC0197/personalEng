"use client";

// Thẻ hiển thị 1 cụm từ / câu: tiếng Anh (có highlight), nghĩa, ghi chú,
// nút phát âm, và nút chuyển trạng thái "đã thuộc".

import { useState } from "react";
import type { Phrase } from "@/lib/types";
import Highlight from "./Highlight";

interface PhraseCardProps {
  phrase: Phrase;
  learned: boolean;
  onToggle: (id: string) => void;
  /** Có đang được đánh dấu quan trọng (sao vàng) không. */
  starred?: boolean;
  /** Đảo dấu sao quan trọng. Nếu không truyền thì ẩn nút sao. */
  onToggleStar?: (id: string) => void;
}

/** Đọc to câu tiếng Anh bằng Web Speech API (nếu trình duyệt hỗ trợ). */
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

export default function PhraseCard({
  phrase,
  learned,
  onToggle,
  starred,
  onToggleStar,
}: PhraseCardProps) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
        learned
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50"
      }`}
    >
      {/* Dải trạng thái đã thuộc */}
      {learned && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
          ✓ Đã thuộc
        </span>
      )}

      {/* Câu tiếng Anh */}
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-lg font-medium leading-relaxed ${
            learned ? "text-slate-500" : "text-slate-800"
          }`}
        >
          <Highlight text={phrase.en} highlights={learned ? [] : phrase.highlights} />
        </p>
        <div className="flex shrink-0 items-center">
          {onToggleStar && (
            <button
              type="button"
              onClick={() => onToggleStar(phrase.id)}
              title={starred ? "Bỏ đánh dấu quan trọng" : "Đánh dấu câu quan trọng"}
              aria-label="Đánh dấu câu quan trọng"
              className="rounded-full p-2 text-xl leading-none transition hover:scale-110"
            >
              <span className={starred ? "text-amber-400" : "text-slate-300"}>
                {starred ? "★" : "☆"}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => speak(phrase.en)}
            title="Nghe phát âm"
            aria-label="Nghe phát âm"
            className="rounded-full p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
          >
            🔊
          </button>
        </div>
      </div>

      {/* IPA */}
      {phrase.ipa && (
        <p className="mt-1 text-sm text-slate-400">{phrase.ipa}</p>
      )}

      {/* Nghĩa tiếng Việt */}
      <p className="mt-2 text-slate-600">{phrase.vi}</p>

      {/* Tags */}
      {phrase.tags && phrase.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {phrase.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Ghi chú / ví dụ */}
      {(phrase.note || phrase.example) && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowNote((v) => !v)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            {showNote ? "Ẩn ghi chú" : "Xem ghi chú"}
          </button>
          {showNote && (
            <div className="mt-2 animate-pop-in space-y-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              {phrase.note && <p>💡 {phrase.note}</p>}
              {phrase.example && <p className="italic">“{phrase.example}”</p>}
            </div>
          )}
        </div>
      )}

      {/* Nút chuyển trạng thái */}
      <button
        type="button"
        onClick={() => onToggle(phrase.id)}
        className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition ${
          learned
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-brand-600 text-white hover:bg-brand-700"
        }`}
      >
        {learned ? "↩︎ Trả về chưa thuộc (học lại)" : "✓ Đánh dấu đã thuộc"}
      </button>
    </div>
  );
}
