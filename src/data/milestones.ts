import { buildMilestone } from "@/lib/milestone-utils";
import { sourceDimensions } from "@/data/framework";
import { capabilityPillarAdvancedSeeds } from "@/data/seeds/capability-pillars-advanced";
import { capabilityPillarAgencySeeds } from "@/data/seeds/capability-pillars-agency";
import { capabilityPillarFoundationSeeds } from "@/data/seeds/capability-pillars-foundations";
import { CommunitySuggestion, EvidenceRecord, Milestone } from "@/types/agi";

const milestoneSeeds = [
  ...capabilityPillarFoundationSeeds,
  ...capabilityPillarAgencySeeds,
  ...capabilityPillarAdvancedSeeds
];

export const methodologyNote =
  "Mock MVP. These public-facing capability pillars are plain-language summaries built on a deeper coverage map spanning reasoning, learning, truthfulness, self-monitoring, social competence, multimodal understanding, safety, and robustness. Each granular question is intended to be backable by benchmarks, controlled studies, audits, red-team exercises, longitudinal trials, or expert-blind review.";

export const milestones: Milestone[] = milestoneSeeds.map(buildMilestone);

const missingScientificBacking = milestones.flatMap((milestone) =>
  milestone.subQuestions
    .filter(
      (subQuestion) =>
        subQuestion.evaluationModes.length === 0 || subQuestion.proofItems.length === 0
    )
    .map((subQuestion) => `${milestone.id}:${subQuestion.id}`)
);

if (missingScientificBacking.length > 0) {
  throw new Error(
    `Each granular question must include evaluation modes and sample evidence. Missing: ${missingScientificBacking.join(
      ", "
    )}`
  );
}

const coveredCapabilityIds = new Set(
  milestones.flatMap((milestone) =>
    milestone.subQuestions.flatMap((subQuestion) =>
      subQuestion.coverage.flatMap((entry) => entry.capabilityIds)
    )
  )
);

const missingCapabilityCoverage = sourceDimensions.flatMap((dimension) =>
  dimension.capabilityIds
    .filter((capabilityId) => !coveredCapabilityIds.has(capabilityId))
    .map((capabilityId) => `${dimension.id}:${capabilityId}`)
);

if (missingCapabilityCoverage.length > 0) {
  throw new Error(
    `Capability coverage map is incomplete. Missing: ${missingCapabilityCoverage.join(
      ", "
    )}`
  );
}

export const milestoneCategories = Array.from(
  new Set(milestones.map((milestone) => milestone.category))
).sort((left, right) => left.localeCompare(right));

export const latestUpdatedAt = milestones
  .map((milestone) => milestone.updatedAt)
  .sort((left, right) => right.localeCompare(left))[0];

export const evidenceRecords: EvidenceRecord[] = milestones.flatMap((milestone) =>
  milestone.subQuestions.flatMap((subQuestion) =>
    subQuestion.proofItems.map((proofItem) => ({
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      milestoneCategory: milestone.category,
      subQuestionId: subQuestion.id,
      subQuestionTitle: subQuestion.title,
      subQuestionStatus: subQuestion.status,
      proofItem
    }))
  )
);

export const communitySuggestions: CommunitySuggestion[] = [
  {
    id: "community-1",
    author: "A. Chen",
    suggestedMilestone:
      "Separate factual accuracy from factual honesty more explicitly",
    note: "The new evidence pillar covers both, but a future revision could make bluffing-versus-being-wrong a more visible distinction in the public wording.",
    status: "reviewing",
    createdAt: "2026-03-18"
  },
  {
    id: "community-2",
    author: "J. Morales",
    suggestedMilestone:
      "Add a stronger threshold for long-horizon drift resistance",
    note: "Repeated-use stability may deserve its own more prominent card or a more demanding sub-question set under the reliability pillar.",
    status: "queued",
    createdAt: "2026-03-20"
  },
  {
    id: "community-3",
    author: "R. Singh",
    suggestedMilestone:
      "Expose the hidden capability coverage map more clearly",
    note: "A lightweight legend showing which deeper dimensions each pillar covers could help expert users audit completeness without confusing general audiences.",
    status: "merged",
    createdAt: "2026-03-14"
  },
  {
    id: "community-4",
    author: "L. Becker",
    suggestedMilestone:
      "Strengthen the scientific-backing note on each granular item",
    note: "Showing the best evidence forms directly in the detail view would make it easier to see what kind of science could actually satisfy each criterion.",
    status: "queued",
    createdAt: "2026-03-21"
  }
];
