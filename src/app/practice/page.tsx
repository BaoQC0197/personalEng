import { getAllPhrases, getTopics } from "@/lib/content";
import PracticeSession from "@/components/PracticeSession";
import VoicePicker from "@/components/VoicePicker";

export const revalidate = 300;

export default async function PracticePage() {
  const [phrases, topics] = await Promise.all([getAllPhrases(), getTopics()]);
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">🎯 Luyện nhớ</h1>
      <p className="mb-6 text-sm text-slate-500">
        Việt → Anh. Luyện “bật ra” để nói được, không chỉ hiểu.
      </p>
      <div className="mb-5">
        <VoicePicker />
      </div>
      <PracticeSession phrases={phrases} topics={topics} />
    </div>
  );
}
