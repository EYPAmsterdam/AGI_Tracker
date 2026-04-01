"use client";

import Link from "next/link";
import { ConfidenceBadge, ProofTypeBadge, StatusBadge } from "@/components/badges";
import { FeedbackLink } from "@/components/feedback-link";
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
    <div className="rounded-[1.55rem] border border-line/80 bg-white/86 p-4 shadow-panel md:rounded-[1.9rem] md:p-7">
      <div className="grid gap-4 md:gap-6 xl:grid-cols-[1.14fr_0.86fr]">
        <div className="space-y-4 md:space-y-5">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[1.25rem] border border-line/80 bg-paper-50/62 p-4 md:rounded-[1.5rem] md:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.22em]">
                Deep dive
              </p>
              <p className="mt-2 text-[13px] leading-6 text-ink-700 md:mt-3 md:text-sm md:leading-7">
                {milestone.description}
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-line/80 bg-paper-50/62 p-4 md:rounded-[1.5rem] md:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.22em]">
                Coverage summary
              </p>
              <div className="mt-3 space-y-2.5 text-[13px] text-ink-700 md:mt-4 md:space-y-3 md:text-sm">
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

          <div className="space-y-2.5 md:space-y-3">
            {milestone.subQuestions.map((subQuestion) => {
              const active = subQuestion.id === selectedSubQuestion.id;
              const panelLabel =
                subQuestion.proofItems.length > 0
                  ? `${subQuestion.proofItems.length} evidence items`
                  : subQuestion.sourceRecommendations.length > 0
                    ? `${subQuestion.sourceRecommendations.length} recommended sources`
                    : "No evidence yet";

              return (
                <button
                  key={subQuestion.id}
                  type="button"
                  onClick={() => onSelectSubQuestion(subQuestion.id)}
                  className={cn(
                    "w-full rounded-[1.15rem] border p-3.5 text-left transition duration-300 md:rounded-[1.4rem] md:p-4",
                    active
                      ? "border-ink-900/60 bg-white shadow-panel"
                      : "border-line/80 bg-paper-50/50 hover:border-ink-700/35 hover:bg-white/85"
                  )}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900 md:text-base">
                        {subQuestion.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <StatusBadge status={subQuestion.status} />
                      <ConfidenceBadge confidence={subQuestion.confidence} />
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:mt-3 md:text-xs md:tracking-[0.18em]">
                    {panelLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[1.35rem] border border-line/80 bg-white/88 p-4 shadow-panel md:rounded-[1.6rem] md:p-5">
          <div className="space-y-3.5 border-b border-line/70 pb-4 md:space-y-4 md:pb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <StatusBadge status={selectedSubQuestion.status} />
                <ConfidenceBadge confidence={selectedSubQuestion.confidence} />
              </div>
              <FeedbackLink
                dimensionId={milestone.id}
                questionId={selectedSubQuestion.id}
                source="dimension-board"
                className="shrink-0"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.22em]">
                Question focus
              </p>
              <h4 className="font-serif text-xl tracking-tight text-ink-900 md:text-2xl">
                {selectedSubQuestion.title}
              </h4>
              <p className="text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
                {selectedSubQuestion.description}
              </p>
              {selectedSubQuestion.rationale ? (
                <p className="text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
                  {selectedSubQuestion.rationale}
                </p>
              ) : null}
            </div>

            <ProgressMeter value={milestone.progressPercent} />

            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-600 md:text-xs md:tracking-[0.18em]">
              Best evidence forms:{" "}
              {selectedSubQuestion.evaluationModes.length > 0
                ? selectedSubQuestion.evaluationModes
                    .map((mode) => EVALUATION_MODE_LABELS[mode])
                    .join(", ")
                : "Not set yet"}
            </p>
          </div>

          <div className="mt-4 space-y-3.5 md:mt-5 md:space-y-4">
            {selectedSubQuestion.proofItems.length > 0 ? (
              selectedSubQuestion.proofItems.map((proofItem) => (
                <article
                  key={proofItem.id}
                  className="rounded-[1.1rem] border border-line/80 bg-paper-50/70 p-3.5 md:rounded-[1.25rem] md:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-ink-900 md:text-base">
                        {proofItem.title}
                      </p>
                      <p className="text-[13px] text-ink-700 md:text-sm">{proofItem.source}</p>
                    </div>
                    <ProofTypeBadge type={proofItem.type} />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-6 text-ink-700 md:mt-3 md:text-sm md:leading-7">
                    {proofItem.shortExplanation}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-ink-600 md:text-xs md:tracking-[0.16em]">
                      {formatLongDate(proofItem.date)}
                    </p>
                    <a
                      href={proofItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-sky transition hover:text-ink-900 md:text-sm"
                    >
                      Open source
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.1rem] border border-dashed border-line/80 bg-paper-50/60 p-3.5 md:rounded-[1.25rem] md:p-4">
                <p className="text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
                  No evidence entries are published yet for this question.
                </p>
              </div>
            )}
          </div>

          {selectedSubQuestion.sourceRecommendations.length > 0 ? (
            <div className="mt-4 space-y-3.5 border-t border-line/70 pt-4 md:mt-5 md:space-y-4 md:pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.22em]">
                Recommended sources
              </p>
              {selectedSubQuestion.sourceRecommendations.map((recommendation) => (
                <article
                  key={recommendation.id}
                  className="rounded-[1.1rem] border border-line/80 bg-paper-50/70 p-3.5 md:rounded-[1.25rem] md:p-4"
                >
                  <p className="text-sm font-medium text-ink-900 md:text-base">
                    {recommendation.title}
                  </p>
                  {recommendation.whyUseIt ? (
                    <p className="mt-2.5 text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
                      {recommendation.whyUseIt}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-ink-600 md:text-xs md:tracking-[0.16em]">
                      {recommendation.trackerStatus || "Status not set"}
                    </p>
                    {recommendation.url ? (
                      <a
                        href={recommendation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-sky transition hover:text-ink-900 md:text-sm"
                      >
                        Open benchmark
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <Link
            href={`/milestones/${milestone.id}`}
            className="mt-4 inline-flex rounded-full border border-ink-900 bg-ink-900 px-3.5 py-2 text-xs font-medium text-paper-50 transition hover:bg-ink-800 md:mt-5 md:px-4 md:text-sm"
          >
            Open full dimension detail
          </Link>
        </aside>
      </div>
    </div>
  );
};
