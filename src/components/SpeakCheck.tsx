"use client";

// Bước LUYỆN NÓI: bấm để nói → đọc CẢ CÂU → bấm dừng & chấm.
// Hiện chữ trực tiếp lúc nói; xét nhiều phương án nhận diện cho công bằng với
// giọng có âm sắc, nhưng vẫn cần nói trúng ≥ ngưỡng mới đạt.

import { useEffect, useRef, useState } from "react";
import {
  startRecognition,
  scoreMatch,
  type RecoController,
} from "@/lib/speechRecognition";

const PASS = 70;
const MAX_MS = 10000; // tự dừng sau 10s phòng quên bấm dừng

type Status = "idle" | "listening" | "done" | "error";

export default function SpeakCheck({
  target,
  onPass,
}: {
  target: string;
  onPass: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [interim, setInterim] = useState("");
  const [said, setSaid] = useState("");
  const [score, setScore] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const ctrlRef = useRef<RecoController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dọn dẹp khi đổi thẻ / rời màn.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ctrlRef.current?.abort();
    };
  }, []);

  function start() {
    setStatus("listening");
    setInterim("");
    setSaid("");
    setScore(0);
    setErrMsg("");
    ctrlRef.current = startRecognition({
      lang: "en-US",
      onInterim: (t) => setInterim(t),
      onDone: (text) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const sc = scoreMatch(target, text);
        setSaid(text);
        setScore(sc);
        setStatus("done");
        if (sc >= PASS) onPass();
      },
      onError: (code) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setErrMsg(
          code === "not-allowed" || code === "service-not-allowed"
            ? "Chưa cấp quyền micro. Cho phép dùng micro rồi thử lại nhé."
            : code === "network"
            ? "Cần kết nối mạng để nhận diện. Kiểm tra mạng rồi thử lại."
            : code === "no-speech"
            ? "Chưa nghe rõ. Bấm nói rồi đọc to & rõ hơn nhé."
            : "Chưa nhận được. Bấm để nói lại, hoặc bấm Bỏ qua."
        );
        setStatus("error");
      },
    });
    if (ctrlRef.current) {
      timerRef.current = setTimeout(() => ctrlRef.current?.stop(), MAX_MS);
    }
  }

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current);
    ctrlRef.current?.stop();
  }

  const passed = status === "done" && score >= PASS;

  return (
    <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-3">
      <p className="text-sm font-medium text-violet-900">
        🎤 Luyện nói: bấm rồi đọc to câu trên, xong bấm “Dừng &amp; chấm”
      </p>

      {status === "listening" ? (
        <button
          onClick={stop}
          className="mt-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          ⏹ Dừng &amp; chấm
        </button>
      ) : (
        <button
          onClick={start}
          className="mt-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          🎤 {status === "idle" ? "Nhấn để nói" : "Nói lại"}
        </button>
      )}

      {status === "listening" && (
        <p className="mt-2 text-sm text-violet-700">
          🔴 Đang nghe… <i>{interim || "(nói đi!)"}</i>
        </p>
      )}

      {status === "done" && (
        <div className="mt-2 text-sm">
          <p className="text-slate-600">
            Máy nghe được: <i>“{said || "(trống)"}”</i>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  passed ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-semibold text-slate-700">{score}%</span>
          </div>
          <p
            className={`mt-1 font-medium ${
              passed ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {passed
              ? "✓ Đạt! Qua câu tiếp được rồi."
              : `Chưa đạt (cần ≥ ${PASS}%). Bấm “Nói lại” thử nhé.`}
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-rose-600">{errMsg}</p>
      )}
    </div>
  );
}
