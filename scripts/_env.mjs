// Nạp biến môi trường từ .env.local (đơn giản, không cần thư viện ngoài).
// Dùng cho các script seed chạy bằng `node`.
import { readFileSync } from "fs";
import path from "path";

export function loadEnv() {
  try {
    const file = path.join(process.cwd(), ".env.local");
    const raw = readFileSync(file, "utf-8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // Không có .env.local cũng không sao nếu env đã set sẵn ngoài shell.
  }
}

export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "❌ Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local"
    );
    process.exit(1);
  }
  return { url, key };
}
