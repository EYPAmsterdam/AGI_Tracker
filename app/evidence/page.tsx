import { FeedbackLink } from "@/components/feedback-link";
import { EvidenceExplorer } from "@/components/evidence-explorer";
import { MethodologyNote } from "@/components/methodology-note";
import { SectionHeading } from "@/components/section-heading";
import { getEvidenceRecords, getMilestones } from "@/data/milestones";

export default function EvidencePage() {
  const evidenceRecords = getEvidenceRecords();
  const milestones = getMilestones();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Evidence"
        title="Published evidence library"
        description="Browse the curated evidence entries attached to questions across the tracked dimensions. This MVP distinguishes between benchmark evidence, leaderboards, research, news, and implementation material."
        actions={<FeedbackLink source="evidence-page" />}
      />
      <MethodologyNote />
      <EvidenceExplorer records={evidenceRecords} milestones={milestones} />
    </div>
  );
}
