import VocabNotes from "@/components/VocabNotes";
import { readNotes } from "@/lib/vocabNotes";

// ISR: dựng sẵn danh sách ghi chú để hiện ngay (đồng bộ ngầm thêm sau).
export const revalidate = 30;

export default async function NotesPage() {
  const initial = await readNotes();
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        📒 Sổ tay từ vựng
      </h1>
      <p className="mb-5 max-w-2xl text-sm text-slate-500">
        Gặp từ/cụm nào thấy <b>lạ mà quan trọng</b> — kiểu &quot;sao giờ mình mới
        biết&quot; — thì ghi ngay vào đây.
      </p>
      <VocabNotes initialNotes={initial} />
    </div>
  );
}
