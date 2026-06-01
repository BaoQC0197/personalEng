---
name: generate-rules-append-only
description: Quy tắc bắt buộc mỗi lần em bảo "generate" câu học từ kho /habits
metadata:
  type: feedback
---

Mỗi lần em bảo "generate": (1) CHỈ xử lý phần MỚI trong kho /habits so với lần trước; (2) KHÔNG gen trùng câu/cụm đã có trong data; (3) CHỈ THÊM mới — tuyệt đối không sửa/xóa/đổi câu cũ đã có.

**Why:** Em muốn data tích lũy an toàn, không bị xáo trộn câu đã học, và không lãng phí vào câu trùng.

**How to apply:** Theo đúng quy trình 8 bước "GENERATE" trong AI_CONTEXT.md mục 3: đọc `speaking-profile.json` + `generation-log.json` (`lastProcessedProfile`) để tìm phần mới, dedup `en`/`vi` chuẩn hóa với mọi phrase trong `src/data/phrases/`, chỉ APPEND id mới, rồi cập nhật `generation-log.json`. Liên quan [[method-mirror-vietnamese-voice]].
