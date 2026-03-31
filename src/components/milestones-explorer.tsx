"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ConfidenceBadge, StatusBadge } from "@/components/badges";
import { ProgressMeter } from "@/components/progress-meter";
import { cn } from "@/lib/cn";
import { Milestone } from "@/types/agi";

type SortKey = "updated" | "progress" | "title";

const fieldClass =
  "h-11 rounded-2xl border border-line/80 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-600 focus:border-ink-700";

export const MilestonesExplorer = ({
  milestones,
  categories
}: {
  milestones: Milestone[];
  categories: string[];
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const filteredMilestones = useMemo(() => {
    return [...milestones]
      .filter((milestone) => {
        const query = search.trim().toLowerCase();
        if (!query) {
          return true;
        }

        return (
          milestone.title.toLowerCase().includes(query) ||
          milestone.description.toLowerCase().includes(query) ||
          milestone.subQuestions.some((subQuestion) =>
            subQuestion.title.toLowerCase().includes(query)
          )
        );
      })
      .filter((milestone) => (status === "all" ? true : milestone.status === status))
      .filter((milestone) =>
        confidence === "all" ? true : milestone.confidence === confidence
      )
      .filter((milestone) => (category === "all" ? true : milestone.category === category))
      .sort((left, right) => {
        if (sort === "progress") {
          return right.progressPercent - left.progressPercent;
        }

        if (sort === "title") {
          return left.title.localeCompare(right.title);
        }

        return right.updatedAt.localeCompare(left.updatedAt);
      });
  }, [milestones, search, status, confidence, category, sort]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-[1.75rem] border border-line/80 bg-white/75 p-5 shadow-panel lg:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={cn(fieldClass, "lg:col-span-2")}
          placeholder="Search milestones, descriptions, or sub-questions"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={fieldClass}
        >
          <option value="all">All statuses</option>
          <option value="unassessed">Unassessed</option>
          <option value="met">Met</option>
          <option value="in_progress">In progress</option>
          <option value="not_met">Not met</option>
        </select>
        <select
          value={confidence}
          onChange={(event) => setConfidence(event.target.value)}
          className={fieldClass}
        >
          <option value="all">All confidence</option>
          <option value="unassessed">Unassessed</option>
          <option value="high">High confidence</option>
          <option value="medium">Medium confidence</option>
          <option value="low">Low confidence</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={fieldClass}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-600">
            {filteredMilestones.length} milestones shown
          </p>
        </div>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className={fieldClass}
        >
          <option value="updated">Sort: Updated</option>
          <option value="progress">Sort: Progress</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredMilestones.map((milestone) => (
          <article
            key={milestone.id}
            className="rounded-[1.75rem] border border-line/80 bg-white/80 p-6 shadow-panel"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl space-y-3">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={milestone.status} />
                  <ConfidenceBadge confidence={milestone.confidence} />
                  <span className="inline-flex rounded-full border border-line bg-paper-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                    {milestone.category}
                  </span>
                </div>
                <h3 className="font-serif text-3xl tracking-tight text-ink-900">
                  {milestone.title}
                </h3>
                <p className="text-sm leading-7 text-ink-700">{milestone.description}</p>
                <div className="grid gap-3 text-sm text-ink-700 md:grid-cols-3">
                  <p>
                    Updated <span className="font-medium text-ink-900">{milestone.updatedAt}</span>
                  </p>
                  <p>
                    Met <span className="font-medium text-ink-900">
                      {
                        milestone.subQuestions.filter(
                          (subQuestion) => subQuestion.status === "met"
                        ).length
                      }
                    </span>{" "}
                    of {milestone.subQuestions.length}
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
                </div>
              </div>
              <div className="w-full max-w-sm space-y-4 rounded-[1.5rem] border border-line/80 bg-paper-50/70 p-5">
                <ProgressMeter value={milestone.progressPercent} />
                <Link
                  href={`/milestones/${milestone.id}`}
                  className="inline-flex rounded-full border border-ink-900 bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition hover:bg-ink-800"
                >
                  Open detail
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
