import { IndexGauge } from "@/components/index-gauge";

interface TrackerOverviewPanelProps {
  milestoneCount: number;
  stats: {
    met: number;
    inProgress: number;
    notMet: number;
    unassessed: number;
    progressAverage: number;
    trackedMilestoneCount: number;
    evidenceCount: number;
    subQuestionsMet: number;
    subQuestionsInProgress: number;
    subQuestionsNotMet: number;
  };
}

const toneColor = (value: number) => {
  if (value >= 75) {
    return "rgb(var(--sage))";
  }
  if (value >= 35) {
    return "rgb(var(--amber))";
  }
  return "rgb(var(--rust))";
};

export const TrackerOverviewPanel = ({
  milestoneCount,
  stats
}: TrackerOverviewPanelProps) => {
  const dotColor = toneColor(stats.progressAverage);

  const breakdown = [
    { label: "Questions met", value: stats.subQuestionsMet },
    { label: "In progress", value: stats.subQuestionsInProgress },
    { label: "Not met", value: stats.subQuestionsNotMet }
  ];

  return (
    <div className="rounded-[1.75rem] border border-line/80 bg-white/82 p-4 shadow-panel md:rounded-[2rem] md:p-8">
      <div className="grid items-center gap-6 md:gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 md:space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600 md:text-xs md:tracking-[0.24em]">
            Composite progress
          </p>

          <div className="flex items-end gap-3">
            <span className="font-serif text-7xl leading-[0.85] tracking-tight text-ink-900 md:text-8xl">
              {stats.progressAverage}
            </span>
            <span
              className="mb-2 inline-block h-3 w-3 rounded-full md:mb-3 md:h-3.5 md:w-3.5"
              style={{ backgroundColor: dotColor }}
            />
            <span className="mb-2 text-lg font-medium text-ink-600 md:mb-3 md:text-xl">
              / 100
            </span>
          </div>

          <p className="max-w-md text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
            The average progress across all {milestoneCount} tracked dimensions, calibrated
            against human-expert performance.
          </p>

          <div className="flex flex-wrap gap-x-7 gap-y-3 border-t border-line/70 pt-4 md:pt-5">
            {breakdown.map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-semibold text-ink-900 md:text-3xl">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:text-xs">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600 md:text-xs md:tracking-[0.24em]">
            Index dial
          </p>
          <div className="rounded-[1.35rem] border border-line/80 bg-paper-50/72 p-4 md:rounded-[1.6rem] md:p-6">
            <div className="mx-auto h-[12.5rem] w-full max-w-[22rem] md:h-[14rem]">
              <IndexGauge value={stats.progressAverage} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-line/70 pt-4 text-[11px] italic leading-5 text-ink-600 md:mt-6 md:pt-5 md:text-xs md:leading-6">
        Data collection is ongoing — scores are provisional and not yet finalized.
      </p>
    </div>
  );
};
