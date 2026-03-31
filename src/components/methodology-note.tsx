import { methodologyNote } from "@/data/milestones";

export const MethodologyNote = () => (
  <div className="rounded-[1.75rem] border border-sky/20 bg-sky/10 px-5 py-4 text-sm leading-7 text-ink-800 shadow-inset">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
      Methodology
    </p>
    <p className="mt-2">{methodologyNote}</p>
  </div>
);
