---
name: dev-never-build-while-dev-running
description: Tuyệt đối không build / xoá .next khi npm run dev đang chạy
metadata:
  type: feedback
---

KHÔNG chạy `npm run build` hoặc `rm -rf .next` khi `npm run dev` của em đang chạy. Làm vậy sẽ đạp lên thư mục `.next` mà dev server đang dùng → lỗi runtime "Cannot find module './xxx.js'" trên trình duyệt, dù code hoàn toàn đúng.

**Why:** Đã gây lỗi 2 lần (buổi 5 & 6), em bực vì "mỗi lần sửa xong lại lỗi" trong khi dự án Node+TS cũ chỉ cần F5. Thủ phạm là thao tác build của AI, không phải code.

**How to apply:** Sau khi sửa code, kiểm tra bằng `npx tsc --noEmit` (KHÔNG đụng .next, an toàn khi dev đang chạy). Để dev server tự hot-reload; em chỉ F5. Nếu thật sự cần `npm run build`, phải dặn em tắt `npm run dev` trước, và sau đó restart dev. Liên quan [[method-mirror-vietnamese-voice]].
