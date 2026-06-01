# 🧠 AI_CONTEXT — Hồ sơ dự án & Nhật ký học

> **File này dành cho mọi trợ lý AI (Claude, GPT, Gemini, …).**
> Đọc file này TRƯỚC khi làm bất cứ việc gì trong dự án, để hiểu bối cảnh và
> tiếp tục đúng hướng — kể cả khi đổi sang một model AI khác.
> **Quan trọng:** sau mỗi phiên làm việc, hãy CẬP NHẬT file này (mục "Nhật ký"
> và "Trạng thái hiện tại") rồi lưu lại.

---

## 1. Vai trò & cách làm việc (đọc kỹ)

- **Người dùng = học sinh.** Tên gọi trong dự án: **"em"**. Email: bao@easygop.com.
- **Trợ lý AI = giáo viên / "Thầy".** Xưng hô: thầy gọi người dùng là **"em"**,
  tự xưng **"thầy"**. Giọng văn thân thiện, khích lệ, kiên nhẫn.
- **Sứ mệnh của Thầy:** cá nhân hóa việc học theo đúng tình hình của em — vừa
  xây/sửa website, vừa **chủ động cho ý tưởng** (thêm câu, chủ đề, tính năng,
  phương pháp học) cho đến khi em giỏi tiếng Anh.
- **Triết lý cốt lõi (slogan):**
  > _"Bạn không học tiếng Anh cho cả thế giới, bạn học cho thế giới của bạn."_
- **Nguyên tắc nội dung:** CHỈ đưa vào cụm từ / câu thật sự xuất hiện trong cuộc
  sống của em (công việc QA/Tester, nói chuyện đồng nghiệp, giao tiếp xã hội).
  **KHÔNG** nhồi "1000 mẫu câu thông dụng" chung chung mà cả đời em không dùng.
  Nội dung gom **từ từ**, đúng trình độ & thực trạng của em.
- **🔑 PHƯƠNG PHÁP GOM NỘI DUNG CHÍNH (em đề xuất, buổi 4):** không đoán mò —
  **phản chiếu giọng nói tiếng Việt của em thành tiếng Anh.** Em nhập cách mình
  nói tiếng Việt hằng ngày (từ cửa miệng, câu hay lặp, tính cách, tình huống bí)
  vào trang `/habits`; thầy đọc file `speaking-profile.json` rồi dựng bộ tiếng
  Anh **đúng chất giọng của em**. Vì là lời của chính em nên Việt→Anh bật ra tự
  nhiên, nhớ lâu — chữa thẳng bệnh active recall.

---

## 2. Hồ sơ học sinh (cập nhật dần)

- **Nghề:** QA / Tester.
- **Mục tiêu:** giao tiếp tiếng Anh trong công việc (báo bug, standup, trao đổi
  với đồng nghiệp) và đời sống xã hội quanh em.
- **Trình độ hiện tại:** **Trung cấp (intermediate)** — đọc tài liệu kỹ thuật OK,
  viết bug report cơ bản được, nói/giao tiếp còn vấp. → Chọn câu tự nhiên, đúng
  văn phong bản ngữ, không quá vỡ lòng.
- **"4 thế giới" của em (phạm vi nội dung):** ① QA/Testing · ② Kinh doanh /
  tiền bạc / dịch vụ · ③ Giao tiếp văn phòng (đồng nghiệp + email/chat) ·
  ④ Giao tiếp xã hội. → Mọi câu thêm vào nên thuộc 1 trong 4 thế giới này.
- **Ưu tiên tình huống (cần gấp):** Nói chuyện đồng nghiệp · Báo bug/viết ticket ·
  Daily standup · Viết email/chat công việc.
- **⚠️ Điểm yếu cốt lõi cần chữa:** vốn từ **bị động** mạnh (nhìn hiểu) nhưng
  **chủ động** yếu (Việt→Anh bật không ra khi nói). → Luôn ưu tiên luyện
  **active recall** (che Anh, nhìn Việt nói trước), không chỉ đọc hiểu.
- **Nhịp học mong muốn:** ~8–10 câu/buổi (vừa phải, cân bằng lượng & độ nhớ).
- **Sở thích cách học:** highlight để ghi nhớ, đánh dấu "đã thuộc", học theo
  chủ đề thực tế.
- **Ngôn ngữ giao diện mong muốn:** Tiếng Việt.

---

## 3. Dự án là gì

Website **học tiếng Anh cá nhân hóa** cho riêng em, chạy local trước, online sau.

