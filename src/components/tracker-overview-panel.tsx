import { formatLongDate } from "@/lib/format";

interface TrackerOverviewPanelProps {
  milestoneCount: number;
  latestUpdatedAt: string;
  stats: {
    met: number;
    inProgress: number;
    notMet: number;
    progressAverage: number;
    evidenceCount: number;
  };
}

const statusStyles = {
  met: "bg-sage",
  inProgress: "bg-amber",
  notMet: "bg-rust"
} as const;

export const TrackerOverviewPanel = ({
  milestoneCount,
  latestUpdatedAt,
  stats
}: TrackerOverviewPanelProps) => {
  const total = Math.max(1, stats.met + stats.inProgress + stats.notMet);
  const metWidth = (stats.met / total) * 100;
  const inProgressWidth = (stats.inProgress / total) * 100;
  const notMetWidth = (stats.notMet / total) * 100;

  return (
    <div className="rounded-[2rem] border border-line/80 bg-white/82 p-6 shadow-panel md:p-8">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
              Tracker overview
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-ink-900 md:text-[2.4rem]">
              One clean snapshot of the milestone progression.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-ink-700">
              The board summarizes high-level milestone status, evidence volume, and
              overall progress.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-line/80 bg-paper-50/72 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-600">
                Status distribution
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-600">
                {milestoneCount} milestones
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-paper-100">
              <div className="flex h-full w-full">
                <div
                  className={statusStyles.met}
                  style={{ width: `${metWidth}%` }}
                />
                <div
                  className={statusStyles.inProgress}
                  style={{ width: `${inProgressWidth}%` }}
                />
                <div
                  className={statusStyles.notMet}
                  style={{ width: `${notMetWidth}%` }}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-line/70 bg-white/78 px-4 py-3">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-600">
                  <span className="h-2 w-2 rounded-full bg-sage" />
                  Met
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{stats.met}</p>
              </div>
              <div className="rounded-[1.2rem] border border-line/70 bg-white/78 px-4 py-3">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-600">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  In progress
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">
                  {stats.inProgress}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-line/70 bg-white/78 px-4 py-3">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-600">
                  <span className="h-2 w-2 rounded-full bg-rust" />
                  Not met
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{stats.notMet}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.45rem] border border-line/80 bg-paper-50/68 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">
                Milestones tracked
              </p>
              <p className="mt-3 text-4xl font-semibold text-ink-900">{milestoneCount}</p>
            </div>
            <div className="rounded-[1.45rem] border border-line/80 bg-paper-50/68 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">
                Evidence items
              </p>
              <p className="mt-3 text-4xl font-semibold text-ink-900">
                {stats.evidenceCount}
              </p>
            </div>
            <div className="rounded-[1.45rem] border border-line/80 bg-paper-50/68 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">
                Average progress
              </p>
              <p className="mt-3 text-4xl font-semibold text-ink-900">
                {stats.progressAverage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
