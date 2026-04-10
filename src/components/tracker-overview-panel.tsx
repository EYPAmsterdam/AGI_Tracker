import { Status } from "@/types/agi";
import { DimensionProgressRadar } from "@/components/dimension-progress-radar";

interface TrackerOverviewPanelProps {
  milestoneCount: number;
  dimensionProgress: Array<{
    id: string;
    label: string;
    progressPercent: number;
    status: Status;
  }>;
  stats: {
    met: number;
    inProgress: number;
    notMet: number;
    unassessed: number;
    progressAverage: number;
    trackedMilestoneCount: number;
    evidenceCount: number;
  };
}

export const TrackerOverviewPanel = ({
  milestoneCount,
  dimensionProgress,
  stats
}: TrackerOverviewPanelProps) => {
  return (
    <div className="rounded-[1.75rem] border border-line/80 bg-white/82 p-4 shadow-panel md:rounded-[2rem] md:p-8">
      <div className="grid gap-5 md:gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 md:space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600 md:text-xs md:tracking-[0.24em]">
              Tracker overview
            </p>
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-ink-900 md:text-[2.4rem] md:leading-none">
              One clean snapshot of the dimension progression.
            </h2>
            <p className="max-w-2xl text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
              The board summarizes high-level dimension status, published evidence volume, and
              overall progress across the tracker.
            </p>
          </div>

          <DimensionProgressRadar dimensions={dimensionProgress} />
        </div>

        <div className="grid gap-3 md:gap-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Average progress
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">
                {stats.progressAverage}%
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Dimensions
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">
                {milestoneCount}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Milestones
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">
                {stats.trackedMilestoneCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
