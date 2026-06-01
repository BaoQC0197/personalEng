// Client Supabase dùng PHÍA SERVER (API routes + server components).
// Dùng SERVICE ROLE key (bí mật, chỉ ở server) => bỏ qua RLS, toàn quyền.
// TUYỆT ĐỐI không import file này vào component "use client".
//
// Nếu CHƯA cấu hình env (chạy local chưa có Supabase) -> isSupabaseConfigured
// = false, và các lớp dữ liệu sẽ tự fallback về file JSON / localStorage.

import dns from "node:dns";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// FIX QUAN TRỌNG (production): trên Vercel, kết nối IPv6 tới Supabase hay bị
// treo ~7s rồi mới rơi về IPv4. Ép phân giải IPv4 trước để gọi DB nhanh trở lại.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  /* môi trường không hỗ trợ thì bỏ qua */
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceKey);

let client: SupabaseClient | null = null;

/** Lấy client Supabase (null nếu chưa cấu hình env). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url as string, serviceKey as string, {
      auth: { persistSession: false },
    });
  }
  return client;
}
