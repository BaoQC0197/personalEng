// SEED LẦN ĐẦU: đẩy toàn bộ topics + phrases từ file JSON lên Supabase.
// Chạy: npm run db:seed
// Idempotent (upsert theo id) — chạy lại an toàn, không tạo bản trùng.
// ⚠️ Lưu ý: db:seed đẩy MỌI câu trong JSON. Nếu em đã xóa câu nào trong
// Supabase (qua /manage) mà câu đó vẫn còn trong JSON, seed sẽ thêm lại.
// → Sau khi lên prod, để THÊM câu mới hãy dùng `npm run db:add` (chỉ đẩy lô mới).

import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, getSupabaseEnv } from "./_env.mjs";

loadEnv();
const { url, key } = getSupabaseEnv();
const sb = createClient(url, key, { auth: { persistSession: false } });

const DATA = path.join(process.cwd(), "src", "data");
const PHRASE_FILES = [
  "qa-testing",
  "colleagues",
  "social",
  "email-chat",
  "connectors",
  "clarify",
];

const readJson = (p) => JSON.parse(readFileSync(p, "utf-8"));

function toPhraseRow(p, order) {
  return {
    id: p.id,
    topic_id: p.topicId,
    en: p.en,
    vi: p.vi,
    ipa: p.ipa ?? null,
    highlights: p.highlights ?? [],
    note: p.note ?? null,
    example: p.example ?? null,
    tags: p.tags ?? [],
    sort_order: order,
  };
}

async function main() {
  // 1) Topics
  const topics = readJson(path.join(DATA, "topics.json")).map((t, i) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    icon: t.icon ?? "",
    accent: t.accent ?? "",
    sort_order: i,
  }));
  let r = await sb.from("topics").upsert(topics, { onConflict: "id" });
  if (r.error) throw r.error;
  console.log(`✓ Đã đẩy ${topics.length} chủ đề.`);

  // 2) Phrases (sort_order theo thứ tự trong từng file)
  let total = 0;
  for (const f of PHRASE_FILES) {
    const list = readJson(path.join(DATA, "phrases", `${f}.json`));
    const rows = list.map((p, i) => toPhraseRow(p, i));
    const res = await sb.from("phrases").upsert(rows, { onConflict: "id" });
    if (res.error) throw res.error;
    total += rows.length;
    console.log(`  • ${f}: ${rows.length} câu`);
  }
  console.log(`✓ Đã đẩy tổng ${total} câu. Seed xong! 🎉`);
}

main().catch((e) => {
  console.error("❌ Seed lỗi:", e.message ?? e);
  process.exit(1);
});
