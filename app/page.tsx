import { CommunitySnapshot } from "@/components/community-snapshot";
import { MethodologyNote } from "@/components/methodology-note";
import { MilestoneBoard } from "@/components/milestone-board";
import { RecentUpdatesPanel } from "@/components/recent-updates-panel";
import { SectionHeading } from "@/components/section-heading";
import { latestUpdatedAt, milestones } from "@/data/milestones";
import { getOverviewStats, getRecentMilestoneUpdates } from "@/lib/data-queries";
import { formatLongDate } from "@/lib/format";

const stats = getOverviewStats();
const recentMilestones = getRecentMilestoneUpdates();

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[2.25rem] border border-line/80 bg-white/70 p-7 shadow-panel md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink-600">
                Overview
              </p>
              <h1 className="max-w-4xl font-serif text-5xl tracking-tight text-ink-900 md:text-6xl">
                AGI tracked as milestone claims, not just benchmark scores.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-ink-700">
                This mock MVP asks what needs to be true for AI to count as AGI, then breaks each milestone into lower-level conditions backed by sample evidence and confidence judgments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-ink-900 bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50">
                Last updated {formatLongDate(latestUpdatedAt)}
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-4 py-2 text-sm font-medium text-ink-700">
                {milestones.length} top-level milestones
              </span>
              <span className="rounded-full border border-line bg-paper-50 px-4 py-2 text-sm font-medium text-ink-700">
                {stats.evidenceCount} sample evidence items
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Met</p>
              <p className="mt-3 text-4xl font-semibold text-sage">{stats.met}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">In progress</p>
              <p className="mt-3 text-4xl font-semibold text-amber">{stats.inProgress}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Not met</p>
              <p className="mt-3 text-4xl font-semibold text-rust">{stats.notMet}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/80 bg-paper-50/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-600">Average progress</p>
              <p className="mt-3 text-4xl font-semibold text-ink-900">{stats.progressAverage}%</p>
            </div>
          </div>
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

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <RecentUpdatesPanel milestones={recentMilestones} />
        <CommunitySnapshot />
      </section>
    </div>
  );
}
