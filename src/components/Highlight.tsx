// Tô sáng các đoạn trọng tâm trong câu tiếng Anh để tăng cường ghi nhớ.
// Nhận chuỗi gốc + danh sách các đoạn cần highlight (khớp chuỗi con).

import { Fragment } from "react";

interface HighlightProps {
  text: string;
  highlights?: string[];
}

interface Segment {
  value: string;
  marked: boolean;
}

/** Cắt `text` thành các đoạn, đánh dấu đoạn nào thuộc `highlights`. */
function buildSegments(text: string, highlights: string[]): Segment[] {
  if (highlights.length === 0) return [{ value: text, marked: false }];

  // Sắp xếp highlight dài trước để ưu tiên khớp cụm dài.
  const sorted = [...highlights].filter(Boolean).sort((a, b) => b.length - a.length);
  if (sorted.length === 0) return [{ value: text, marked: false }];

  const segments: Segment[] = [];
  let rest = text;

  while (rest.length > 0) {
    // Tìm vị trí khớp sớm nhất trong phần còn lại.
    let bestIdx = -1;
    let bestMatch = "";
    for (const h of sorted) {
      const idx = rest.toLowerCase().indexOf(h.toLowerCase());
      if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
        bestIdx = idx;
        bestMatch = rest.slice(idx, idx + h.length);
      }
    }

    if (bestIdx === -1) {
      segments.push({ value: rest, marked: false });
      break;
    }

    if (bestIdx > 0) {
      segments.push({ value: rest.slice(0, bestIdx), marked: false });
    }
    segments.push({ value: bestMatch, marked: true });
    rest = rest.slice(bestIdx + bestMatch.length);
  }

  return segments;
}

export default function Highlight({ text, highlights = [] }: HighlightProps) {
  const segments = buildSegments(text, highlights);

  return (
    <span>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {seg.marked ? (
            <mark className="rounded-md bg-amber-200/80 px-1 py-0.5 font-semibold text-amber-900 shadow-[inset_0_-0.45em_0_rgba(251,191,36,0.35)] decoration-clone">
              {seg.value}
            </mark>
          ) : (
            seg.value
          )}
        </Fragment>
      ))}
    </span>
  );
}