- **Vị trí:** `D:\Nghich\PersonalBao`
- **Tech stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Lưu dữ liệu:**
  - **Nội dung học** = file JSON trong `src/data/` (đọc qua `src/lib/content.ts`).
  - **Tiến độ "đã thuộc"** = `localStorage` trình duyệt (qua `src/lib/storage.ts`).
- **Định hướng online:** chuyển nội dung & tiến độ sang **Supabase**, deploy lên
  **Vercel** (lấy domain `*.vercel.app` miễn phí). Code đã tách lớp sẵn để đổi
  nguồn dữ liệu mà KHÔNG phải sửa giao diện.

### Cấu trúc thư mục

```
src/
  app/                 # Trang (Next.js App Router)
    page.tsx           #   Trang chủ + slogan + lưới chủ đề
    topics/[topic]/    #   Trang chi tiết 1 chủ đề
    learned/           #   Trang tổng hợp câu đã thuộc
  components/          # PhraseCard, Highlight, TopicGrid, PhraseList, ...
  data/                # NỘI DUNG học (JSON) — sửa ở đây
    topics.json
    phrases/{qa-testing,colleagues,social}.json
  lib/
    content.ts         # Lớp đọc nội dung (JSON → sau đổi sang Supabase)
    storage.ts         # Lớp lưu tiến độ (localStorage → sau đổi sang Supabase)
    useProgress.ts     # Hook React quản lý trạng thái học
    types.ts           # Kiểu dữ liệu (mỗi interface ~ 1 bảng Supabase)
```

### Tính năng đã có

- Học theo chủ đề: QA/Testing 🐞, Đồng nghiệp 💬, Xã hội 🤝, Email/Chat ✉️,
  Từ nối & câu giờ 💭, Khi nghe không kịp 👂.
- **Trang chủ đề = THẺ TRẮC NGHIỆM** (`TopicQuiz.tsx`, không còn danh sách):
  random từng thẻ, mặt thẻ hiện tiếng Việt → em chọn câu tiếng Anh đúng trong 4
  đáp án. **Session CHỈ chạy câu CHƯA thuộc.** Chọn đúng KHÔNG tự đánh dấu thuộc
  — em phải tự bấm "Đã thuộc". Sai → hiện đáp án đúng + ghi chú, thẻ quay lại
  cuối hàng để ôn. Hết hàng → màn hoàn thành + nút học lại. (Component
  `PhraseList.tsx` cũ giữ lại nhưng không dùng.)
  - **Tự đọc to câu tiếng Anh SAU khi chọn đáp án** (cả đúng lẫn sai) để luyện
    nghe mọi thẻ; có nút 🔊 nghe lại. (Cố ý không đọc lúc hiện thẻ vì sẽ lộ đáp
    án — em đã chọn phương án này.)
- **Dấu sao quan trọng ⭐** (`starred` trong `PhraseProgress`): mỗi thẻ/câu có
  nút sao vàng để đánh dấu câu quan trọng, độc lập với trạng thái đã thuộc. Có ở
  cả TopicQuiz và PhraseCard (tab Đã thuộc). Lưu localStorage qua
  `toggleStarred`/`isStarred`.
- **Tab Đã thuộc** (`/learned`): nút "↩︎ Trả về chưa thuộc (học lại)" đưa câu về
  trạng thái đang học để session sau chạy lại.
- **Chia phần 20 câu** (`TopicLearn.tsx`): mỗi chủ đề tự chia phần, mỗi phần 20
  câu; màn chọn phần kèm tiến độ "đã thuộc x/20"; ≤20 câu thì vào học thẳng.
- **🗂️ Quản lý từ vựng** (`/manage`, `PhraseManager.tsx`): liệt kê mọi câu theo
  chủ đề + tìm kiếm + **XÓA thật** khỏi file JSON (API `/api/phrases/delete`,
  lib `phraseAdmin.ts`). Để em tự gỡ câu generate ra mà với em không thông dụng.
- **📒 Sổ tay từ vựng** (`/notes`, `VocabNotes.tsx`): em tự take note từ/cụm
  thấy "lạ mà quan trọng". Thêm (term + ghi chú) / xem / xóa, lưu file
  `src/data/vocab-notes.json` qua API `/api/notes` (lib `vocabNotes.ts`). Sau
  này có thể đọc để biến thành câu học (giống luồng /habits).
- **Header responsive** (`Header.tsx`, đã thành client component): thanh ngang ở
  desktop (md+), **hamburger + menu dọc ở mobile**; đánh dấu trang đang mở qua
  `usePathname`. 6 link: Chủ đề · Luyện nhớ · Sổ tay · Thói quen nói · Quản lý ·
  Đã thuộc.
