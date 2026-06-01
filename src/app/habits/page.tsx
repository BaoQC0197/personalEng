import SpeakingHabitsForm from "@/components/SpeakingHabitsForm";

export default function HabitsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        🗣️ Thói quen nói chuyện của em
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-500">
        Đây là kho riêng của em. Nhớ ra câu/từ nào em hay nói bằng tiếng Việt thì
        bỏ vào đây, lưu lại. Lúc nào đầy, em báo thầy{" "}
        <span className="font-medium text-slate-700">“generate”</span> — thầy đọc
        kho này rồi dựng bộ tiếng Anh đúng giọng của em để học.
      </p>
      <SpeakingHabitsForm />
    </div>
  );
}
