# 🚀 Hướng dẫn lên production (Supabase + Vercel)

> Chia 3 giai đoạn. **Giai đoạn 1** (dưới đây) em làm được ngay bây giờ.
> Giai đoạn 2 (nối app vào Supabase) thầy đang code. Giai đoạn 3 (Vercel) làm sau.

---

## Giai đoạn 1 — Dựng Supabase & nạp dữ liệu

### B1. Tạo project Supabase
1. Vào https://supabase.com → đăng nhập (GitHub/Google) → **New project**.
2. Đặt tên (vd `my-english`), chọn **region** gần VN (Singapore), đặt **Database Password** (lưu lại).
3. Đợi ~1–2 phút cho project khởi tạo xong.

### B2. Tạo bảng (chạy schema)
1. Trong project → menu trái **SQL Editor** → **New query**.
2. Mở file [supabase/schema.sql](supabase/schema.sql) trong dự án, **copy toàn bộ**, dán vào, bấm **Run**.
3. Thấy "Success" là xong. Qua tab **Table Editor** sẽ thấy 5 bảng: `topics`, `phrases`, `user_progress`, `speaking_profile`, `vocab_notes`.

### B3. Lấy API keys
1. Menu trái **Project Settings** (bánh răng) → **API**.
2. Copy 2 giá trị:
   - **Project URL** → biến `SUPABASE_URL`
   - **service_role** (mục Project API keys, bấm *reveal*) → biến `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ `service_role` là key **bí mật/toàn quyền** — KHÔNG chia sẻ, KHÔNG đặt tiền tố `NEXT_PUBLIC_`.

### B4. Cấu hình local
1. Trong thư mục dự án, tạo file `.env.local` (copy từ `.env.local.example`).
2. Điền 2 giá trị vừa lấy.
3. Cài thư viện + nạp dữ liệu:
   ```powershell
   npm install
   npm run db:seed
   ```
4. Thấy `Seed xong! 🎉`. Vào **Table Editor → phrases** trên Supabase sẽ thấy **300 câu**.

✅ Xong giai đoạn 1: dữ liệu đã nằm trên Supabase.

---

## Giai đoạn 2 — Nối app vào Supabase  *(thầy đang code)*
App sẽ đọc nội dung và ghi tiến độ / sổ tay / thói quen qua Supabase. Có fallback
về file/localStorage khi chưa cấu hình env, nên local không bao giờ vỡ.

## Giai đoạn 3 — Deploy Vercel  *(làm sau cùng)*
1. Đưa code lên GitHub (thầy sẽ hướng dẫn `git init` → push).
2. https://vercel.com → **Add New Project** → import repo từ GitHub.
3. Mục **Environment Variables**, thêm `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`
   (đúng giá trị như `.env.local`).
4. **Deploy** → nhận link `*.vercel.app`. Mở trên điện thoại là học được mọi nơi.

---

## 🔄 Sau khi lên prod: thêm câu mới do thầy generate
Quy trình generate của thầy gần như giữ nguyên, chỉ thêm 1 bước đẩy lên:
```powershell
npm run db:add scripts/new-phrases.json
```
- Upsert theo `id` → chạy lại không trùng.
- Tự bỏ câu trùng nội dung với dữ liệu đang có.
- KHÔNG làm sống lại câu em đã xóa ở /manage.
- Tự xếp vào cuối chủ đề (rơi vào các "phần" mới).