- Highlight phần trọng tâm trong câu (ẩn khi đã thuộc để tự kiểm tra trí nhớ).
- Đánh dấu "đã thuộc" / "học lại", lưu vào localStorage.
- Tìm kiếm + lọc (Tất cả / Đang học / Đã thuộc), thanh tiến độ.
- Nghe phát âm câu (Web Speech API của trình duyệt).
- Trang 🏆 "Đã thuộc" tổng hợp + nút reset tiến độ.
- **🎯 Chế độ Luyện nhớ (`/practice`)** — flashcard Việt→Anh (active recall):
  hiện tiếng Việt, người học tự bật ra tiếng Anh rồi lật thẻ tự chấm
  ("Bật ra được" → đánh dấu đã thuộc / "Chưa nhớ" → thẻ quay lại cuối hàng).
  Đây là tính năng cốt lõi để chữa điểm yếu active recall của em.
- **🗣️ Thói quen nói chuyện của em (`/habits`)** — kho em tự bỏ vào *cách mình
  nói tiếng Việt hằng ngày* (4 ô: ① từ cửa miệng/từ nối · ② câu lặp lại ở chỗ
  làm · ③ tính cách & phong cách nói · ④ tình huống gần đây bị bí). Lưu xuống
  **file thật** `src/data/speaking-profile.json` qua API `/api/speaking-profile`
  (lib `speakingProfile.ts`). **Quy trình generate:** lúc nào kho đầy, em báo
  thầy "generate" → thầy đọc file này → dựng câu tiếng Anh ĐÚNG GIỌNG của em →
  thêm vào `src/data/phrases/`. Đây là nguồn nội dung chính từ giờ (xem mục 1).

### ⚙️ QUY TRÌNH "GENERATE" (đọc kỹ — làm đúng từng bước)

> **Quy tắc vàng của em:** mỗi lần generate **chỉ xử lý phần MỚI**, **không gen
> trùng** câu/cụm đã có, **chỉ THÊM mới — KHÔNG sửa/xóa/đổi** câu cũ trong data.

Khi em nhắn "generate", thầy làm tuần tự:
1. Đọc `src/data/speaking-profile.json` (kho hiện tại của em).
2. Đọc `src/data/generation-log.json` → lấy `lastProcessedProfile` (đã xử lý
   lần trước).
3. **Tìm phần MỚI** = nội dung trong profile hiện tại mà CHƯA có trong
   `lastProcessedProfile` (so theo từng dòng/cụm). Chỉ làm việc với phần mới này.
4. Soạn câu tiếng Anh từ phần mới, **đúng chất giọng của em** (tham chiếu ô ③
   tính cách + ô ① từ cửa miệng để chọn văn phong).
5. **Chống trùng:** so từng câu định thêm với TẤT CẢ phrase đang có trong
   `src/data/phrases/*.json` (so `en` và `vi` đã chuẩn hóa: lowercase, bỏ dấu
   câu thừa). Trùng thì bỏ.
6. **CHỈ APPEND** phrase mới vào file phrases phù hợp (id mới, duy nhất). Tuyệt
   đối không chỉnh sửa object phrase đã tồn tại.
7. Cập nhật `generation-log.json`: gán `lastProcessedProfile` = snapshot profile
   hiện tại; push 1 run `{ at, addedPhraseIds, fromFields }`.
8. Báo em: đã thêm bao nhiêu câu, vào chủ đề nào, có gì bỏ qua vì trùng.

---

## 4. Cách chạy

```powershell
cd D:\Nghich\PersonalBao
npm install   # lần đầu
npm run dev   # mở http://localhost:3000  (Ctrl+C để tắt)
```

> Lưu ý: localhost chỉ hoạt động khi cửa sổ `npm run dev` đang mở. Đóng cửa sổ =
> server tắt = localhost báo lỗi kết nối (điều này là bình thường).

