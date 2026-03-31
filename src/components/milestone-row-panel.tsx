"use client";

import Link from "next/link";
import { ConfidenceBadge, ProofTypeBadge, StatusBadge } from "@/components/badges";
import { ProgressMeter } from "@/components/progress-meter";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { EVALUATION_MODE_LABELS } from "@/lib/milestone-utils";
import { Milestone, SubQuestion } from "@/types/agi";

interface MilestoneRowPanelProps {
  milestone: Milestone;
  selectedSubQuestion: SubQuestion;
  onSelectSubQuestion: (subQuestionId: string) => void;
}

const countMet = (milestone: Milestone) =>
  milestone.subQuestions.filter((subQuestion) => subQuestion.status === "met").length;

const countInProgress = (milestone: Milestone) =>
  milestone.subQuestions.filter((subQuestion) => subQuestion.status === "in_progress").length;

export const MilestoneRowPanel = ({
  milestone,
  selectedSubQuestion,
  onSelectSubQuestion
}: MilestoneRowPanelProps) => {
  return (
    <div className="rounded-[1.9rem] border border-line/80 bg-white/86 p-6 shadow-panel md:p-7">
      <div className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
        <div className="space-y-5">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/62 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-600">
                Deep dive
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-700">{milestone.description}</p>
            </div>

            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/62 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-600">
                Coverage summary
              </p>
              <div className="mt-4 space-y-3 text-sm text-ink-700">
                <p>
                  <span className="font-medium text-ink-900">{countMet(milestone)}</span> met
                </p>
                <p>
                  <span className="font-medium text-ink-900">
                    {countInProgress(milestone)}
                  </span>{" "}
                  in progress
                </p>
                <p>
                  Updated{" "}
                  <span className="font-medium text-ink-900">
                    {formatLongDate(milestone.updatedAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {milestone.subQuestions.map((subQuestion) => {
              const active = subQuestion.id === selectedSubQuestion.id;

              return (
                <button
                  key={subQuestion.id}
                  type="button"
                  onClick={() => onSelectSubQuestion(subQuestion.id)}
                  className={cn(
                    "w-full rounded-[1.4rem] border p-4 text-left transition duration-300",
                    active
                      ? "border-ink-900/60 bg-white shadow-panel"
                      : "border-line/80 bg-paper-50/50 hover:border-ink-700/35 hover:bg-white/85"
                  )}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-base font-semibold text-ink-900">{subQuestion.title}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <StatusBadge status={subQuestion.status} />
                      <ConfidenceBadge confidence={subQuestion.confidence} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-600">
                    {subQuestion.proofItems.length} evidence items
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[1.6rem] border border-line/80 bg-white/88 p-5 shadow-panel">
          <div className="space-y-4 border-b border-line/70 pb-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedSubQuestion.status} />
              <ConfidenceBadge confidence={selectedSubQuestion.confidence} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-600">
                Evidence focus
              </p>
              <h4 className="font-serif text-2xl tracking-tight text-ink-900">
                {selectedSubQuestion.title}
              </h4>
              <p className="text-sm leading-7 text-ink-700">
                {selectedSubQuestion.description}
              </p>
              <p className="text-sm leading-7 text-ink-700">
                {selectedSubQuestion.rationale}
              </p>
            </div>

            <ProgressMeter value={milestone.progressPercent} />

            <p className="text-xs uppercase tracking-[0.18em] text-ink-600">
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
                className="rounded-[1.25rem] border border-line/80 bg-paper-50/70 p-4"
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
                    className="text-sm font-medium text-sky transition hover:text-ink-900"
                  >
                    Open source
                  </a>
                </div>
              </article>
            ))}
          </div>

          <Link
            href={`/milestones/${milestone.id}`}
            className="mt-5 inline-flex rounded-full border border-ink-900 bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
          >
            Open full milestone detail
          </Link>
        </aside>
      </div>
    </div>
  );
};
