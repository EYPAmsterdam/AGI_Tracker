"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
                    <div className="grid min-h-[5.75rem] grid-cols-[minmax(7.5rem,0.38fr)_1px_minmax(0,0.62fr)] items-stretch gap-3 md:min-h-[6rem] md:gap-4">
                      <div className="flex min-w-0 items-start">
                        <p className="max-w-full break-words font-serif text-[1.22rem] leading-tight tracking-tight text-ink-900 md:text-[1.20rem] xl:text-[1.22rem]">
                          {milestone.category}
                        </p>
                      </div>
                      <span aria-hidden className="flex items-center justify-center">
                        <span className="h-[72%] w-px rounded-full bg-line/60" />
                      </span>
                      <div className="flex min-w-0 items-start">
                        <p className="text-[14px] leading-6 text-ink-800 md:text-[15px] md:leading-6">
                          {milestone.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-0 md:mt-0">
                      <ProgressMeter value={milestone.progressPercent} compact />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-700 md:mt-4 md:text-sm">
                      <span>
                        {metCount}/{milestone.subQuestions.length} questions met
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
