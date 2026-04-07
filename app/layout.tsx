import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { getThemeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "AGI Milestone Tracker",
  description:
    "A workbook-backed MVP that tracks AGI through dimension statements, questions, optional source recommendations, and curated evidence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-paper-50 text-ink-900 antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {getThemeInitScript()}
        </Script>
        <div className="relative min-h-screen overflow-x-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[28rem]"
            style={{ background: "var(--page-atmosphere)" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-lattice bg-[size:120px_120px] opacity-30" />
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10 lg:px-8 lg:py-12">
              {children}
            </main>
            <footer className="mx-auto max-w-7xl border-t border-line/70 px-4 py-6 text-xs leading-6 text-ink-600 md:px-6 md:py-8 md:text-sm md:leading-normal lg:px-8">
              Workbook-backed MVP for dimension tracking. Published evidence appears only when added to the workbook&apos;s Evidence sheet.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
