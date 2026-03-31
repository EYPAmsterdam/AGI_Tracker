import { CommunityForm } from "@/components/community-form";
import { SectionHeading } from "@/components/section-heading";

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Community"
        title="Public suggestions"
        description="A mock interface for proposing milestones, sub-questions, and evidence links. This page is intentionally frontend-only in the MVP."
      />
      <CommunityForm />
    </div>
  );
}
