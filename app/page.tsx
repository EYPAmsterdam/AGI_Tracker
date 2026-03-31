import { MethodologyNote } from "@/components/methodology-note";
import { MilestoneBoard } from "@/components/milestone-board";
import { RecentUpdatesPanel } from "@/components/recent-updates-panel";
import { SectionHeading } from "@/components/section-heading";
import { TrackerOverviewPanel } from "@/components/tracker-overview-panel";
import { getLatestUpdatedAt, getMilestones } from "@/data/milestones";
import { getOverviewStats, getRecentMilestoneUpdates } from "@/lib/data-queries";
import { formatLongDate } from "@/lib/format";

export default function HomePage() {
  const latestUpdatedAt = getLatestUpdatedAt();
  const milestones = getMilestones();
  const stats = getOverviewStats();
  const recentMilestones = getRecentMilestoneUpdates();

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="rounded-[2rem] border border-line/80 bg-white/70 p-5 shadow-panel md:rounded-[2.25rem] md:p-10">
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink-600">
                Overview
              </p>
              <h1 className="max-w-4xl font-serif text-4xl leading-[0.98] tracking-tight text-ink-900 md:text-6xl md:leading-none">
                AGI tracked through capability dimensions.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-ink-700 md:text-lg md:leading-8">
                This tracker turns your workbook into a published registry of capability dimensions, capability-level assessment slots, recommended benchmark sources, and curated evidence entries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <span className="rounded-full border border-ink-900 bg-ink-900 px-3 py-1.5 text-xs font-medium text-paper-50 md:px-4 md:py-2 md:text-sm">
                Last updated {formatLongDate(latestUpdatedAt)}
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-3 py-1.5 text-xs font-medium text-ink-700 md:px-4 md:py-2 md:text-sm">
                {milestones.length} capability dimensions
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-3 py-1.5 text-xs font-medium text-ink-700 md:px-4 md:py-2 md:text-sm">
                {stats.evidenceCount} published evidence items
              </span>
            </div>
          </div>
          <TrackerOverviewPanel
            milestoneCount={milestones.length}
            stats={stats}
          />
        </div>
      </section>

      <MethodologyNote />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Tracker board"
          title="Capability dimensions"
          description="Each card represents a workbook-backed capability dimension. Open a card to inspect the mapped capabilities, current assessment state, and recommended sources."
        />
        <MilestoneBoard milestones={milestones} />
      </section>

      <section>
        <RecentUpdatesPanel milestones={recentMilestones} />
      </section>
    </div>
  );
}
