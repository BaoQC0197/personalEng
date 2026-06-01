import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "My English — Học cho thế giới của bạn",
  description:
    "Website học tiếng Anh cá nhân hóa: chỉ học cụm từ và câu xoay quanh cuộc sống của bạn.",
  manifest: "/manifest.webmanifest",
  applicationName: "My English",
  appleWebApp: {
    capable: true,
    title: "My English",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c57f5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-4 sm:py-8">{children}</main>
        <footer className="px-4 pb-8 pt-2 text-center text-xs italic text-slate-400">
          Bạn học tiếng Anh cho thế giới của bạn.
        </footer>
      </body>
    </html>
  );
}
