import type { MetadataRoute } from "next";

// Khai báo PWA: cho phép cài web ra màn hình chính, mở chạy toàn màn hình.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My English — Học cho thế giới của bạn",
    short_name: "My English",
    description:
      "Học tiếng Anh cá nhân hóa: chỉ học cụm từ và câu xoay quanh cuộc sống của bạn.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c57f5",
    lang: "vi",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
