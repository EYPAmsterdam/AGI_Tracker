"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { communitySuggestions } from "@/data/community";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { CommunityFormPrefill } from "@/types/community";

const fieldClass =
  "w-full rounded-[1.35rem] border border-line/80 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-600 focus:border-ink-700";

const suggestionStyles = {
  queued: "border-amber/25 bg-amber/10 text-amber",
  reviewing: "border-sky/25 bg-sky/10 text-sky",
  merged: "border-sage/25 bg-sage/10 text-sage"
};

type CommunityDimensionOption = {
  id: string;
  title: string;
  questions: {
    id: string;
    title: string;
  }[];
};

const resolvePrefill = (
  dimensions: CommunityDimensionOption[],
  searchParams: { get: (key: string) => string | null }
): CommunityFormPrefill => {
  const dimensionId = searchParams.get("dimensionId") ?? "";
  const questionId = searchParams.get("questionId") ?? "";
  const selectedDimension = dimensions.find((dimension) => dimension.id === dimensionId);
  const selectedQuestion = selectedDimension?.questions.find(
    (question) => question.id === questionId
  );

  return {
    suggestedDimension: selectedDimension?.title ?? "",
    suggestedQuestion: selectedQuestion?.title ?? "",
    suggestedEvidenceLink: ""
  };
};

export const CommunityForm = ({
  initialPrefill
}: {
  initialPrefill: CommunityFormPrefill;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [suggestedDimension, setSuggestedDimension] = useState(initialPrefill.suggestedDimension);
  const [suggestedQuestion, setSuggestedQuestion] = useState(initialPrefill.suggestedQuestion);
  const [suggestedEvidenceLink, setSuggestedEvidenceLink] = useState(
    initialPrefill.suggestedEvidenceLink
  );
  const [comment, setComment] = useState("");

  useEffect(() => {
    setSubmitted(false);
    setSuggestedDimension(initialPrefill.suggestedDimension);
    setSuggestedQuestion(initialPrefill.suggestedQuestion);
    setSuggestedEvidenceLink(initialPrefill.suggestedEvidenceLink);
    setComment("");
  }, [
    initialPrefill.suggestedDimension,
    initialPrefill.suggestedEvidenceLink,
    initialPrefill.suggestedQuestion
  ]);

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
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Suggestion form</h2>

        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Dimension
            </label>
            <input
              value={suggestedDimension}
              onChange={(event) => setSuggestedDimension(event.target.value)}
              className={fieldClass}
              placeholder="Example: AI can independently run a small procurement process"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Question
            </label>
            <input
              value={suggestedQuestion}
              onChange={(event) => setSuggestedQuestion(event.target.value)}
              className={fieldClass}
              placeholder="Example: Can it collect bids, compare them, and document tradeoffs?"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Evidence link
            </label>
            <input
              value={suggestedEvidenceLink}
              onChange={(event) => setSuggestedEvidenceLink(event.target.value)}
              className={fieldClass}
              placeholder="https://example.org/report-or-paper"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-900">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className={cn(fieldClass, "min-h-[160px] resize-y")}
              placeholder="Add rationale for why this dimension, question, or evidence should be reviewed."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex rounded-full border border-ink-900 bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
          >
            Submit suggestion
          </button>
          {submitted ? (
            <p className="text-sm text-sage">
              Suggestion captured in the UI preview. No backend is connected in this MVP.
            </p>
          ) : (
            <p className="text-sm text-ink-700">
              Expected next step in a real product: route to reviewer triage and evidence
              validation.
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
                  <p className="font-medium text-ink-900">{suggestion.suggestedDimension}</p>
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
                {suggestion.author} | {formatLongDate(suggestion.createdAt)}
              </p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
};

export const CommunityFormWithSearch = ({
  dimensions
}: {
  dimensions: CommunityDimensionOption[];
}) => {
  const searchParams = useSearchParams();
  const initialPrefill = useMemo(
    () => resolvePrefill(dimensions, searchParams),
    [dimensions, searchParams]
  );

  return <CommunityForm initialPrefill={initialPrefill} />;
};

export const CommunityFormFallback = () => (
  <CommunityForm
    initialPrefill={{
      suggestedDimension: "",
      suggestedQuestion: "",
      suggestedEvidenceLink: ""
    }}
  />
);
