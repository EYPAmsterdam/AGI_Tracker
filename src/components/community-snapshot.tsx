import Link from "next/link";
import { communitySuggestions } from "@/data/milestones";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const suggestionStyles = {
  queued: "border-amber/25 bg-amber/10 text-amber",
  reviewing: "border-sky/25 bg-sky/10 text-sky",
  merged: "border-sage/25 bg-sage/10 text-sage"
};

export const CommunitySnapshot = () => (
  <div className="rounded-[1.75rem] border border-line/80 bg-white/75 p-6 shadow-panel">
    <div className="flex items-end justify-between gap-4 border-b border-line/70 pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
          Community
        </p>
        <h3 className="mt-2 font-serif text-2xl text-ink-900">Suggestion queue</h3>
      </div>
      <Link href="/community" className="text-sm font-medium text-sky hover:text-ink-900">
        Open form
      </Link>
    </div>
    <div className="mt-4 space-y-3">
      {communitySuggestions.slice(0, 3).map((suggestion) => (
        <div
          key={suggestion.id}
          className="rounded-[1.25rem] border border-line/70 bg-paper-50/65 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">{suggestion.suggestedMilestone}</p>
              <p className="mt-1 text-sm leading-6 text-ink-700">{suggestion.note}</p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                suggestionStyles[suggestion.status]
              )}
            >
              {suggestion.status}
            </span>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-600">
            {suggestion.author} · {formatLongDate(suggestion.createdAt)}
          </p>
        </div>
      ))}
    </div>
  </div>
);
