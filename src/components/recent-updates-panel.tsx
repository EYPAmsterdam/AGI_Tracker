import Link from "next/link";
import { StatusBadge } from "@/components/badges";
import { formatLongDate } from "@/lib/format";
import { Milestone } from "@/types/agi";

export const RecentUpdatesPanel = ({
  milestones
}: {
  milestones: Milestone[];
}) => (
  <div className="rounded-[1.75rem] border border-line/80 bg-white/75 p-6 shadow-panel">
    <div className="flex items-end justify-between gap-4 border-b border-line/70 pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">
          Recent updates
        </p>
        <h3 className="mt-2 font-serif text-2xl text-ink-900">Latest milestone changes</h3>
      </div>
      <Link href="/milestones" className="text-sm font-medium text-sky hover:text-ink-900">
        View all
      </Link>
    </div>
    <div className="mt-4 space-y-3">
      {milestones.map((milestone) => (
        <Link
          key={milestone.id}
          href={`/milestones/${milestone.id}`}
          className="block rounded-[1.25rem] border border-line/70 bg-paper-50/65 p-4 transition hover:border-ink-700/35 hover:bg-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium text-ink-900">{milestone.title}</p>
              <p className="text-sm text-ink-700">
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
