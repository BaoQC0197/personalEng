"use client";

// Thanh điều hướng responsive: thanh ngang trên desktop (md+), thu gọn thành
// nút hamburger + menu dọc trên mobile. Đánh dấu trang đang mở.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Chủ đề" },
  { href: "/practice", label: "Luyện nhớ" },
  { href: "/notes", label: "Sổ tay" },
  { href: "/habits", label: "Thói quen nói" },
  { href: "/manage", label: "Quản lý" },
  { href: "/learned", label: "Đã thuộc" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive(href)
        ? "bg-brand-50 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >
          <span className="text-xl">📖</span>
          <span className="text-lg font-extrabold tracking-tight text-slate-800">
            My English
          </span>
        </Link>

        {/* Nav ngang — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Nút hamburger — mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Mở menu"
          aria-expanded={open}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Menu dọc — mobile */}
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
          <div className="mx-auto flex max-w-4xl flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`${linkClass(l.href)} py-2.5`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
