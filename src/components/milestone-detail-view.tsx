"use client";

import { useMemo, useState } from "react";
import { ConfidenceBadge, ProofTypeBadge, StatusBadge } from "@/components/badges";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { EVALUATION_MODE_LABELS } from "@/lib/milestone-utils";
import { ProgressMeter } from "@/components/progress-meter";
import { Milestone } from "@/types/agi";

export const MilestoneDetailView = ({ milestone }: { milestone: Milestone }) => {
  const [selectedSubQuestionId, setSelectedSubQuestionId] = useState(
    milestone.subQuestions[0]?.id
  );

  const selectedSubQuestion = useMemo(
    () =>
      milestone.subQuestions.find(
        (subQuestion) => subQuestion.id === selectedSubQuestionId
      ) ?? milestone.subQuestions[0],
    [milestone.subQuestions, selectedSubQuestionId]
  );

  if (!selectedSubQuestion) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-line/80 bg-white/80 p-6 shadow-panel lg:grid-cols-[1.5fr_0.9fr] lg:p-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={milestone.status} />
            <ConfidenceBadge confidence={milestone.confidence} />
            <span className="inline-flex rounded-full border border-line bg-paper-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
              {milestone.category}
            </span>
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl tracking-tight text-ink-900">
              {milestone.title}
            </h1>
            <p className="max-w-4xl text-base leading-8 text-ink-700">
              {milestone.description}
            </p>
          </div>
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-line/80 bg-paper-50/70 p-5">
          <ProgressMeter value={milestone.progressPercent} />
          <div className="grid gap-3 text-sm text-ink-700">
            <p>
              Updated{" "}
              <span className="font-medium text-ink-900">
                {formatLongDate(milestone.updatedAt)}
              </span>
            </p>
            <p>
              Evidence items{" "}
              <span className="font-medium text-ink-900">
                {milestone.subQuestions.reduce(
                  (sum, subQuestion) => sum + subQuestion.proofItems.length,
                  0
                )}
              </span>
            </p>
            <p>
              Sub-questions{" "}
              <span className="font-medium text-ink-900">
                {milestone.subQuestions.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {milestone.subQuestions.map((subQuestion) => {
            const active = subQuestion.id === selectedSubQuestion.id;

            return (
              <button
                key={subQuestion.id}
                type="button"
                onClick={() => setSelectedSubQuestionId(subQuestion.id)}
                className={cn(
                  "w-full rounded-[1.5rem] border p-5 text-left shadow-panel transition",
                  active
                    ? "border-ink-900/70 bg-white"
                    : "border-line/80 bg-white/75 hover:border-ink-700/35"
                )}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-ink-900">{subQuestion.title}</p>
                    <p className="text-sm leading-7 text-ink-700">{subQuestion.description}</p>
                    <p className="text-sm leading-7 text-ink-600">{subQuestion.rationale}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <StatusBadge status={subQuestion.status} />
                    <ConfidenceBadge confidence={subQuestion.confidence} />
                  </div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink-600">
                  Click to inspect evidence | {subQuestion.proofItems.length} items
                </p>
              </button>
            );
          })}
        </div>

        <aside className="rounded-[1.75rem] border border-line/80 bg-white/85 p-6 shadow-panel">
          <div className="border-b border-line/70 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
              Evidence panel
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink-900">
              {selectedSubQuestion.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-700">
              {selectedSubQuestion.description}
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-700">
              {selectedSubQuestion.rationale}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink-600">
              Best evidence forms:{" "}
              {selectedSubQuestion.evaluationModes
                .map((mode) => EVALUATION_MODE_LABELS[mode])
                .join(", ")}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {selectedSubQuestion.proofItems.map((proofItem) => (
              <article
                key={proofItem.id}
                className="rounded-[1.35rem] border border-line/80 bg-paper-50/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-ink-900">{proofItem.title}</p>
                    <p className="text-sm text-ink-700">{proofItem.source}</p>
                  </div>
                  <ProofTypeBadge type={proofItem.type} />
                </div>
                <p className="mt-3 text-sm leading-7 text-ink-700">
                  {proofItem.shortExplanation}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-ink-600">
                    {formatLongDate(proofItem.date)}
                  </p>
                  <a
                    href={proofItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-sky hover:text-ink-900"
                  >
                    Open source
                  </a>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
