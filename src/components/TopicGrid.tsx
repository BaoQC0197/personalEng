"use client";

// Lưới các thẻ chủ đề ở trang chủ, kèm tiến độ đã thuộc của từng chủ đề.

import Link from "next/link";
import type { Phrase, Topic } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import ProgressBar from "./ProgressBar";

interface TopicGridProps {
  topics: Topic[];
  phrases: Phrase[];
}

export default function TopicGrid({ topics, phrases }: TopicGridProps) {
  const { progress, ready } = useProgress();

  const learnedCountFor = (topicId: string) => {
    const ids = phrases.filter((p) => p.topicId === topicId).map((p) => p.id);
    return ids.filter((id) => progress[id]?.status === "learned").length;
  };

  const totalFor = (topicId: string) =>
    phrases.filter((p) => p.topicId === topicId).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {topics.map((topic) => {
        const total = totalFor(topic.id);
        const learned = ready ? learnedCountFor(topic.id) : 0;
        return (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md active:scale-[0.99]"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${topic.accent}`}
            />
            <div className="flex items-center gap-3">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-2xl shadow-sm`}
              >
                {topic.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-slate-800 group-hover:text-brand-700">
                  {topic.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
                  {topic.description}
                </p>
              </div>
            </div>
            <ProgressBar learned={learned} total={total} className="mt-3" />
          </Link>
        );
      })}
    </div>
  );
}
