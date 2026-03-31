"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ConfidenceBadge, StatusBadge } from "@/components/badges";
import { MilestoneRowPanel } from "@/components/milestone-row-panel";
import { ProgressMeter } from "@/components/progress-meter";
import { cn } from "@/lib/cn";
import { Milestone } from "@/types/agi";

const BOARD_EXPAND_DURATION_MS = 520;
const BOARD_EXPAND_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const BOARD_FLIP_DURATION_MS = 460;
const BOARD_FLIP_EASING = "cubic-bezier(0.2, 0.95, 0.28, 1)";
const BOARD_EXPAND_STYLE = {
  transitionDuration: `${BOARD_EXPAND_DURATION_MS}ms`,
  transitionTimingFunction: BOARD_EXPAND_EASING
} as const;

const countMet = (milestone: Milestone) =>
  milestone.subQuestions.filter((subQuestion) => subQuestion.status === "met").length;

const getColumnCount = (width: number) => {
  if (width >= 1024) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
};

const chunkMilestones = (milestones: Milestone[], columns: number) => {
  const rows: Milestone[][] = [];

  for (let index = 0; index < milestones.length; index += columns) {
    rows.push(milestones.slice(index, index + columns));
  }

  return rows;
};

export const MilestoneBoard = ({ milestones }: { milestones: Milestone[] }) => {
  const [openMilestoneId, setOpenMilestoneId] = useState<string | null>(null);
  const [selectedSubQuestions, setSelectedSubQuestions] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        milestones
          .filter((milestone) => milestone.subQuestions[0])
          .map((milestone) => [milestone.id, milestone.subQuestions[0].id])
      )
  );
  const [columns, setColumns] = useState(1);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousRowPositionsRef = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const boardElement = boardRef.current;

    if (!boardElement) {
      return;
    }

    const updateColumns = (width: number) => {
      setColumns((current) => {
        const next = getColumnCount(width);
        return current === next ? current : next;
      });
    };

    updateColumns(boardElement.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateColumns(entry.contentRect.width);
    });

    observer.observe(boardElement);

    return () => observer.disconnect();
  }, []);

  const rows = chunkMilestones(milestones, columns);
  const activeMilestone =
    milestones.find((milestone) => milestone.id === openMilestoneId) ?? null;
  const activeMilestoneIndex = activeMilestone
    ? milestones.findIndex((milestone) => milestone.id === activeMilestone.id)
    : -1;
  const activeRowIndex =
    activeMilestoneIndex === -1 ? -1 : Math.floor(activeMilestoneIndex / columns);
  const selectedSubQuestion =
    activeMilestone?.subQuestions.find(
      (subQuestion) => subQuestion.id === selectedSubQuestions[activeMilestone.id]
    ) ?? activeMilestone?.subQuestions[0];

  const captureRowPositions = () => {
    previousRowPositionsRef.current = new Map(
      rows
        .map((row) => {
          const key = row.map((milestone) => milestone.id).join("|");
          const element = rowRefs.current[key];

          return element ? [key, element.getBoundingClientRect()] : null;
        })
        .filter((entry): entry is [string, DOMRect] => entry !== null)
    );
  };

  useLayoutEffect(() => {
    const previousRowPositions = previousRowPositionsRef.current;

    if (previousRowPositions.size === 0) {
      return;
    }

    rows.forEach((row) => {
      const key = row.map((milestone) => milestone.id).join("|");
      const element = rowRefs.current[key];
      const previousPosition = previousRowPositions.get(key);

      if (!element || !previousPosition) {
        return;
      }

      const currentPosition = element.getBoundingClientRect();
      const deltaY = previousPosition.top - currentPosition.top;

      if (Math.abs(deltaY) < 1) {
        return;
      }

      element.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0px)" }
        ],
        {
          duration: BOARD_FLIP_DURATION_MS,
          easing: BOARD_FLIP_EASING,
          fill: "both"
        }
      );
    });

    previousRowPositionsRef.current = new Map();
  }, [rows, openMilestoneId, selectedSubQuestions]);

  const handleMilestoneToggle = (milestone: Milestone) => {
    captureRowPositions();
    setOpenMilestoneId((current) => (current === milestone.id ? null : milestone.id));
    setSelectedSubQuestions((current) =>
      current[milestone.id]
        ? current
        : {
            ...current,
            [milestone.id]: milestone.subQuestions[0]?.id ?? ""
          }
    );
  };

  return (
    <div ref={boardRef} className="space-y-3 md:space-y-4">
      {rows.map((row, rowIndex) => {
        const rowKey = row.map((milestone) => milestone.id).join("|");
        const rowIsActive = rowIndex === activeRowIndex;

        return (
          <div
            key={rowKey}
            ref={(element) => {
              rowRefs.current[rowKey] = element;
            }}
            className="space-y-3 md:space-y-4"
          >
            <div
              className="grid gap-3 md:gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {row.map((milestone) => {
                const isOpen = milestone.id === openMilestoneId;
                const metCount = countMet(milestone);

                return (
                  <button
                    key={milestone.id}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => handleMilestoneToggle(milestone)}
                    className={cn(
                      "w-full rounded-[1.4rem] border bg-white/75 p-4 text-left shadow-panel transition duration-200 md:rounded-[1.75rem] md:p-5",
                      isOpen
                        ? "border-ink-900/70 bg-white ring-1 ring-ink-900/10"
                        : "border-line/80 hover:-translate-y-0.5 hover:border-ink-700/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="max-w-[12rem] font-serif text-lg leading-tight text-ink-900 md:max-w-[16rem] md:text-xl">
                        {milestone.title}
                      </p>
                      <span className="rounded-full border border-line bg-paper-50 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink-700 md:px-2.5 md:text-xs md:tracking-[0.18em]">
                        {milestone.category}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
                      <StatusBadge status={milestone.status} />
                      <ConfidenceBadge confidence={milestone.confidence} />
                    </div>

                    <div className="mt-4 md:mt-5">
                      <ProgressMeter value={milestone.progressPercent} compact />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-700 md:mt-4 md:text-sm">
                      <span>
                        {metCount}/{milestone.subQuestions.length} sub-questions met
                      </span>
                      <span className="font-medium text-ink-900">
                        {isOpen ? "Close detail" : "Open detail"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows,opacity,padding] px-1",
                rowIsActive && activeMilestone && selectedSubQuestion
                  ? "grid-rows-[1fr] opacity-100 pt-1.5 md:pt-2"
                  : "grid-rows-[0fr] opacity-0"
              )}
              style={BOARD_EXPAND_STYLE}
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden transition-[opacity,transform]",
                  rowIsActive && activeMilestone && selectedSubQuestion
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                )}
                style={BOARD_EXPAND_STYLE}
              >
                {rowIsActive && activeMilestone && selectedSubQuestion ? (
                  <MilestoneRowPanel
                    milestone={activeMilestone}
                    selectedSubQuestion={selectedSubQuestion}
                    onSelectSubQuestion={(subQuestionId) => {
                      captureRowPositions();
                      setSelectedSubQuestions((current) => ({
                        ...current,
                        [activeMilestone.id]: subQuestionId
                      }));
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
