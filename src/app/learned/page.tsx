import { getAllPhrases, getTopics } from "@/lib/content";
import LearnedList from "@/components/LearnedList";

export const revalidate = 300;

export default async function LearnedPage() {
  const [phrases, topics] = await Promise.all([getAllPhrases(), getTopics()]);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        🏆 Cụm từ đã thuộc
      </h1>
      <LearnedList phrases={phrases} topics={topics} />
    </div>
  );
}
