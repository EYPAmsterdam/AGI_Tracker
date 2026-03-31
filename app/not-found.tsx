import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-line/80 bg-white/80 p-10 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
        Not found
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink-900">Milestone not found</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-700">
        The requested milestone does not exist in this mock dataset.
      </p>
      <Link
        href="/milestones"
        className="mt-6 inline-flex rounded-full border border-ink-900 bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
      >
        Back to milestones
      </Link>
    </div>
  );
}
