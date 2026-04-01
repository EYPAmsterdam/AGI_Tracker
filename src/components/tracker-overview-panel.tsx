interface TrackerOverviewPanelProps {
  milestoneCount: number;
  stats: {
    met: number;
    inProgress: number;
    notMet: number;
    unassessed: number;
    progressAverage: number;
    evidenceCount: number;
  };
}

const statusStyles = {
  met: "bg-sage",
  inProgress: "bg-amber",
  notMet: "bg-rust",
  unassessed: "bg-paper-100"
} as const;

export const TrackerOverviewPanel = ({
  milestoneCount,
  stats
}: TrackerOverviewPanelProps) => {
  const total = Math.max(
    1,
    stats.met + stats.inProgress + stats.notMet + stats.unassessed
  );
  const metWidth = (stats.met / total) * 100;
  const inProgressWidth = (stats.inProgress / total) * 100;
  const notMetWidth = (stats.notMet / total) * 100;
  const unassessedWidth = (stats.unassessed / total) * 100;

  return (
    <div className="rounded-[1.75rem] border border-line/80 bg-white/82 p-4 shadow-panel md:rounded-[2rem] md:p-8">
      <div className="grid gap-5 md:gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 md:space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-600 md:text-xs md:tracking-[0.24em]">
              Tracker overview
            </p>
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-ink-900 md:text-[2.4rem] md:leading-none">
              One clean snapshot of the milestone progression.
            </h2>
            <p className="max-w-2xl text-[13px] leading-6 text-ink-700 md:text-sm md:leading-7">
              The board summarizes high-level milestone status, published evidence volume, and
              overall progress across the tracker.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-line/80 bg-paper-50/72 p-4 md:rounded-[1.6rem] md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 md:text-xs md:tracking-[0.22em]">
                Status distribution
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-600 md:text-xs md:tracking-[0.18em]">
                {milestoneCount} milestones
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-paper-100 md:mt-4 md:h-3">
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
                <div
                  className={statusStyles.unassessed}
                  style={{ width: `${unassessedWidth}%` }}
                />
              </div>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4 md:mt-4 md:gap-3">
              <div className="rounded-[1rem] border border-line/70 bg-white/78 px-3 py-2.5 md:rounded-[1.2rem] md:px-4 md:py-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:gap-2 md:text-xs md:tracking-[0.18em]">
                  <span className="h-2 w-2 rounded-full bg-sage" />
                  Met
                </p>
                <p className="mt-1.5 text-xl font-semibold text-ink-900 md:mt-2 md:text-2xl">{stats.met}</p>
              </div>
              <div className="rounded-[1rem] border border-line/70 bg-white/78 px-3 py-2.5 md:rounded-[1.2rem] md:px-4 md:py-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:gap-2 md:text-xs md:tracking-[0.18em]">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  In progress
                </p>
                <p className="mt-1.5 text-xl font-semibold text-ink-900 md:mt-2 md:text-2xl">
                  {stats.inProgress}
                </p>
              </div>
              <div className="rounded-[1rem] border border-line/70 bg-white/78 px-3 py-2.5 md:rounded-[1.2rem] md:px-4 md:py-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:gap-2 md:text-xs md:tracking-[0.18em]">
                  <span className="h-2 w-2 rounded-full bg-rust" />
                  Not met
                </p>
                <p className="mt-1.5 text-xl font-semibold text-ink-900 md:mt-2 md:text-2xl">{stats.notMet}</p>
              </div>
              <div className="rounded-[1rem] border border-line/70 bg-white/78 px-3 py-2.5 md:rounded-[1.2rem] md:px-4 md:py-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-600 md:gap-2 md:text-xs md:tracking-[0.18em]">
                  <span className="h-2 w-2 rounded-full bg-paper-100 ring-1 ring-line" />
                  Unassessed
                </p>
                <p className="mt-1.5 text-xl font-semibold text-ink-900 md:mt-2 md:text-2xl">
                  {stats.unassessed}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:gap-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Milestones tracked
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">{milestoneCount}</p>
            </div>
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Evidence items
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">
                {stats.evidenceCount}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-line/80 bg-paper-50/68 p-3.5 md:rounded-[1.45rem] md:p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 md:text-xs md:tracking-[0.2em]">
                Average progress
              </p>
              <p className="mt-2 text-3xl font-semibold text-ink-900 md:mt-3 md:text-4xl">
                {stats.progressAverage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
