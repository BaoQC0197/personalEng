"use client";

// Chọn & ghim giọng đọc tiếng Anh (Nam/Nữ). Lưu theo thiết bị (localStorage).
// Web Speech API chạy offline trên máy -> không gây lag.

import { useEffect, useState } from "react";
import {
  getEnglishVoices,
  guessGender,
  loadVoicePref,
  saveVoicePref,
  pickVoiceByGender,
  speak,
  type Gender,
} from "@/lib/speech";

const SAMPLE = "Let me check and get back to you.";
const genderIcon = (g: Gender) => (g === "female" ? "👩" : g === "male" ? "👨" : "🗣️");

export default function VoicePicker() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [supported, setSupported] = useState(true);

  // Nạp danh sách giọng (có thể chưa sẵn ngay -> nghe sự kiện voiceschanged).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const refresh = () => {
      const list = getEnglishVoices();
      setVoices(list);
      const pref = loadVoicePref();
      if (pref && list.some((v) => v.name === pref)) setSelected(pref);
      else if (list.length && !pref) {
        const def =
          list.find((v) => v.lang === "en-US") ?? list[0];
        setSelected(def.name);
      } else if (pref) setSelected(pref);
    };
    refresh();
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", refresh);
  }, []);

  function choose(name: string) {
    setSelected(name);
    saveVoicePref(name);
    speak(SAMPLE);
  }

  function chooseGender(g: Gender) {
    const v = pickVoiceByGender(g);
    if (v) choose(v.name);
    else
      window.alert(
        `Thiết bị này không có giọng ${g === "male" ? "nam" : "nữ"} tiếng Anh rõ ràng. Em chọn thủ công trong danh sách bên dưới nhé.`
      );
  }

  if (!supported) {
    return (
      <p className="text-xs text-slate-400">
        Trình duyệt này không hỗ trợ giọng đọc.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-slate-600">🔊 Giọng đọc:</span>
        <button
          onClick={() => chooseGender("female")}
          className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-brand-400 hover:bg-brand-50"
        >
          👩 Nữ
        </button>
        <button
          onClick={() => chooseGender("male")}
          className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-brand-400 hover:bg-brand-50"
        >
          👨 Nam
        </button>
        <button
          onClick={() => speak(SAMPLE)}
          className="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white transition hover:bg-brand-700"
        >
          Nghe thử
        </button>
      </div>

      {voices.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 text-xs text-slate-400">Chọn cụ thể:</span>
          <select
            value={selected}
            onChange={(e) => choose(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {genderIcon(guessGender(v.name))} {v.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <p className="mt-1.5 text-xs text-slate-400">
        Giọng được ghim theo thiết bị này. Mỗi máy có bộ giọng khác nhau.
      </p>
    </div>
  );
}
