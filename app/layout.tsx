import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "AGI Milestone Tracker",
  description:
    "A mock MVP that tracks AGI through implementation-focused milestone statements, sub-questions, and sample evidence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper-50 text-ink-900 antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(53,82,107,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(50,101,83,0.15),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.7),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-lattice bg-[size:120px_120px] opacity-30" />
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
              {children}
            </main>
            <footer className="mx-auto max-w-7xl border-t border-line/70 px-6 py-8 text-sm text-ink-600 lg:px-8">
              Mock MVP for implementation-based AGI tracking. Evidence items in this demo are sample evidence only.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
