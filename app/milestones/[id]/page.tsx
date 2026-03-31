import { notFound } from "next/navigation";
import { MethodologyNote } from "@/components/methodology-note";
import { MilestoneDetailView } from "@/components/milestone-detail-view";
import { getMilestones } from "@/data/milestones";
import { getMilestoneById } from "@/lib/data-queries";

export function generateStaticParams() {
  return getMilestones().map((milestone) => ({ id: milestone.id }));
}

export default function MilestoneDetailPage({
  params
}: {
  params: { id: string };
}) {
  const milestone = getMilestoneById(params.id);

  if (!milestone) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <MethodologyNote />
      <MilestoneDetailView milestone={milestone} />
    </div>
  );
}
