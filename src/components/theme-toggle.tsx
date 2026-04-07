"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY, ThemeMode } from "@/lib/theme";

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.75v2.1" />
    <path d="M12 19.15v2.1" />
    <path d="m5.46 5.46 1.48 1.48" />
    <path d="m17.06 17.06 1.48 1.48" />
    <path d="M2.75 12h2.1" />
    <path d="M19.15 12h2.1" />
    <path d="m5.46 18.54 1.48-1.48" />
    <path d="m17.06 6.94 1.48-1.48" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M20.5 14.25A8.5 8.5 0 1 1 9.75 3.5a6.75 6.75 0 0 0 10.75 10.75Z" />
  </svg>
);

const isThemeMode = (value: string | null | undefined): value is ThemeMode =>
  value === "light" || value === "dark";

const getCurrentTheme = (): ThemeMode => {
  if (typeof document !== "undefined" && isThemeMode(document.documentElement.dataset.theme)) {
    return document.documentElement.dataset.theme;
  }

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const isDark = theme === "dark";
  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title="Toggle color theme"
      onClick={toggleTheme}
      className="inline-flex h-[34px] shrink-0 items-center rounded-full border border-line bg-paper-100/75 px-1 text-ink-700 shadow-inset transition hover:border-ink-700 hover:text-ink-900 md:h-[42px] md:px-1.5"
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full transition md:h-8 md:w-8",
          isDark ? "text-ink-600/80" : "bg-white/90 text-amber shadow-sm ring-1 ring-line/40"
        )}
      >
        <SunIcon className={cn("h-4 w-4 md:h-[1.05rem] md:w-[1.05rem]")} />
      </span>
      <span
        aria-hidden
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full transition md:h-8 md:w-8",
          isDark ? "bg-white/90 text-sky shadow-sm ring-1 ring-line/40" : "text-ink-600/80"
        )}
      >
        <MoonIcon className={cn("h-4 w-4 md:h-[1.05rem] md:w-[1.05rem]")} />
      </span>
      <span className="sr-only">{isDark ? "Dark mode is on" : "Dark mode is off"}</span>
    </button>
  );
};