> ⛔ **QUY TẮC CHO AI (đọc kỹ — đã gây lỗi 2 lần):** KHÔNG chạy `npm run build`
> hay `rm -rf .next` khi `npm run dev` đang chạy. Build/xoá `.next` lúc đó sẽ
> đạp lên thư mục dev server đang dùng → trình duyệt báo "Cannot find module
> './xxx.js'" dù code đúng. Sau khi sửa code: chỉ kiểm tra bằng `npx tsc
> --noEmit` (KHÔNG đụng `.next`), rồi để dev server tự hot-reload — em chỉ cần
> F5. Nếu bắt buộc phải build, dặn em tắt dev trước rồi restart sau.

---

## 5. Cách thêm nội dung (thao tác hay làm nhất)

Thêm 1 câu = thêm 1 object vào file JSON tương ứng trong `src/data/phrases/`:

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

- `id` phải duy nhất; `topicId` phải khớp 1 chủ đề trong `topics.json`.
- `highlights` phải là chuỗi con xuất hiện y hệt trong `en`.
- Thêm chủ đề mới: thêm vào `topics.json` → tạo `src/data/phrases/<id>.json` →
  import & nối vào `allPhrases` trong `src/lib/content.ts`.

Chi tiết đầy đủ xem [README.md](README.md).

---

## 6. Lộ trình (roadmap)

- [x] Dựng website local: 3 chủ đề + seed ~34 câu thực tế.
- [x] Highlight, đánh dấu đã thuộc, filter/search, phát âm, trang Đã thuộc.
- [x] Chế độ Luyện nhớ flashcard Việt→Anh (active recall) tại `/practice`.
- [x] **Trang "Thói quen nói chuyện của em" (`/habits`)** — kho input 4 ô,
      lưu file, để generate câu theo giọng của em (nguồn nội dung chính).
- [x] **Generate đợt 1 từ `/habits`** (buổi 5): 2 chủ đề mới 💭 connectors (16) +
      👂 clarify (10) = 26 câu, đúng gốc bệnh "nói chậm/nghe không kịp".
- [ ] **Thêm chủ đề "Kinh doanh / tiền bạc / dịch vụ"** (thế giới ② còn thiếu).
- [x] **Đủ bộ 6 chủ đề × 50 câu = 300 câu** (buổi 10), đã kiểm chất lượng 3 vòng.
- [ ] Gom thêm câu theo tình huống thực tế của em (ưu tiên QA & đồng nghiệp).
- [ ] (Tuỳ chọn) Spaced repetition thật (lịch ôn theo ngày) cho chế độ Luyện nhớ.
- [ ] Kết nối Supabase (bảng `topics`, `phrases`, `user_progress`).
- [ ] Deploy Vercel + domain free.

---

## 7. Nhật ký làm việc & học (mới nhất ở trên cùng)

> Mỗi phiên thêm 1 mục: ngày, đã làm gì, em học/ghi nhớ gì, việc tiếp theo.

### 2026-06-01 (buổi 16) — Luyện NÓI: ghi âm + chấm điểm, gate qua câu
- Thêm chế độ "🎤 Bắt buộc luyện nói" (bật/tắt, ghim localStorage). Sau khi chọn
  đáp án: em bấm mic đọc câu → `SpeechRecognition` nhận chữ → `scoreMatch` chấm
  % từ nói trúng. ≥70% = đạt → mới mở khoá "Tiếp tục" (có nút "Bỏ qua" để không
  kẹt cứng). `src/lib/speechRecognition.ts` + `SpeakCheck.tsx`, ghép vào TopicQuiz.
- KHÔNG gây lag (chỉ chạy khi bấm mic). Hạn chế: tốt trên Chrome/Android, iOS
  Safari chập chờn; cần mạng + quyền micro → mặc định TẮT, có cảnh báo khi thiết
  bị không hỗ trợ.

### 2026-06-01 (buổi 15) — Chọn giọng đọc Nam/Nữ (luyện nghe)
- Em hỏi vì sao lúc nam lúc nữ: do trước đây KHÔNG ghim giọng → trình duyệt tự
  chọn giọng mặc định (khác nhau theo máy/trình duyệt). Web Speech API chạy
  offline trên máy nên KHÔNG gây lag.
- Tạo `src/lib/speech.ts` (speak trung tâm + ghim giọng + đoán giới tính theo
  tên + lưu localStorage VÌ giọng khác nhau theo thiết bị). Component
  `VoicePicker.tsx`: nút 👩 Nữ / 👨 Nam + dropdown giọng cụ thể + Nghe thử.
- Gỡ hàm `speak` cũ trong TopicQuiz/PracticeSession/PhraseCard → dùng chung
  `@/lib/speech`. Gắn `VoicePicker` ở trang /practice và trang chủ đề. tsc OK.

### 2026-06-01 (buổi 14) — PWA: cài ra màn hình chính
- Em xác nhận tốc độ đã ổn (non-blocking). Thêm **PWA** để cài web ra màn hình
  chính như app: `app/manifest.ts` (display standalone, theme #1c57f5),
  icon động bằng `next/og` (`src/lib/appIcon.tsx` → routes `/icon-192.png`,
  `/icon-512.png`, `/apple-icon.png`, gradient xanh + chữ "ME"), metadata
  `manifest`/`appleWebApp`/`icons` + `viewport.themeColor` trong layout.
- Đã verify trên prod: manifest `application/manifest+json` đúng; 3 icon trả
  `image/png`. Cài: iOS Safari = Share → Add to Home Screen; Android Chrome =
  menu ⋮ → Add to Home screen / Install app.

### 2026-06-01 (buổi 13) — GĐ3 deploy Vercel + gỡ lag production
- **Deploy xong:** git init → push GitHub (BaoQC0197/personalEng) → Vercel import
  + 2 env → live tại **https://personal-eng.vercel.app**. (gh CLI chưa cài; push
  HTTPS dùng credential sẵn của máy.)
- **Tối ưu tốc độ:** đổi trang nội dung sang `revalidate=300` (ISR, cache CDN) +
  `vercel.json` region `sin1` + `next.config` `eslint.ignoreDuringBuilds`.
- **Bug lag nặng:** mọi API gọi Supabase mất **~7.4s** (trang tĩnh 0.5s, Supabase
  trực tiếp 0.4s → 7s nằm TRONG function Vercel). Chẩn đoán bằng `/api/ping`:
  Node trivial nhanh (~0.3s) ⇒ KHÔNG phải cold start; `fetch` thô tới Supabase
  từ function **fail ngay 2ms** còn supabase-js đi được nhưng 7s ⇒ **vấn đề
  kết nối IPv6/định tuyến Vercel↔Supabase**. Ép `dns.setDefaultResultOrder
  ("ipv4first")` trong `supabase.ts` (chưa dứt 7s).
- **Giải pháp chốt (nằm trong tầm kiểm soát):** `useProgress` **không chặn UI** —
  `ready=true` ngay, tải tiến độ NGẦM. Nội dung cache CDN hiện tức thì; "đã
  thuộc/sao" cập nhật sau ~vài giây. App dùng mượt dù sync nền còn chậm.
- **CÒN TỒN (tuỳ chọn):** sync tiến độ nền vẫn ~7s do mạng. Cách dứt điểm: đặt
  Vercel region = đúng region Supabase. Tìm region qua nút **Connect** trên
  Supabase (host pooler dạng `aws-0-<region>.pooler.supabase.com`, vd
  `ap-southeast-1`=sin1, `us-east-1`=iad1) → sửa `vercel.json`.

### 2026-06-01 (buổi 12) — GĐ1 seed + GĐ2 nối app vào Supabase (đã test thật)
- Em đã tạo project + chạy schema + seed: **6 chủ đề, 300 câu** trên Supabase. Key
  Supabase đời mới: dùng **Secret key `sb_secret_...`** (thay service_role) +
  Project URL (bỏ đuôi /rest/v1/). `.env.local` đã điền, `npm run db:seed` OK.
- **GĐ2 — nối app (đều có fallback file/localStorage nếu thiếu env):**
  - `content.ts` async đọc topics/phrases từ Supabase (order theo sort_order).
  - 5 trang chuyển async + `export const dynamic = "force-dynamic"` (home,
    topics/[topic] (+generateStaticParams async), learned, practice, manage).
  - Tiến độ: `progressDb.ts` + API `/api/progress` (GET configured+progress,
    POST toggleLearned/toggleStar). `useProgress` rewrite: dùng API khi có DB,
    else localStorage — GIỮ NGUYÊN interface nên component không đổi.
  - `speakingProfile.ts`, `vocabNotes.ts`, `phraseAdmin.ts` thêm nhánh Supabase.
- **Đã test thật:** smoke test (6 topics/300 phrases/progress round-trip OK);
  chạy `next dev -p 3010` → /api/progress trả `configured:true`, trang chủ +
  trang QA render nội dung từ Supabase, không lỗi. tsc exit 0.
- **Việc tiếp theo — GĐ3 deploy Vercel:** (a) em RESTART `npm run dev` để local
  nạp .env.local (giờ local cũng chạy Supabase, tiến độ đồng bộ); (b) git init →
  push GitHub → import Vercel → thêm 2 env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  → deploy.

### 2026-06-01 (buổi 11) — Lên production: GĐ1 nền Supabase
- Em chốt: **chuyển TOÀN BỘ sang Supabase, KHÔNG đăng nhập** (app cá nhân).
- **Kiến trúc chốt:** sau khi lên prod, **Supabase = nguồn gốc nội dung**; file
  JSON chỉ để seed lần đầu + soạn nháp. Mọi GHI đi qua **API server dùng SERVICE
  ROLE key** (bí mật, server-only); RLS bật + không policy → anon không truy cập.
  Có **fallback** về file/localStorage khi chưa set env (local không vỡ).
- **Generate sau này (trả lời câu hỏi của em):** thầy author lô mới →
  `npm run db:add <file>` upsert theo id (idempotent, tự dedup nội dung với DB,
  KHÔNG resurrect câu đã xóa, tự xếp cuối chủ đề). Quy trình generate gần như giữ nguyên.
- **Đã làm GĐ1:** `supabase/schema.sql` (5 bảng: topics, phrases, user_progress,
  speaking_profile, vocab_notes), `src/lib/supabase.ts` (client service-role +
  `isSupabaseConfigured`), `scripts/seed.mjs` + `scripts/add-phrases.mjs` +
  `scripts/_env.mjs`, `.env.local.example`, `SUPABASE_DEPLOY.md`. Thêm dep
  `@supabase/supabase-js`, scripts `db:seed`/`db:add`. tsc exit 0.
- **Việc tiếp theo:** GĐ2 — nối app vào Supabase (content.ts async đọc DB; API
  progress + chuyển speaking-profile/notes/phraseAdmin sang Supabase; useProgress
  đọc/ghi qua API; đều có fallback). Rồi GĐ3 — git + GitHub + Vercel env + deploy.

### 2026-06-01 (buổi 10) — Gen nốt 3 chủ đề + kiểm chất lượng 3 vòng
- Em yêu cầu đảm bảo chất lượng ("chạy 3 lần"). Gen nốt **💭 Từ nối (→50,
  conn-017→050), 👂 Nghe không kịp (→50, clar-011→050), 🤝 Xã hội (→50,
  soc-011→050)**. → **Đủ bộ 6 chủ đề × 50 = 300 câu.**
- **Kiểm chất lượng 3 vòng (script)** trên toàn bộ 300 câu:
  - V1 Cấu trúc/ID: 6×50, JSON OK, 0 ID trùng, topicId khớp file, không thiếu en/vi.
  - V2 Highlight: tất cả cụm highlight đều là chuỗi con khớp trong câu Anh.
  - V3 Trùng/gần trùng (chuẩn hóa, so cả 6 chủ đề): 0 câu trùng EN, 0 trùng VI.
  - `npx tsc --noEmit` exit 0.
- **Việc tiếp theo (tuỳ chọn):** nút tốc độ đọc 🐢/🐇; biến /habits & /notes thành
  câu học; spaced repetition; kết nối Supabase + deploy Vercel.

### 2026-06-01 (buổi 9) — Sổ tay từ vựng + auto-đọc luyện nghe + responsive mobile
- **Auto đọc câu Anh SAU khi chọn đáp án** (cả đúng/sai) trong TopicQuiz để luyện
  nghe mọi thẻ + nút 🔊 nghe lại. (Không đọc lúc hiện thẻ vì lộ đáp án — em chọn.)
- **📒 Sổ tay từ vựng `/notes`**: em tự take note từ/cụm "lạ mà quan trọng".
  Thêm/xem/xóa, lưu `vocab-notes.json` qua API `/api/notes`.
- **Refactor mobile:** Header thành client component responsive (hamburger ở
  mobile, thanh ngang ở desktop, đánh dấu trang active). Tinh chỉnh hàng nút
  sau khi trả lời trong quiz cho gọn trên màn hẹp. Home/TopicGrid vốn đã có `sm:`.
- `npx tsc --noEmit` exit 0. Không build (dev có thể đang chạy) — F5.
- **Việc tiếp theo (vẫn dở):** còn 3 chủ đề lên ~50: 💭 Từ nối → 👂 Nghe không
  kịp → 🤝 Xã hội. (tuỳ chọn) nút tốc độ đọc 🐢/🐇 cho luyện nghe.

### 2026-06-01 (buổi 8) — Chia phần 20 câu, mở rộng QA→50, màn Quản lý từ vựng
- **Mục tiêu nội dung:** em chốt ~**50 câu/chủ đề** (giảm từ 100), "thông dụng
  nhất TRONG từng mảng của em" — vẫn đúng triết lý, không phải câu vu vơ.
- **Chia phần:** `TopicLearn.tsx` tự chia mỗi 20 câu/phần (count-agnostic).
- **QA/Testing → 50 câu** (qa-013→050): bug nâng cao, severity/priority,
  test design, Jira/standup, automation/CI, môi trường/release. Validate: 0
  trùng id, mọi highlight khớp. Đây là **format mẫu** cho 5 chủ đề còn lại.
- **Màn Quản lý từ vựng `/manage`:** em yêu cầu nơi để XÓA câu generate ra mà
  với em không thông dụng (đúng triết lý "gác cổng thế giới của em"). Xóa thật
  khỏi file JSON qua API. (Note: ghi file chỉ chạy local; Supabase sau.)
- Mở rộng tiếp: **💬 Đồng nghiệp → 50** (col-013→050: nhờ/giúp, đồng tình–phản
  biện, họp, góp ý, hẹn lịch, xin lỗi) và **✉️ Email/Chat → 50** (mail-011→050:
  mở đầu, nhờ vả, xác nhận, hẹn lịch, cập nhật, đính kèm, câu kết). Validate 0
  trùng, highlight khớp hết.
- **Việc tiếp theo (ĐANG DỞ):** còn 3 chủ đề lên ~50: **💭 Từ nối (16→50) → 👂
  Nghe không kịp (10→50) → 🤝 Xã hội (10→50)**. Đã xong: QA, Đồng nghiệp,
  Email/Chat (đều 50).

### 2026-06-01 (buổi 7) — Sửa luật "đã thuộc" + dấu sao quan trọng
- Em chỉ ra: chọn đúng mà tự nhảy sang "đã thuộc" là sai. Sửa lại:
  - **Bỏ auto-mark.** Chọn đúng chỉ qua thẻ; chỉ khi em **tự bấm "Đã thuộc"**
    mới tính là thuộc.
  - **Session chỉ chạy câu CHƯA thuộc** (lọc `status !== "learned"` khi dựng
    hàng). Đã thuộc hết → màn "Em đã thuộc hết chủ đề này".
  - **Tab Đã thuộc trả câu về chưa thuộc** (nút đã có sẵn, đổi nhãn cho rõ).
  - **Dấu sao quan trọng ⭐**: thêm `starred` vào `PhraseProgress` +
    `toggleStarred`/`isStarred` trong storage/useProgress; nút sao vàng ở
    TopicQuiz và PhraseCard.
- `npx tsc --noEmit` exit 0. KHÔNG build (dev đang chạy) — em chỉ F5.
- **Việc tiếp theo:** (tuỳ chọn) làm trang/lọc xem riêng các câu ⭐ quan trọng;
  cân nhắc spaced repetition.

### 2026-06-01 (buổi 6) — Trang chủ đề chuyển sang THẺ TRẮC NGHIỆM
- Em phản hồi: xem danh sách câu trong chủ đề khó học. → Đổi sang **học theo
  thẻ trắc nghiệm** (`TopicQuiz.tsx`): random từng thẻ, hiện tiếng Việt, chọn câu
  tiếng Anh đúng trong 4 đáp án (em chọn chiều **Việt→Anh** — đúng bệnh).
- Cơ chế: đúng lần đầu → mark đã thuộc + auto qua thẻ (850ms) + đọc to câu Anh;
  sai → hiện đáp án đúng + ghi chú, thẻ quay lại cuối hàng ôn lại; hết hàng →
  màn Hoàn thành (thống kê "đúng ngay lần đầu") + nút học lại random.
- Thay `PhraseList` bằng `TopicQuiz` trong `topics/[topic]/page.tsx`.
- ⚠️ **Bài học (buổi 6):** thầy chạy `npm run build` + `rm -rf .next` trong khi
  `npm run dev` đang chạy → đạp lên `.next`, gây lỗi runtime "Cannot find module
  './276.js'" trên trình duyệt (code vẫn đúng). → Xem QUY TẮC ở mục 4.
- **Việc tiếp theo:** em test thử thẻ ở 1 chủ đề; nếu muốn có thêm nút "xem danh
  sách câu để học trước rồi mới quiz" thì báo thầy (PhraseList vẫn còn sẵn).

### 2026-06-01 (buổi 5) — Generate đợt 1 từ kho /habits của em
- Em đã đổ dữ liệu vào `/habits`. Chẩn đoán từ ô ③: em **nói chậm, vừa nói vừa
  nghĩ**, tiếng Việt dùng nhiều từ nối nhưng tiếng Anh không thuộc từ nối nên
  **bí/khựng**. Ô ④: **nghe không kịp** nên không biết trả lời.
- Generate (theo đúng quy trình 8 bước, dedup OK, append-only) **2 chủ đề mới**:
  - 💭 **connectors** "Từ nối & câu giờ khi nói" — 16 câu (conn-001→016): map đúng
    từ em hay dùng (I mean, Well, If you ask me, I'd say, kind of like, But then
    again, Usually, To be honest, The thing is, Let me check real quick...) +
    câu "câu giờ" (Let me think for a second, How should I put it, Give me a
    second).
  - 👂 **clarify** "Khi nghe không kịp" — 10 câu (clar-001→010): say that again,
    didn't catch that, slow down, you're breaking up, Do you mean...?, type it
    in the chat, what was that again...
  - Đăng ký `topics.json` + nối `content.ts`. Build sạch 13/13 trang (sau khi
    `rm -rf .next` vì cache lẫn với dev server gây lỗi giả ở /learned).
- Cập nhật `generation-log.json`: `lastProcessedProfile` = snapshot hiện tại +
  run đợt 1. Lần sau chỉ lấy phần em thêm mới.
- **Việc tiếp theo:** em luyện 2 chủ đề mới ở `/practice`, câu nào không ưng thì
  xóa; đổ thêm vào `/habits` rồi báo thầy generate đợt 2.

### 2026-06-01 (buổi 4) — Phương pháp "phản chiếu giọng Việt" + trang /habits
- **Em đề xuất ý tưởng lớn:** thay vì thầy đoán câu, em sẽ đưa thầy *cách em nói
  tiếng Việt hằng ngày* (từ cửa miệng, câu hay lặp, tính cách/phong cách, tình
  huống bí) → thầy dựng bộ tiếng Anh khớp đúng giọng em. Đây thành **nguồn nội
  dung chính** (ghi mục 1) — đúng triết lý "học cho thế giới của em".
- Em muốn **một nơi để bỏ dần khi nhớ ra**, không phải nói hết một lúc. → Thầy
  dựng trang **`/habits` "Thói quen nói chuyện của em"**: 4 ô textarea, lưu xuống
  **file thật** `src/data/speaking-profile.json` qua API route
  `/api/speaking-profile` + lib `speakingProfile.ts`. Thêm link "Thói quen nói"
  ở Header. Build OK.
- **Quy trình từ giờ:** em đổ dữ liệu vào `/habits` (bất cứ lúc nào) → khi đủ,
  em nhắn thầy "generate" → thầy đọc file → tạo câu tiếng Anh đúng giọng em →
  thêm vào `src/data/phrases/` (chủ đề mới hoặc chủ đề sẵn có).
- **Việc tiếp theo:** chờ em nhập đợt đầu vào `/habits`, rồi generate. (Lưu ý
  online sau: file này cần chuyển sang Supabase vì Vercel không ghi file được.)

### 2026-06-01 (buổi 3) — Chữa bệnh "hiểu mà nói không ra"
- Em nêu vấn đề: nhận ra từ khi đọc (vd "day off") nhưng khi nói Việt→Anh thì
  bật không ra. Thầy chẩn đoán: vốn từ **bị động** mạnh, **chủ động** yếu.
- Xây **Chế độ Luyện nhớ** (`/practice`, component `PracticeSession.tsx`):
  flashcard Việt→Anh, tự bật ra trước → lật thẻ → tự chấm; "Bật ra được" tự
  đánh dấu đã thuộc, "Chưa nhớ" cho thẻ quay lại ôn. Thêm link ở Header + nút ở
  trang chủ. Build OK.
- Ghi nhận **"4 thế giới"** của em vào hồ sơ (mục 2). Thế giới ②
  "Kinh doanh/tiền bạc/dịch vụ" CHƯA có chủ đề → đưa vào roadmap.
- **Việc tiếp theo gợi ý:** (a) hỏi em luyện /practice thấy câu nào hay tắc để
  gom thêm; (b) mở chủ đề "Kinh doanh / tiền bạc / dịch vụ".

### 2026-06-01 (buổi 2) — Khảo sát & mở chủ đề Email/Chat
- Đánh giá: em ở trình độ **trung cấp**, ưu tiên 4 mảng (đồng nghiệp, báo bug,
  standup, email/chat), nhịp ~8–10 câu/buổi.
- Mở chủ đề mới **"Email & Chat công việc"** (`email-chat`) + 10 câu trung cấp
  (mail-001 → mail-010): heads-up, take a look, attached, follow up, as
  discussed, just to confirm, thanks in advance...
- **Việc tiếp theo gợi ý:** buổi sau hỏi em xem mảng nào vấp nhất để gom thêm
  câu theo tình huống thật; cân nhắc thêm chế độ flashcard/ôn tập.

### 2026-06-01 (buổi 1) — Khởi tạo dự án
- Dựng toàn bộ website Next.js + TS + Tailwind, build & chạy local OK.
- Seed dữ liệu: QA/Testing (12 câu), Đồng nghiệp (12 câu), Xã hội (10 câu).
- Thiết lập vai trò Thầy–trò và file AI_CONTEXT.md này để mọi AI tiếp nối được.
