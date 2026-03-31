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
        title="Capability dimension registry"
        description="Filter the workbook-backed capability dimensions by status, confidence, and category. Each result opens into a dedicated detail view with capability-level source recommendations and published evidence."
      />
      <MethodologyNote />
      <MilestonesExplorer milestones={milestones} categories={milestoneCategories} />
    </div>
  );
}
