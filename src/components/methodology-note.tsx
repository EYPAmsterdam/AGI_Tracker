import { methodologyNote } from "@/data/milestones";

export const MethodologyNote = () => (
  <div className="rounded-[1.5rem] border border-sky/20 bg-sky/10 px-4 py-3 text-[13px] leading-6 text-ink-800 shadow-inset md:rounded-[1.75rem] md:px-5 md:py-4 md:text-sm md:leading-7">
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky md:text-xs md:tracking-[0.22em]">
      Methodology
    </p>
    <p className="mt-2">{methodologyNote}</p>
  </div>
);
