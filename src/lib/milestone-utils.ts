import {
  Confidence,
  CoverageReference,
  EvaluationMode,
  Milestone,
  ProofType,
  Status,
  SubQuestion
} from "@/types/agi";
import { MilestoneContent } from "@/types/content";

export const STATUS_LABELS: Record<Status, string> = {
  unassessed: "Unassessed",
  not_met: "Not met",
  in_progress: "In progress",
  met: "Met"
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  unassessed: "Unassessed",
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence"
};

export const PROOF_TYPE_LABELS: Record<ProofType, string> = {
  benchmark: "Benchmark",
  leaderboard: "Leaderboard",
  research_paper: "Research paper",
  news: "News",
  implementation: "Implementation"
};

export const EVALUATION_MODE_LABELS: Record<EvaluationMode, string> = {
  benchmark: "Benchmark",
  leaderboard: "Leaderboard",
  controlled_study: "Controlled study",
  deployment_audit: "Deployment audit",
  red_team: "Red-team evaluation",
  longitudinal_trial: "Longitudinal trial",
  expert_blind_review: "Expert blind review"
};

export const statusToProgressValue = (status: Status): number => {
  if (status === "met") {
    return 1;
  }

  if (status === "in_progress") {
    return 0.5;
  }

  return 0;
};

export const deriveMilestoneStatus = (subQuestions: SubQuestion[]): Status => {
  const assessedSubQuestions = subQuestions.filter(
    (item) => item.status !== "unassessed"
  );

  if (assessedSubQuestions.length === 0) {
    return "unassessed";
  }

  const total = assessedSubQuestions.length;
  const metCount = assessedSubQuestions.filter((item) => item.status === "met").length;
  const inProgressCount = assessedSubQuestions.filter(
    (item) => item.status === "in_progress"
  ).length;
  const notMetCount = assessedSubQuestions.filter(
    (item) => item.status === "not_met"
  ).length;

  if (metCount / total >= 0.75 && notMetCount <= 1) {
    return "met";
  }

  if ((metCount + inProgressCount) / total >= 0.3) {
    return "in_progress";
  }

  return "not_met";
};

export const deriveMilestoneProgressPercent = (
  subQuestions: SubQuestion[]
): number => {
  if (subQuestions.length === 0) {
    return 0;
  }

  const totalValue = subQuestions.reduce(
    (sum, item) => sum + statusToProgressValue(item.status),
    0
  );

  return Math.round((totalValue / subQuestions.length) * 100);
};

export const deriveMilestoneConfidence = (
  subQuestions: SubQuestion[]
): Confidence => {
  const proofItems = subQuestions.flatMap((item) => item.proofItems);
  const total = proofItems.length;

  if (total === 0) {
    return "unassessed";
  }

  const strongEvidenceCount = proofItems.filter((item) =>
    ["benchmark", "leaderboard", "research_paper"].includes(item.type)
  ).length;
  const contextualEvidenceCount = total - strongEvidenceCount;

  if (total <= 6 && strongEvidenceCount <= contextualEvidenceCount) {
    return "low";
  }

  if (strongEvidenceCount / total >= 0.6) {
    return "high";
  }

  if (contextualEvidenceCount / total > 0.65) {
    return "low";
  }

  return "medium";
};

export const deriveUpdatedAt = (subQuestions: SubQuestion[]): string => {
  return subQuestions
    .flatMap((item) => item.proofItems)
    .map((item) => item.date)
    .sort((left, right) => right.localeCompare(left))[0];
};

export const deriveMilestoneCoverage = (
  subQuestions: SubQuestion[]
): CoverageReference[] => {
  const coverageMap = new Map<string, Set<string>>();

  for (const subQuestion of subQuestions) {
    for (const entry of subQuestion.coverage) {
      const existing = coverageMap.get(entry.dimensionId) ?? new Set<string>();

      entry.capabilityIds.forEach((capabilityId) => existing.add(capabilityId));
      coverageMap.set(entry.dimensionId, existing);
    }
  }

  return Array.from(coverageMap.entries()).map(([dimensionId, capabilityIds]) => ({
    dimensionId: dimensionId as CoverageReference["dimensionId"],
    capabilityIds: Array.from(capabilityIds).sort((left, right) =>
      left.localeCompare(right)
    )
  }));
};

export const buildMilestoneFromContent = (content: MilestoneContent): Milestone => {
  const status = deriveMilestoneStatus(content.subQuestions);
  const progressPercent = deriveMilestoneProgressPercent(content.subQuestions);
  const confidence = deriveMilestoneConfidence(content.subQuestions);
  const coverage = deriveMilestoneCoverage(content.subQuestions);

  return {
    id: content.id,
    title: content.title,
    description: content.description,
    category: content.category,
    status,
    confidence,
    progressPercent,
    updatedAt: content.updatedAt,
    coverage,
    subQuestions: content.subQuestions
  };
};

export const sortByUpdatedAt = <T extends { updatedAt: string }>(items: T[]) => {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
};
