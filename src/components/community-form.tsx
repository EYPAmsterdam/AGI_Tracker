"use client";

import { useState } from "react";
import { communitySuggestions } from "@/data/milestones";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const fieldClass =
  "w-full rounded-[1.35rem] border border-line/80 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-600 focus:border-ink-700";

const suggestionStyles = {
  queued: "border-amber/25 bg-amber/10 text-amber",
  reviewing: "border-sky/25 bg-sky/10 text-sky",
  merged: "border-sage/25 bg-sage/10 text-sage"
};

export const CommunityForm = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <form
        className="rounded-[2rem] border border-line/80 bg-white/80 p-6 shadow-panel md:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="border-b border-line/70 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
            Suggestion form
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Public input mockup</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-700">
            This form is UI-only for the MVP. It does not submit anywhere, but it shows how future community evidence and milestone proposals could enter review.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Suggested milestone
            </label>
            <input className={fieldClass} placeholder="Example: AI can independently run a small procurement process" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Suggested sub-question
            </label>
            <input className={fieldClass} placeholder="Example: Can it collect bids, compare them, and document tradeoffs?" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Suggested evidence link
            </label>
            <input className={fieldClass} placeholder="https://example.org/report-or-paper" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Comment
            </label>
            <textarea
              className={cn(fieldClass, "min-h-[160px] resize-y")}
              placeholder="Add rationale for why this milestone, sub-question, or evidence should be reviewed."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex rounded-full border border-ink-900 bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
          >
            Submit mock suggestion
          </button>
          {submitted ? (
            <p className="text-sm text-sage">
              Suggestion captured in the UI preview. No backend is connected in this MVP.
            </p>
          ) : (
            <p className="text-sm text-ink-700">
              Expected next step in a real product: route to reviewer triage and evidence validation.
            </p>
          )}
        </div>
      </form>

      <aside className="rounded-[2rem] border border-line/80 bg-white/80 p-6 shadow-panel md:p-8">
        <div className="border-b border-line/70 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
            Current queue
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Sample community suggestions</h2>
        </div>
        <div className="mt-6 space-y-4">
          {communitySuggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              className="rounded-[1.4rem] border border-line/80 bg-paper-50/70 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink-900">{suggestion.suggestedMilestone}</p>
                  <p className="mt-2 text-sm leading-7 text-ink-700">{suggestion.note}</p>
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
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
};
