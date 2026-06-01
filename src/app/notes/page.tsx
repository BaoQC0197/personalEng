import VocabNotes from "@/components/VocabNotes";

export default function NotesPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        📒 Sổ tay từ vựng
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-500">
        Gặp từ/cụm nào thấy <b>lạ mà quan trọng</b> — kiểu &quot;sao giờ mình mới
        biết&quot; — thì ghi ngay vào đây. Sau này em có thể bảo thầy biến những
        ghi chú hay thành câu học chính thức.
      </p>
      <VocabNotes />
    </div>
  );
}
