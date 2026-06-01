import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, getTopics, getPhrasesByTopic } from "@/lib/content";
import TopicLearn from "@/components/TopicLearn";
import VoicePicker from "@/components/VoicePicker";

export const revalidate = 300;

// Tạo sẵn route cho từng chủ đề (đọc danh sách chủ đề từ nguồn dữ liệu).
export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((t) => ({ topic: t.id }));
}

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const topic = await getTopic(params.topic);
  if (!topic) notFound();

  const phrases = await getPhrasesByTopic(topic.id);

  return (
    <div>
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        ← Tất cả chủ đề
      </Link>

      <div className="mb-3 mt-2 flex items-center gap-3">
        <span className="text-3xl sm:text-4xl">{topic.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            {topic.title}
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            {topic.description}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <VoicePicker />
      </div>

      <TopicLearn phrases={phrases} />
    </div>
  );
}
