"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/milestones", label: "Milestones" },
  { href: "/evidence", label: "Evidence" },
  { href: "/community", label: "Community" }
];

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line/80 bg-paper-100 text-sm font-semibold uppercase tracking-[0.24em] text-ink-800">
            AGI
          </span>
          <div>
            <p className="font-serif text-2xl tracking-tight text-ink-900">
              AGI Milestone Tracker
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-600">
              Mock MVP · Sample evidence
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-2">
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
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
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
