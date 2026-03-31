"use client";

import { useMemo, useState } from "react";
import { ProofTypeBadge, StatusBadge } from "@/components/badges";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { EvidenceRecord, Milestone } from "@/types/agi";

const fieldClass =
  "h-11 rounded-2xl border border-line/80 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-600 focus:border-ink-700";

export const EvidenceExplorer = ({
  records,
  milestones
}: {
  records: EvidenceRecord[];
  milestones: Milestone[];
}) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [milestoneId, setMilestoneId] = useState("all");
  const [subQuestionId, setSubQuestionId] = useState("all");

  const selectedMilestone = milestones.find((milestone) => milestone.id === milestoneId);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.trim().toLowerCase();
      const matchesQuery =
        !query ||
        record.proofItem.title.toLowerCase().includes(query) ||
        record.proofItem.source.toLowerCase().includes(query) ||
        record.proofItem.shortExplanation.toLowerCase().includes(query) ||
        record.milestoneTitle.toLowerCase().includes(query) ||
        record.subQuestionTitle.toLowerCase().includes(query);

      const matchesType = type === "all" || record.proofItem.type === type;
      const matchesMilestone =
        milestoneId === "all" || record.milestoneId === milestoneId;
      const matchesSubQuestion =
        subQuestionId === "all" || record.subQuestionId === subQuestionId;

      return matchesQuery && matchesType && matchesMilestone && matchesSubQuestion;
    });
  }, [records, search, type, milestoneId, subQuestionId]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-[1.75rem] border border-line/80 bg-white/75 p-5 shadow-panel lg:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={cn(fieldClass, "lg:col-span-2")}
          placeholder="Search source, milestone, sub-question, or evidence text"
        />
        <select value={type} onChange={(event) => setType(event.target.value)} className={fieldClass}>
          <option value="all">All proof types</option>
          <option value="benchmark">Benchmark</option>
          <option value="leaderboard">Leaderboard</option>
          <option value="research_paper">Research paper</option>
          <option value="news">News</option>
          <option value="implementation">Implementation</option>
        </select>
        <select
          value={milestoneId}
          onChange={(event) => {
            setMilestoneId(event.target.value);
            setSubQuestionId("all");
          }}
          className={fieldClass}
        >
          <option value="all">All milestones</option>
          {milestones.map((milestone) => (
            <option key={milestone.id} value={milestone.id}>
              {milestone.title}
            </option>
          ))}
        </select>
        <div className="lg:col-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-600">
            {filteredRecords.length} evidence items shown
          </p>
        </div>
        <select
          value={subQuestionId}
          onChange={(event) => setSubQuestionId(event.target.value)}
          className={fieldClass}
        >
          <option value="all">All sub-questions</option>
          {(selectedMilestone?.subQuestions ?? milestones.flatMap((milestone) => milestone.subQuestions)).map(
            (subQuestion) => (
              <option key={subQuestion.id} value={subQuestion.id}>
                {subQuestion.title}
              </option>
            )
          )}
        </select>
      </div>

      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <article
              key={`${record.subQuestionId}-${record.proofItem.id}`}
              className="rounded-[1.5rem] border border-line/80 bg-white/80 p-5 shadow-panel"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <ProofTypeBadge type={record.proofItem.type} />
                    <StatusBadge status={record.subQuestionStatus} />
                  </div>
                  <h3 className="text-xl font-semibold text-ink-900">
                    {record.proofItem.title}
                  </h3>
                  <p className="text-sm text-ink-700">{record.proofItem.source}</p>
                  <p className="text-sm leading-7 text-ink-700">
                    {record.proofItem.shortExplanation}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-line/80 bg-paper-50/70 p-4 text-sm text-ink-700 lg:w-80">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-600">Linked to</p>
                  <p className="mt-2 font-medium text-ink-900">{record.milestoneTitle}</p>
                  <p className="mt-1 leading-6">{record.subQuestionTitle}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-600">
                    {formatLongDate(record.proofItem.date)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={record.proofItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-sky hover:text-ink-900"
                >
                  Open source
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-line/80 bg-white/75 p-5 shadow-panel">
            <p className="text-sm leading-7 text-ink-700">
              No published evidence entries match the current filters. Fill the workbook&apos;s
              Evidence Entries sheet to populate this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
