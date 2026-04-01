import { Suspense } from "react";
import {
  CommunityFormFallback,
  CommunityFormWithSearch
} from "@/components/community-form";
import { SectionHeading } from "@/components/section-heading";
import { getMilestones } from "@/data/milestones";

export default function CommunityPage() {
  const dimensions = getMilestones().map((dimension) => ({
    id: dimension.id,
    title: dimension.title,
    questions: dimension.subQuestions.map((question) => ({
      id: question.id,
      title: question.title
    }))
  }));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Community"
        title="Public input"
        description="Please let us know what you have in mind. We will review all suggestions and consider them for future updates."
      />
      <Suspense fallback={<CommunityFormFallback />}>
        <CommunityFormWithSearch dimensions={dimensions} />
      </Suspense>
    </div>
  );
}
