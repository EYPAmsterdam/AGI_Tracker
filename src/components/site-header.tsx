"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/milestones", label: "Milestones" },
  { href: "/evidence", label: "Evidence" }
];

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-6 md:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 md:gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line/80 bg-paper-100 text-xs font-semibold uppercase tracking-[0.24em] text-ink-800 md:h-11 md:w-11 md:text-sm">
            AGI
          </span>
          <div>
            <p className="font-serif text-xl tracking-tight text-ink-900 md:text-2xl">
              AGI Milestone Tracker
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-600 md:text-xs md:tracking-[0.22em]">
              Workbook-backed tracker
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-1.5 md:gap-2">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition md:px-4 md:py-2 md:text-sm",
                  active
                    ? "border-ink-900 bg-ink-900 text-paper-50"
                    : "border-line bg-white/60 text-ink-700 hover:border-ink-700 hover:text-ink-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
