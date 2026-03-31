export type Status = "unassessed" | "not_met" | "in_progress" | "met";
export type Confidence = "unassessed" | "low" | "medium" | "high";
export type ProofType =
  | "benchmark"
  | "leaderboard"
  | "research_paper"
  | "news"
  | "implementation";
export type EvaluationMode =
  | "benchmark"
  | "leaderboard"
  | "controlled_study"
  | "deployment_audit"
  | "red_team"
  | "longitudinal_trial"
  | "expert_blind_review";
export type DimensionId =
  | "reasoning_execution"
  | "learning_generalization"
  | "epistemic_reliability"
  | "metacognition_ethics"
  | "social_competence"
  | "multimodal_understanding"
  | "safety_controllability"
  | "robustness";

export interface CoverageReference {
  dimensionId: DimensionId;
  capabilityIds: string[];
}

export interface ProofItem {
  id: string;
  type: ProofType;
  title: string;
  source: string;
  url: string;
  shortExplanation: string;
  date: string;
}

export interface SourceRecommendation {
  id: string;
  benchmarkId: string;
  title: string;
  source: string;
  sourceTier: string;
  sourceType: string;
  trackerStatus: string;
  ingestMethod: string;
  updateCadence: string;
  whyUseIt: string;
  caveat: string;
  url: string;
  secondaryUrl: string;
  recommendedForV1: boolean;
  priorityRank: number | null;
}

export interface SubQuestion {
  id: string;
  title: string;
  description: string;
  status: Status;
  confidence: Confidence;
  rationale: string;
  evaluationModes: EvaluationMode[];
  coverage: CoverageReference[];
  proofItems: ProofItem[];
  sourceRecommendations: SourceRecommendation[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  status: Status;
  confidence: Confidence;
  progressPercent: number;
  updatedAt: string;
  coverage: CoverageReference[];
  subQuestions: SubQuestion[];
}

export interface MilestoneSeed {
  id: string;
  title: string;
  description: string;
  category: string;
  subQuestions: SubQuestion[];
}

export interface EvidenceRecord {
  milestoneId: string;
  milestoneTitle: string;
  milestoneCategory: string;
  subQuestionId: string;
  subQuestionTitle: string;
  subQuestionStatus: Status;
  proofItem: ProofItem;
}
