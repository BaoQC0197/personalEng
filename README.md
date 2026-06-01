# My English — Học cho thế giới của bạn

> _"Bạn không học tiếng Anh cho cả thế giới, bạn học cho thế giới của bạn."_

Website học tiếng Anh **cá nhân hóa**: chỉ học những cụm từ và câu thật sự xuất
hiện trong cuộc sống của bạn (công việc QA/Tester, trò chuyện với đồng nghiệp,
giao tiếp xã hội). Không học thuộc lòng những thứ cả đời không dùng tới.

> 🧠 **Trợ lý AI / người mới vào dự án:** đọc [AI_CONTEXT.md](AI_CONTEXT.md) trước
> — đó là hồ sơ dự án + nhật ký học để hiểu bối cảnh và tiếp tục công việc.

## ✨ Tính năng

- 📂 **Học theo chủ đề** xoay quanh cuộc sống của bạn.
- 🖍️ **Highlight** phần trọng tâm trong mỗi câu để tăng cường ghi nhớ.
- ✅ **Đánh dấu "đã thuộc"** — câu đã thuộc sẽ chuyển trạng thái, ẩn highlight để
  tự kiểm tra trí nhớ.
- 🔊 **Nghe phát âm** từng câu (dùng giọng đọc sẵn của trình duyệt).
- 🔍 **Tìm kiếm & lọc** (Tất cả / Đang học / Đã thuộc).
- 📊 **Thanh tiến độ** cho từng chủ đề và tổng thể.
- 🏆 Trang **"Đã thuộc"** tổng hợp mọi câu bạn đã nắm.

Tiến độ học được lưu trong **localStorage** của trình duyệt (chỉ trên máy bạn).

## 🚀 Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

Build production: `npm run build` rồi `npm start`.

## ✍️ Cách thêm cụm từ / câu mới

Nội dung nằm trong các file JSON ở [src/data/](src/data/):

- Chủ đề: [src/data/topics.json](src/data/topics.json)
- Cụm từ theo chủ đề: [src/data/phrases/](src/data/phrases/)
  - `qa-testing.json`, `colleagues.json`, `social.json`

Thêm 1 câu = thêm 1 object vào file JSON của chủ đề tương ứng:

```json
{
  "id": "qa-013",
  "topicId": "qa-testing",
  "en": "Let me roll back the change.",
  "vi": "Để tôi hoàn tác thay đổi đó.",
  "highlights": ["roll back"],
  "note": "'roll back' = hoàn tác về phiên bản trước.",
  "tags": ["release"]
}
```

| Trường        | Bắt buộc | Ý nghĩa                                                        |
| ------------- | :------: | ------------------------------------------------------------- |
| `id`          |    ✅    | Mã duy nhất (không trùng). Gợi ý: tiền tố theo chủ đề + số.    |
| `topicId`     |    ✅    | Phải khớp `id` của một chủ đề trong `topics.json`.            |
| `en`          |    ✅    | Câu/cụm tiếng Anh.                                            |
| `vi`          |    ✅    | Nghĩa tiếng Việt.                                            |
| `highlights`  |    —     | Mảng các đoạn cần tô sáng (phải là chuỗi con xuất hiện trong `en`). |
| `ipa`         |    —     | Phiên âm.                                                    |
| `note`        |    —     | Ghi chú / mẹo dùng.                                          |
| `example`     |    —     | Ví dụ thêm trong ngữ cảnh.                                   |
| `tags`        |    —     | Mảng nhãn để lọc/tìm kiếm.                                   |

### Thêm một chủ đề mới

1. Thêm object vào [src/data/topics.json](src/data/topics.json) (đặt `id`, `title`,
   `description`, `icon` emoji, `accent` là cặp class gradient Tailwind).
2. Tạo file `src/data/phrases/<id>.json` chứa mảng câu.
3. Import file đó trong [src/lib/content.ts](src/lib/content.ts) và nối vào
   `allPhrases`.

## 🗂️ Cấu trúc thư mục

```
src/
  app/                 # Các trang (Next.js App Router)
    page.tsx           # Trang chủ + slogan + lưới chủ đề
    topics/[topic]/    # Trang chi tiết 1 chủ đề
    learned/           # Trang tổng hợp câu đã thuộc
  components/          # PhraseCard, Highlight, TopicGrid, PhraseList, ...
  data/                # NỘI DUNG học (JSON) — bạn sửa ở đây
  lib/
    content.ts         # Lớp đọc nội dung (JSON → sau này đổi sang Supabase)
    storage.ts         # Lớp lưu tiến độ (localStorage → sau này Supabase)
    useProgress.ts     # Hook React quản lý trạng thái học
    types.ts           # Kiểu dữ liệu (mỗi interface ~ 1 bảng Supabase)
```

## ☁️ Lên online sau này (Supabase + Vercel)

Code đã được **tách lớp sẵn** để chuyển đổi dễ dàng:

- **Nội dung** → thay phần thân các hàm trong `src/lib/content.ts` bằng truy vấn
  Supabase (`supabase.from("phrases").select()`...). Mỗi `interface` trong
  `types.ts` tương ứng một bảng.
- **Tiến độ** → thay phần thân `loadProgress` / `saveProgress` trong
  `src/lib/storage.ts` bằng bảng `user_progress` (kèm `user_id`).
- **Deploy Vercel**: push code lên GitHub → import vào Vercel → có ngay domain
  `*.vercel.app` miễn phí. Khai báo biến môi trường Supabase trong phần
  Environment Variables của Vercel.

Giao diện (`components/`) **không cần sửa** khi đổi nguồn dữ liệu, vì chỉ phụ
thuộc vào các kiểu trong `types.ts`.

## 🔒 Ghi chú bảo mật

Còn 2 cảnh báo `npm audit` nằm trong tooling build đi kèm Next.js 14 (postcss).
Chúng chỉ liên quan khi xử lý CSS không tin cậy lúc build, không ảnh hưởng app
cá nhân chạy local. Khi sẵn sàng có thể nâng lên Next 16 (lưu ý: có breaking
change về `params` bất đồng bộ).

---

Chúc bạn học vui và đúng với **thế giới của bạn**! 🌱
