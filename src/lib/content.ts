// ===== Lớp truy cập NỘI DUNG (chủ đề + cụm từ) =====
// Đọc từ Supabase nếu đã cấu hình env; nếu chưa thì FALLBACK về file JSON tĩnh
// (để chạy local trước khi có Supabase vẫn được). Các hàm là async.

import type { Phrase, Topic } from "./types";
import topicsData from "@/data/topics.json";
import qaTesting from "@/data/phrases/qa-testing.json";
import colleagues from "@/data/phrases/colleagues.json";
import social from "@/data/phrases/social.json";
import emailChat from "@/data/phrases/email-chat.json";
import connectors from "@/data/phrases/connectors.json";
import clarify from "@/data/phrases/clarify.json";
import { getSupabase } from "./supabase";

// ----- Dữ liệu JSON dùng cho fallback -----
const jsonTopics = topicsData as Topic[];
const jsonPhrases: Phrase[] = [
  ...(qaTesting as Phrase[]),
  ...(colleagues as Phrase[]),
  ...(social as Phrase[]),
  ...(emailChat as Phrase[]),
  ...(connectors as Phrase[]),
  ...(clarify as Phrase[]),
];

// ----- Map dòng DB -> kiểu trong app -----
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToTopic(r: any): Topic {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    icon: r.icon ?? "",
    accent: r.accent ?? "",
  };
}
function rowToPhrase(r: any): Phrase {
  return {
    id: r.id,
    topicId: r.topic_id,
    en: r.en,
    vi: r.vi,
    ipa: r.ipa ?? undefined,
    highlights: r.highlights ?? [],
    note: r.note ?? undefined,
    example: r.example ?? undefined,
    tags: r.tags ?? [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Lấy tất cả chủ đề (theo thứ tự sort_order). */
export async function getTopics(): Promise<Topic[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("topics")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) return data.map(rowToTopic);
  }
  return jsonTopics;
}

/** Lấy 1 chủ đề theo id. */
export async function getTopic(topicId: string): Promise<Topic | undefined> {
  const topics = await getTopics();
  return topics.find((t) => t.id === topicId);
}

/** Lấy tất cả cụm từ (sắp theo chủ đề rồi sort_order trong chủ đề). */
export async function getAllPhrases(): Promise<Phrase[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("phrases")
      .select("*")
      .order("topic_id", { ascending: true })
      .order("sort_order", { ascending: true });
    if (!error && data) return data.map(rowToPhrase);
  }
  return jsonPhrases;
}

/** Lấy cụm từ thuộc 1 chủ đề (giữ thứ tự sort_order để chia phần đúng). */
export async function getPhrasesByTopic(topicId: string): Promise<Phrase[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("phrases")
      .select("*")
      .eq("topic_id", topicId)
      .order("sort_order", { ascending: true });
    if (!error && data) return data.map(rowToPhrase);
  }
  return jsonPhrases.filter((p) => p.topicId === topicId);
}
