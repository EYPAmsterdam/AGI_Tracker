"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ConfidenceBadge, StatusBadge } from "@/components/badges";
import { ProgressMeter } from "@/components/progress-meter";
import { cn } from "@/lib/cn";
import { Milestone } from "@/types/agi";

const countMet = (milestone: Milestone) =>
  milestone.subQuestions.filter((subQuestion) => subQuestion.status === "met").length;

export const MilestoneBoard = ({ milestones }: { milestones: Milestone[] }) => {
  const [selectedId, setSelectedId] = useState(milestones[0]?.id);

  const selectedMilestone = useMemo(
    () => milestones.find((milestone) => milestone.id === selectedId) ?? milestones[0],
    [milestones, selectedId]
  );

  if (!selectedMilestone) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {milestones.map((milestone) => {
          const isSelected = milestone.id === selectedMilestone.id;
          const metCount = countMet(milestone);

          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => setSelectedId(milestone.id)}
              className={cn(
                "group relative overflow-visible rounded-[1.75rem] border bg-white/75 p-5 text-left shadow-panel transition duration-200",
                isSelected
                  ? "border-ink-900/70 bg-white ring-1 ring-ink-900/10"
                  : "border-line/80 hover:-translate-y-0.5 hover:border-ink-700/40"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="max-w-[16rem] font-serif text-xl leading-tight text-ink-900">
                  {milestone.title}
                </p>
                <span className="rounded-full border border-line bg-paper-50 px-2.5 py-1 text-xs uppercase tracking-[0.18em] text-ink-700">
                  {milestone.category}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={milestone.status} />
                <ConfidenceBadge confidence={milestone.confidence} />
              </div>
              <div className="mt-5">
                <ProgressMeter value={milestone.progressPercent} compact />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-ink-700">
                <span>
                  {metCount}/{milestone.subQuestions.length} sub-questions met
                </span>
                <span className="font-medium text-ink-900">Open detail</span>
              </div>
              <div className="pointer-events-none absolute right-4 top-4 hidden w-72 rounded-2xl border border-ink-900/15 bg-ink-900 p-4 text-sm leading-6 text-paper-50 shadow-panel group-hover:block xl:block xl:opacity-0 xl:transition xl:duration-200 xl:group-hover:opacity-100">
                <p className="text-[11px] uppercase tracking-[0.2em] text-paper-100/70">
                  Preview
                </p>
                <p className="mt-2 text-paper-50/90">{milestone.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-line/80 bg-white/85 p-6 shadow-panel md:p-8">
        <div className="flex flex-col gap-5 border-b border-line/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
              Selected milestone
            </p>
            <div className="space-y-2">
              <h3 className="font-serif text-3xl tracking-tight text-ink-900">
                {selectedMilestone.title}
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-ink-700">
                {selectedMilestone.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={selectedMilestone.status} />
            <ConfidenceBadge confidence={selectedMilestone.confidence} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="grid gap-3">
            {selectedMilestone.subQuestions.map((subQuestion) => (
              <div
                key={subQuestion.id}
                className="rounded-[1.25rem] border border-line/80 bg-paper-50/65 p-4 transition hover:border-ink-700/35"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-ink-900">{subQuestion.title}</p>
                    <p className="text-sm leading-6 text-ink-700">{subQuestion.rationale}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <StatusBadge status={subQuestion.status} />
                    <ConfidenceBadge confidence={subQuestion.confidence} />
                  </div>
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-600">
                  {subQuestion.proofItems.length} evidence items
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/70 p-5">
            <div className="space-y-4">
              <ProgressMeter value={selectedMilestone.progressPercent} />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-line/80 bg-white/75 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Updated</p>
                  <p className="mt-2 text-sm font-medium text-ink-900">
                    {selectedMilestone.updatedAt}
                  </p>
                </div>
                <div className="rounded-2xl border border-line/80 bg-white/75 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-600">
                    Sub-question coverage
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink-900">
                    {countMet(selectedMilestone)} met,{" "}
                    {
                      selectedMilestone.subQuestions.filter(
                        (subQuestion) => subQuestion.status === "in_progress"
                      ).length
                    }{" "}
                    in progress
                  </p>
                </div>
              </div>
              <Link
                href={`/milestones/${selectedMilestone.id}`}
                className="inline-flex rounded-full border border-ink-900 bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
              >
                Open full milestone detail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
