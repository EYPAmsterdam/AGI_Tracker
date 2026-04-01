import { MethodologyNote } from "@/components/methodology-note";
import { MilestonesExplorer } from "@/components/milestones-explorer";
import { SectionHeading } from "@/components/section-heading";
import { getMilestoneCategories, getMilestones } from "@/data/milestones";

export default function MilestonesPage() {
  const milestones = getMilestones();
  const milestoneCategories = getMilestoneCategories();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Milestones"
        title="Full milestone registry"
        description="Filter the milestone set by status, confidence, and category. Each result opens into a dedicated detail view with sub-question evidence and optional recommended sources."
      />
      <MethodologyNote />
      <MilestonesExplorer milestones={milestones} categories={milestoneCategories} />
    </div>
  );
}
