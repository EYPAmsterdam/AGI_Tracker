import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  actions,
  compact = false
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
}) => (
  <div
    className={cn(
      "flex flex-col gap-3 border-b border-line/70 pb-5 md:flex-row md:items-end md:justify-between md:gap-4 md:pb-6",
      compact && "pb-4"
    )}
  >
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 md:text-xs md:tracking-[0.24em]">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-2">
        <h2 className="font-serif text-[2rem] leading-[1.03] tracking-tight text-ink-900 md:text-3xl md:leading-none">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">{description}</p>
        ) : null}
      </div>
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
);
