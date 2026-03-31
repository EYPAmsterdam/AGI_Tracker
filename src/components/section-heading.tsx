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
      "flex flex-col gap-4 border-b border-line/70 pb-6 md:flex-row md:items-end md:justify-between",
      compact && "pb-4"
    )}
  >
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl tracking-tight text-ink-900">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-7 text-ink-700">{description}</p>
        ) : null}
      </div>
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
);
