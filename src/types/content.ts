import {
  Confidence,
  CoverageReference,
  EvaluationMode,
  ProofItem,
  SourceRecommendation,
  Status
} from "@/types/agi";

export interface ProofItemContent extends ProofItem {}

export interface SubQuestionContent {
  id: string;
  title: string;
  description: string;
  status: Status;
  confidence: Confidence;
  rationale: string;
  evaluationModes: EvaluationMode[];
  coverage: CoverageReference[];
  proofItems: ProofItemContent[];
  sourceRecommendations: SourceRecommendation[];
}

export interface MilestoneContent {
  id: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
  updatedAt: string;
  subQuestions: SubQuestionContent[];
}
