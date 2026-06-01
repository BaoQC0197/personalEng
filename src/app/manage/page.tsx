import { getAllPhrases, getTopics } from "@/lib/content";
import PhraseManager from "@/components/PhraseManager";

// ISR: dựng sẵn + làm mới mỗi 60s (xóa câu cập nhật ngay ở client, DB đã đổi).
export const revalidate = 60;

export default async function ManagePage() {
  const [phrases, topics] = await Promise.all([getAllPhrases(), getTopics()]);
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        🗂️ Quản lý từ vựng
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-500">
        Câu nào generate ra mà với em <b>không thông dụng</b> thì cứ xóa — giữ
        đúng tinh thần &quot;chỉ học câu thuộc thế giới của em&quot;. Xóa ở đây là
        xóa thật khỏi dữ liệu.
      </p>
      <PhraseManager phrases={phrases} topics={topics} />
    </div>
  );
}
