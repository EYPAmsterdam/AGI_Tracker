import { CommunitySnapshot } from "@/components/community-snapshot";
import { MethodologyNote } from "@/components/methodology-note";
import { MilestoneBoard } from "@/components/milestone-board";
import { RecentUpdatesPanel } from "@/components/recent-updates-panel";
import { SectionHeading } from "@/components/section-heading";
import { TrackerOverviewPanel } from "@/components/tracker-overview-panel";
import { latestUpdatedAt, milestones } from "@/data/milestones";
import { getOverviewStats, getRecentMilestoneUpdates } from "@/lib/data-queries";
import { formatLongDate } from "@/lib/format";

const stats = getOverviewStats();
const recentMilestones = getRecentMilestoneUpdates();

export default function HomePage() {
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
                AGI tracked as milestone claims.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-ink-700 md:text-lg md:leading-8">
                This tracker asks what needs to be true for AI to count as AGI, then breaks each milestone into lower-level conditions backed by sample evidence and confidence judgments.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <span className="rounded-full border border-ink-900 bg-ink-900 px-3 py-1.5 text-xs font-medium text-paper-50 md:px-4 md:py-2 md:text-sm">
                Last updated {formatLongDate(latestUpdatedAt)}
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-3 py-1.5 text-xs font-medium text-ink-700 md:px-4 md:py-2 md:text-sm">
                {milestones.length} top-level milestones
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-3 py-1.5 text-xs font-medium text-ink-700 md:px-4 md:py-2 md:text-sm">
                {stats.evidenceCount} sample evidence items
              </span>
            </div>
          </div>
          <TrackerOverviewPanel
            milestoneCount={milestones.length}
            stats={stats}
            latestUpdatedAt={latestUpdatedAt}
          />
        </div>
      </section>

      <MethodologyNote />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Milestone board"
          title="Implementation milestones"
          description="Each card represents a high-level AGI statement. Click to open the current rationale, sub-question status, and evidence-backed assessment."
        />
        <MilestoneBoard milestones={milestones} />
      </section>

      <section className="grid gap-4 md:gap-6 xl:grid-cols-[1fr_1fr]">
        <RecentUpdatesPanel milestones={recentMilestones} />
        <CommunitySnapshot />
      </section>
    </div>
  );
}
