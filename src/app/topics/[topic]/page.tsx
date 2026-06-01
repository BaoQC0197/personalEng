import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, getTopics, getPhrasesByTopic } from "@/lib/content";
import TopicLearn from "@/components/TopicLearn";

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

      <div className="mb-6 mt-3 flex items-center gap-3">
        <span className="text-4xl">{topic.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{topic.title}</h1>
          <p className="text-sm text-slate-500">{topic.description}</p>
        </div>
      </div>

      <TopicLearn phrases={phrases} />
    </div>
  );
}
