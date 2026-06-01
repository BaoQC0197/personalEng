"use client";

// Bước LUYỆN NÓI: em nói câu tiếng Anh, máy chấm % từ nói trúng.
// Đạt ngưỡng -> gọi onPass() để mở khoá nút Tiếp tục.

import { useState } from "react";
import { recognizeOnce, scoreMatch } from "@/lib/speechRecognition";

const PASS = 70;

export default function SpeakCheck({
  target,
  onPass,
}: {
  target: string;
  onPass: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "listening" | "done" | "error">(
    "idle"
  );
  const [said, setSaid] = useState("");
  const [score, setScore] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  async function listen() {
    setStatus("listening");
    setSaid("");
    try {
      const text = await recognizeOnce("en-US");
      const sc = scoreMatch(target, text);
      setSaid(text);
      setScore(sc);
      setStatus("done");
      if (sc >= PASS) onPass();
    } catch (e) {
      const code = e instanceof Error ? e.message : "error";
      const msg =
        code === "not-allowed" || code === "service-not-allowed"
          ? "Chưa cấp quyền micro. Hãy cho phép dùng micro rồi thử lại."
          : code === "no-speech"
          ? "Không nghe thấy gì. Bấm lại rồi nói to & rõ hơn nhé."
          : code === "network"
          ? "Cần kết nối mạng để nhận diện giọng. Kiểm tra mạng rồi thử lại."
          : code === "aborted"
          ? "Bị gián đoạn. Bấm lại để nói tiếp nhé."
          : "Chưa nhận được. Bấm lại để thử, hoặc bấm Bỏ qua.";
      setErrMsg(msg);
      setStatus("error");
    }
  }

  const passed = status === "done" && score >= PASS;

  return (
    <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-3">
      <p className="text-sm font-medium text-violet-900">
        🎤 Luyện nói: bấm mic rồi đọc to câu trên
      </p>

      <button
        onClick={listen}
        disabled={status === "listening"}
        className={`mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
          status === "listening"
            ? "bg-rose-500"
            : "bg-violet-600 hover:bg-violet-700"
        }`}
      >
        {status === "listening" ? "🔴 Đang nghe… (nói đi!)" : "🎤 Nhấn để nói"}
      </button>

      {status === "done" && (
        <div className="mt-2 text-sm">
          <p className="text-slate-600">
            Máy nghe được: <i>“{said || "(trống)"}”</i>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${passed ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-semibold text-slate-700">{score}%</span>
          </div>
          <p className={`mt-1 font-medium ${passed ? "text-emerald-700" : "text-amber-700"}`}>
            {passed ? "✓ Đạt! Qua câu tiếp được rồi." : `Chưa đạt (cần ≥ ${PASS}%). Thử lại nhé.`}
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-rose-600">{errMsg}</p>
      )}
    </div>
  );
}
