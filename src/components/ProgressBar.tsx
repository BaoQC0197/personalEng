// Thanh tiến độ đơn giản: số đã thuộc / tổng số.

interface ProgressBarProps {
  learned: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ learned, total, className = "" }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {learned}/{total} đã thuộc
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
