import { MethodologyNote } from "@/components/methodology-note";
import { MilestonesExplorer } from "@/components/milestones-explorer";
import { SectionHeading } from "@/components/section-heading";
import { milestones } from "@/data/milestones";

export default function MilestonesPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Milestones"
        title="Full milestone registry"
        description="Filter the top-level AGI milestones by status, confidence, and category. Each result opens into a dedicated detail view with sub-question evidence."
      />
      <MethodologyNote />
      <MilestonesExplorer milestones={milestones} />
    </div>
  );
}
