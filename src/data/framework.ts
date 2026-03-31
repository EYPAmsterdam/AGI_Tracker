import { DimensionId } from "@/types/agi";

export interface SourceDimension {
  id: DimensionId;
  label: string;
  capabilityIds: string[];
}

export const sourceDimensions: SourceDimension[] = [
  {
    id: "reasoning_execution",
    label: "Cognitive Reasoning & Task Execution",
    capabilityIds: [
      "problem_understanding",
      "multi_step_reasoning_under_constraints",
      "planning_quality_adaptability",
      "execution_control",
      "tool_use_reliability",
      "code_task_execution"
    ]
  },
  {
    id: "learning_generalization",
    label: "Learning & Generalization",
    capabilityIds: [
      "in_context_learning_adaptation",
      "transfer_generalization",
      "ood_generalization",
      "long_context_memory_generalization"
    ]
  },
  {
    id: "epistemic_reliability",
    label: "Epistemic Reliability & Truthfulness",
    capabilityIds: [
      "factual_accuracy",
      "citation_evidence_correctness",
      "hallucination_resistance",
      "knowledge_consistency",
      "misinformation_robustness",
      "factual_honesty"
    ]
  },
  {
    id: "metacognition_ethics",
    label: "Metacognition / Ethical Discernment",
    capabilityIds: [
      "uncertainty_calibration",
      "abstention",
      "self_evaluation",
      "self_correction"
    ]
  },
  {
    id: "social_competence",
    label: "Social Interaction Competence",
    capabilityIds: [
      "user_modeling",
      "perspective_taking",
      "interaction_quality",
      "emotion_affect_handling"
    ]
  },
  {
    id: "multimodal_understanding",
    label: "Multimodal Understanding",
    capabilityIds: [
      "cross_modal_grounding",
      "multimodal_reasoning",
      "multimodal_information_extraction",
      "multimodal_generation",
      "spatial_reasoning"
    ]
  },
  {
    id: "safety_controllability",
    label: "Safety & Controllability",
    capabilityIds: [
      "steerability_constraint_adherence",
      "harmfulness_prevention",
      "refusal_quality",
      "jailbreak_resistance",
      "privacy_data_handling",
      "misuse_resistance"
    ]
  },
  {
    id: "robustness",
    label: "Robustness",
    capabilityIds: [
      "noisy_input_robustness",
      "distribution_shift_robustness",
      "misleading_context_robustness",
      "long_horizon_drift_resistance"
    ]
  }
];
