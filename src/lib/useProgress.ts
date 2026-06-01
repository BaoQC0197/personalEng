"use client";

// Hook quản lý tiến độ học. Hai chế độ, tự chọn khi tải:
//  - Có Supabase  -> đọc/ghi qua /api/progress (đồng bộ mọi thiết bị).
//  - Chưa cấu hình -> localStorage như cũ (theo thiết bị).
// Giao diện trả về giữ nguyên để các component không phải sửa.

import { useCallback, useEffect, useState } from "react";
import type { ProgressMap } from "./types";
import {
  loadProgress,
  saveProgress,
  toggleLearned as toggleLearnedPure,
  toggleStarred as toggleStarredPure,
  getPhraseProgress,
} from "./storage";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);
  const [useDb, setUseDb] = useState(false);

  // Tải lần đầu: hỏi server xem dùng DB hay localStorage.
  useEffect(() => {
    let alive = true;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.configured) {
          setUseDb(true);
          setProgress(d.progress ?? {});
        } else {
          setUseDb(false);
          setProgress(loadProgress());
        }
        setReady(true);
      })
      .catch(() => {
        if (!alive) return;
        setUseDb(false);
        setProgress(loadProgress());
        setReady(true);
      });

    // Đồng bộ nhiều tab (chỉ có ý nghĩa ở chế độ localStorage).
    const onStorage = () => setProgress(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => {
      alive = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback(
    (phraseId: string) => {
      setProgress((prev) => {
        const next = toggleLearnedPure(prev, phraseId, new Date().toISOString());
        if (useDb) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phraseId, action: "toggleLearned" }),
          }).catch(() => {});
        } else {
          saveProgress(next);
        }
        return next;
      });
    },
    [useDb]
  );

  const toggleStar = useCallback(
    (phraseId: string) => {
      setProgress((prev) => {
        const next = toggleStarredPure(prev, phraseId, new Date().toISOString());
        if (useDb) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phraseId, action: "toggleStar" }),
          }).catch(() => {});
        } else {
          saveProgress(next);
        }
        return next;
      });
    },
    [useDb]
  );

  const isLearned = useCallback(
    (phraseId: string) =>
      getPhraseProgress(progress, phraseId).status === "learned",
    [progress]
  );

  const isStarred = useCallback(
    (phraseId: string) => getPhraseProgress(progress, phraseId).starred === true,
    [progress]
  );

  return { progress, ready, toggle, toggleStar, isLearned, isStarred };
}
