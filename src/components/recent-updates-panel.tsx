import Link from "next/link";
import { StatusBadge } from "@/components/badges";
import { formatLongDate } from "@/lib/format";
import { Milestone } from "@/types/agi";

export const RecentUpdatesPanel = ({
  milestones
}: {
  milestones: Milestone[];
}) => (
  <div className="rounded-[1.5rem] border border-line/80 bg-white/75 p-4 shadow-panel md:rounded-[1.75rem] md:p-6">
    <div className="flex items-end justify-between gap-4 border-b border-line/70 pb-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 md:text-xs md:tracking-[0.24em]">
          Recent updates
        </p>
        <h3 className="mt-2 font-serif text-xl text-ink-900 md:text-2xl">Latest dimension changes</h3>
      </div>
      <Link href="/milestones" className="text-xs font-medium text-sky hover:text-ink-900 md:text-sm">
        View all
      </Link>
    </div>
    <div className="mt-4 space-y-3">
      {milestones.map((milestone) => (
        <Link
          key={milestone.id}
          href={`/milestones/${milestone.id}`}
          className="block rounded-[1.05rem] border border-line/70 bg-paper-50/65 p-3.5 transition hover:border-ink-700/35 hover:bg-white md:rounded-[1.25rem] md:p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-ink-900 md:text-base">{milestone.title}</p>
              <p className="text-[13px] text-ink-700 md:text-sm">
                Updated {formatLongDate(milestone.updatedAt)}
              </p>
            </div>
            <StatusBadge status={milestone.status} />
          </div>
        </Link>
      ))}
    </div>
  </div>
);
