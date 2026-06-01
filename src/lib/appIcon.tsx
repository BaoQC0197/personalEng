// Tạo icon app động bằng next/og (không cần file ảnh nhị phân).
// Gradient xanh thương hiệu + chữ "ME" (My English / "me" — học cho thế giới của em).
import { ImageResponse } from "next/og";

export function iconResponse(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3377ff 0%, #1c57f5 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: size * 0.44,
            fontWeight: 800,
            color: "white",
            letterSpacing: -size * 0.02,
          }}
        >
          ME
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
