import Link from "next/link";
import { getTopics, getAllPhrases } from "@/lib/content";
import TopicGrid from "@/components/TopicGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topics = await getTopics();
  const phrases = await getAllPhrases();

  return (
    <div>
      {/* Hero + slogan */}
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-lg sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-200">
          Học tiếng Anh cá nhân hóa
        </p>
        <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
          “Bạn không học tiếng Anh cho cả thế giới,
          <br className="hidden sm:block" /> bạn học cho thế giới của bạn.”
        </h1>
        <p className="mt-4 max-w-2xl text-brand-100">
          Chỉ học những cụm từ và câu thật sự xuất hiện trong cuộc sống của bạn:
          công việc QA, trò chuyện với đồng nghiệp, giao tiếp xã hội. Không học
          thuộc lòng những thứ cả đời không dùng tới.
        </p>
        <Link
          href="/practice"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow transition hover:bg-brand-50"
        >
          🎯 Luyện nhớ (Việt → Anh)
        </Link>
      </section>

      {/* Lưới chủ đề */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-800">Chủ đề của bạn</h2>
        <TopicGrid topics={topics} phrases={phrases} />
      </section>
    </div>
  );
}
