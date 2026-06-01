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
      {/* Hero gọn — ưu tiên nội dung phía dưới */}
      <section className="mb-6 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-md sm:p-7">
        <h1 className="text-xl font-extrabold leading-snug sm:text-2xl">
          Học tiếng Anh cho thế giới của bạn 🌏
        </h1>
        <p className="mt-1.5 hidden text-sm text-brand-100 sm:block">
          Chỉ học cụm từ & câu xoay quanh cuộc sống của bạn — không nhồi thứ cả
          đời không dùng.
        </p>
        <Link
          href="/practice"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-brand-700 shadow transition hover:bg-brand-50 sm:w-auto"
        >
          🎯 Luyện nhớ ngay
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
