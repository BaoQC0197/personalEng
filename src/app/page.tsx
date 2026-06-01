import Link from "next/link";
import { getTopics, getAllPhrases } from "@/lib/content";
import TopicGrid from "@/components/TopicGrid";

// ISR: cache HTML, tự làm mới mỗi 5 phút (nội dung ít đổi). Tiến độ học load
// riêng phía client nên vẫn luôn mới.
export const revalidate = 300;

export default async function HomePage() {
  const topics = await getTopics();
  const phrases = await getAllPhrases();

  return (
    <div>
      {/* Hero slim — gradient + CTA, chiều cao tối thiểu */}
      <section className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-3 text-white shadow-md sm:px-6 sm:py-4">
        <h1 className="text-base font-extrabold leading-tight sm:text-lg">
          Học tiếng Anh cho<br className="sm:hidden" /> thế giới của bạn 🌏
        </h1>
        <Link
          href="/practice"
          className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow transition hover:bg-brand-50"
        >
          🎯 Luyện nhớ
        </Link>
      </section>

      {/* Lưới chủ đề */}
      <section>
        <h2 className="mb-3 px-1 text-base font-bold text-slate-800">
          Chủ đề của bạn
        </h2>
        <TopicGrid topics={topics} phrases={phrases} />
      </section>
    </div>
  );
}
