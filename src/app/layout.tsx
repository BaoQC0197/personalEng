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
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
          Bạn không học tiếng Anh cho cả thế giới — bạn học cho thế giới của bạn.
        </footer>
      </body>
    </html>
  );
}
