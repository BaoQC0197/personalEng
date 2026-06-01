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

## Giai đoạn 2 — Nối app vào Supabase  ✅ XONG
App đọc nội dung + ghi tiến độ / sổ tay / thói quen / xóa câu qua Supabase. Có
fallback về file/localStorage khi chưa cấu hình env, nên local không bao giờ vỡ.

## Giai đoạn 3 — Deploy Vercel

### B1. Tạo repo GitHub (trống)
1. Vào https://github.com/new
2. Repository name: vd `my-english`. Để **Private** (riêng tư) cũng được.
3. ⚠️ KHÔNG tích "Add a README / .gitignore / license" (để repo trống, tránh đụng).
4. **Create repository** → copy URL dạng `https://github.com/<user>/my-english.git`.

### B2. Đẩy code lên (chạy trong terminal dự án)
```powershell
git remote add origin https://github.com/<user>/my-english.git
git push -u origin main
```
Lần đầu push, một cửa sổ đăng nhập GitHub sẽ hiện ra — đăng nhập là xong.

### B3. Import vào Vercel
1. https://vercel.com → đăng nhập bằng GitHub → **Add New… → Project**.
2. Chọn repo `my-english` → **Import**.
3. Framework tự nhận **Next.js**, để mặc định.

### B4. Thêm Environment Variables (QUAN TRỌNG)
Trong màn hình import, mở **Environment Variables**, thêm 2 biến (y hệt `.env.local`):
| Name | Value |
|---|---|
| `SUPABASE_URL` | https://erfqhktufwgsjchhfvtz.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | (secret key `sb_secret_...`) |

### B5. Deploy
Bấm **Deploy** → đợi ~1–2 phút → nhận link `*.vercel.app`. Mở trên điện thoại,
đăng nhập không cần, học mọi lúc — tiến độ đồng bộ chung với máy tính (cùng Supabase).

> Sau này sửa code: chỉ cần `git push`, Vercel tự build & deploy lại.

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
