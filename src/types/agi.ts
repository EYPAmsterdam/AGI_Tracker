export type Status = "not_met" | "in_progress" | "met";
export type Confidence = "low" | "medium" | "high";
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

export interface CommunitySuggestion {
  id: string;
  author: string;
  suggestedMilestone: string;
  note: string;
  status: "queued" | "reviewing" | "merged";
  createdAt: string;
}
