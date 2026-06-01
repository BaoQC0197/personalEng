"use client";

// "THÓI QUEN NÓI CHUYỆN CỦA EM" — kho em tự bỏ vào cách mình nói tiếng Việt.
// 4 ô nội dung, lưu xuống file qua /api/speaking-profile.
// Khi đầy, em báo thầy "generate" -> thầy đọc file này dựng câu tiếng Anh
// đúng giọng của em (active recall sẽ bật ra tự nhiên vì là lời của chính em).

import { useEffect, useState } from "react";
import type { SpeakingProfile } from "@/lib/types";

type Field = {
  key: keyof Omit<SpeakingProfile, "updatedAt">;
  num: string;
  label: string;
  hint: string;
  placeholder: string;
};

const FIELDS: Field[] = [
  {
    key: "fillers",
    num: "①",
    label: "Từ cửa miệng / từ nối khi em nói",
    hint: "Quý nhất — đây là “chất giọng” của em. Cứ liệt kê thoải mái.",
    placeholder:
      "vd: thật ra thì..., kiểu như..., nói chung là..., ý là..., để tôi xem đã, ừm chờ chút, đại khái vậy...",
  },
  {
    key: "dailyLines",
    num: "②",
    label: "Câu em lặp đi lặp lại hằng ngày ở chỗ làm",
    hint: "Những câu em nói gần như mỗi ngày với team.",
    placeholder:
      "vd: cái này lỗi rồi, để tôi check lại, chưa xong nha, đợi tôi xíu, cái này ai làm vậy?, deadline khi nào?...",
  },
  {
    key: "personality",
    num: "③",
    label: "Tính cách & phong cách nói của em",
    hint: "Để thầy chọn giọng tiếng Anh cho khớp, không bị “Tây cứng”.",
    placeholder:
      "vd: nói thẳng, hay đùa, hay rào trước cho lịch sự, với đồng nghiệp thì thân mật, với sếp/khách thì giữ kẽ...",
  },
  {
    key: "stuckSituations",
    num: "④",
    label: "Tình huống gần đây em muốn nói bằng tiếng Anh mà bí",
    hint: "Kể nguyên văn tiếng Việt em định nói gì — thầy dịch thành câu chuẩn.",
    placeholder:
      "vd: Hôm qua họp với khách, tôi muốn nói “cái này để tôi xác nhận lại với team rồi báo anh sau” mà bí...",
  },
];

const EMPTY = {
  fillers: "",
  dailyLines: "",
  personality: "",
  stuckSituations: "",
};

type Status = "loading" | "idle" | "saving" | "saved" | "error";

export default function SpeakingHabitsForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("loading");
  const [updatedAt, setUpdatedAt] = useState("");

  // Tải hồ sơ đã lưu khi mở trang.
  useEffect(() => {
    let alive = true;
    fetch("/api/speaking-profile")
      .then((r) => r.json())
      .then((p: SpeakingProfile) => {
        if (!alive) return;
        setForm({
          fillers: p.fillers ?? "",
          dailyLines: p.dailyLines ?? "",
          personality: p.personality ?? "",
          stuckSituations: p.stuckSituations ?? "",
        });
        setUpdatedAt(p.updatedAt ?? "");
        setStatus("idle");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  function update(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (status === "saved") setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/speaking-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const saved: SpeakingProfile = await res.json();
      setUpdatedAt(saved.updatedAt);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") {
    return <p className="text-sm text-slate-400">Đang tải hồ sơ…</p>;
  }

  return (
    <div className="space-y-5">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label
            htmlFor={f.key}
            className="flex items-baseline gap-2 font-semibold text-slate-800"
          >
            <span className="text-brand-500">{f.num}</span>
            {f.label}
          </label>
          <p className="mb-2 mt-0.5 text-xs text-slate-500">{f.hint}</p>
          <textarea
            id={f.key}
            value={form[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            rows={f.key === "stuckSituations" ? 4 : 3}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
        >
          {status === "saving" ? "Đang lưu…" : "💾 Lưu lại"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-emerald-600">
            ✓ Đã lưu! Lúc nào đầy, em báo thầy “generate” nhé.
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium text-rose-600">
            ✗ Lưu lỗi — kiểm tra server (npm run dev) còn chạy không.
          </span>
        )}
        {status === "idle" && updatedAt && (
          <span className="text-sm text-slate-400">
            Cập nhật lần cuối: {new Date(updatedAt).toLocaleString("vi-VN")}
          </span>
        )}
      </div>
    </div>
  );
}
