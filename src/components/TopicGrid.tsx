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
    <div className="grid gap-4 sm:grid-cols-2">
      {topics.map((topic) => {
        const total = totalFor(topic.id);
        const learned = ready ? learnedCountFor(topic.id) : 0;
        return (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${topic.accent}`}
            />
            <div className="flex items-start gap-3">
              <span className="text-3xl">{topic.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-brand-700">
                  {topic.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{topic.description}</p>
              </div>
            </div>
            <ProgressBar learned={learned} total={total} className="mt-4" />
          </Link>
        );
      })}
    </div>
  );
}
