import { FeedbackLink } from "@/components/feedback-link";
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
        eyebrow="Dimensions"
        title="Full dimension registry"
        description="Filter the dimension set by status, confidence, and category. Each result opens into a dedicated detail view with question evidence and optional recommended sources."
        actions={<FeedbackLink source="dimensions-page" />}
      />
      <MethodologyNote />
      <MilestonesExplorer milestones={milestones} categories={milestoneCategories} />
    </div>
  );
}
