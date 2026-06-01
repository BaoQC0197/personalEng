import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "My English — Học cho thế giới của bạn",
  description:
    "Website học tiếng Anh cá nhân hóa: chỉ học cụm từ và câu xoay quanh cuộc sống của bạn.",
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
