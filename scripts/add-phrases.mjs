// ĐẨY LÔ CÂU MỚI lên Supabase (dùng sau khi thầy generate).
// Chạy:  npm run db:add               (đọc scripts/new-phrases.json)
//        npm run db:add path/tới/file.json
//
// Đặc tính (đúng yêu cầu "nhanh & chuẩn"):
//  - Upsert theo `id`  -> chạy lại nhiều lần KHÔNG tạo bản trùng.
//  - Chỉ đụng tới các câu trong lô  -> KHÔNG làm sống lại câu em đã xóa.
//  - Tự dedup theo nội dung (en/vi) với dữ liệu ĐANG CÓ trong Supabase -> bỏ câu trùng.
//  - Tự gán sort_order nối tiếp cuối mỗi chủ đề -> rơi vào các "phần" mới.

import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, getSupabaseEnv } from "./_env.mjs";

loadEnv();
const { url, key } = getSupabaseEnv();
const sb = createClient(url, key, { auth: { persistSession: false } });

const fileArg = process.argv[2] || path.join("scripts", "new-phrases.json");
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

async function main() {
  let batch;
  try {
    batch = JSON.parse(readFileSync(path.join(process.cwd(), fileArg), "utf-8"));
  } catch {
    console.error(`❌ Không đọc được file lô: ${fileArg}`);
    process.exit(1);
  }
  if (!Array.isArray(batch) || batch.length === 0) {
    console.error("❌ File lô phải là một mảng câu, và không rỗng.");
    process.exit(1);
  }

  // Lấy dữ liệu hiện có để dedup + tính sort_order.
  const { data: existing, error } = await sb
    .from("phrases")
    .select("id, topic_id, en, vi, sort_order");
  if (error) throw error;

  const seenEn = new Set(existing.map((p) => norm(p.en)));
  const seenVi = new Set(existing.map((p) => norm(p.vi)));
  const maxOrder = {};
  for (const p of existing) {
    maxOrder[p.topic_id] = Math.max(maxOrder[p.topic_id] ?? -1, p.sort_order ?? 0);
  }

  const rows = [];
  const skipped = [];
  for (const p of batch) {
    if (!p.id || !p.topicId || !p.en || !p.vi) {
      skipped.push(`${p.id || "(thiếu id)"}: thiếu trường bắt buộc`);
      continue;
    }
    if (seenEn.has(norm(p.en)) || seenVi.has(norm(p.vi))) {
      skipped.push(`${p.id}: trùng nội dung -> bỏ`);
      continue;
    }
    const nextOrder = (maxOrder[p.topicId] ?? -1) + 1;
    maxOrder[p.topicId] = nextOrder;
    seenEn.add(norm(p.en));
    seenVi.add(norm(p.vi));
    rows.push({
      id: p.id,
      topic_id: p.topicId,
      en: p.en,
      vi: p.vi,
      ipa: p.ipa ?? null,
      highlights: p.highlights ?? [],
      note: p.note ?? null,
      example: p.example ?? null,
      tags: p.tags ?? [],
      sort_order: nextOrder,
    });
  }

  if (rows.length) {
    const res = await sb.from("phrases").upsert(rows, { onConflict: "id" });
    if (res.error) throw res.error;
  }
  console.log(`✓ Đã thêm ${rows.length} câu mới.`);
  if (skipped.length) {
    console.log(`• Bỏ qua ${skipped.length}:`);
    skipped.forEach((s) => console.log("   -", s));
  }
}

main().catch((e) => {
  console.error("❌ db:add lỗi:", e.message ?? e);
  process.exit(1);
});
