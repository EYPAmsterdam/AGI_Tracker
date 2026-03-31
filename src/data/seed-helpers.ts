import {
  CoverageReference,
  DimensionId,
  EvaluationMode,
  MilestoneSeed,
  ProofItem,
  ProofType,
  SubQuestion
} from "@/types/agi";

export const proof = (
  id: string,
  type: ProofItem["type"],
  title: string,
  source: string,
  url: string,
  shortExplanation: string,
  date: string
): ProofItem => ({
  id,
  type,
  title,
  source,
  url,
  shortExplanation,
  date
});

export const question = (item: SubQuestion): SubQuestion => item;

export const coverage = (
  dimensionId: DimensionId,
  ...capabilityIds: string[]
): CoverageReference => ({
  dimensionId,
  capabilityIds
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const proofTypeFromMode: Record<EvaluationMode, ProofType> = {
  benchmark: "benchmark",
  leaderboard: "leaderboard",
  controlled_study: "research_paper",
  deployment_audit: "implementation",
  red_team: "benchmark",
  longitudinal_trial: "research_paper",
  expert_blind_review: "research_paper"
};

const sourceFromMode: Record<EvaluationMode, string> = {
  benchmark: "Open Capability Benchmark Consortium",
  leaderboard: "Frontier Evaluation Arena",
  controlled_study: "Center for Applied AI Evaluation",
  deployment_audit: "Operational AI Audit Lab",
  red_team: "Model Red-Team Exchange",
  longitudinal_trial: "Long-Run Systems Study Group",
  expert_blind_review: "Expert Review Panel on AI Performance"
};

const titlePrefixFromMode: Record<EvaluationMode, string> = {
  benchmark: "Benchmark suite",
  leaderboard: "Leaderboard",
  controlled_study: "Controlled study",
  deployment_audit: "Deployment audit",
  red_team: "Red-team evaluation",
  longitudinal_trial: "Longitudinal trial",
  expert_blind_review: "Expert blind review"
};

const urlRootFromMode: Record<EvaluationMode, string> = {
  benchmark: "benchmarks",
  leaderboard: "leaderboards",
  controlled_study: "studies",
  deployment_audit: "audits",
  red_team: "red-team",
  longitudinal_trial: "trials",
  expert_blind_review: "expert-review"
};

export const modeEvidence = (
  id: string,
  mode: EvaluationMode,
  topic: string,
  shortExplanation: string,
  date: string
): ProofItem =>
  proof(
    id,
    proofTypeFromMode[mode],
    `${titlePrefixFromMode[mode]}: ${topic}`,
    sourceFromMode[mode],
    `https://capability-evals.example/${urlRootFromMode[mode]}/${slugify(topic)}`,
    shortExplanation,
    date
  );

export type SeedGroup = MilestoneSeed[];
