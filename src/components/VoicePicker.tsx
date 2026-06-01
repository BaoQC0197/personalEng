"use client";

// Chọn & ghim giọng đọc tiếng Anh (Nam/Nữ). Thu gọn để đỡ chiếm chỗ trên mobile.
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
  const [open, setOpen] = useState(false);

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
      else if (list.length && !pref)
        setSelected((list.find((v) => v.lang === "en-US") ?? list[0]).name);
      else if (pref) setSelected(pref);
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
        `Thiết bị này không có giọng ${g === "male" ? "nam" : "nữ"} tiếng Anh rõ ràng. Mở rộng và chọn thủ công nhé.`
      );
  }

  if (!supported) return null;

  const current = voices.find((v) => v.name === selected);
  const label = current
    ? `${genderIcon(guessGender(current.name))} ${current.name}`
    : "mặc định";

  return (
    <div className="rounded-xl border border-slate-200 bg-white text-sm">
      {/* Thanh gọn: bấm để mở/đóng */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="min-w-0 truncate text-slate-600">
          🔊 Giọng đọc: <span className="text-slate-400">{label}</span>
        </span>
        <span className="shrink-0 text-slate-400">{open ? "▲" : "▾"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 p-3">
          <div className="flex flex-wrap items-center gap-2">
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
            <select
              value={selected}
              onChange={(e) => choose(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {genderIcon(guessGender(v.name))} {v.name}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1.5 text-xs text-slate-400">
            Giọng ghim theo thiết bị này (mỗi máy có bộ giọng khác nhau).
          </p>
        </div>
      )}
    </div>
  );
}
