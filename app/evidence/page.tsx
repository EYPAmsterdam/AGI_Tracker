import { EvidenceExplorer } from "@/components/evidence-explorer";
import { MethodologyNote } from "@/components/methodology-note";
import { SectionHeading } from "@/components/section-heading";
import { evidenceRecords, milestones } from "@/data/milestones";

export default function EvidencePage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Evidence"
        title="Sample evidence library"
        description="Browse the sample proofs attached to milestone judgments. This MVP distinguishes between benchmark evidence, leaderboards, research, news, and implementation or demo material."
      />
      <MethodologyNote />
      <EvidenceExplorer records={evidenceRecords} milestones={milestones} />
    </div>
  );
}
