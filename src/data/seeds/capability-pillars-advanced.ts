import { SeedGroup, coverage, modeEvidence, question } from "@/data/seed-helpers";

export const capabilityPillarAdvancedSeeds: SeedGroup = [
  {
    id: "creative-solutions",
    title: "AI can generate new, useful ideas and solutions",
    description:
      "An AI system can produce novel hypotheses, designs, and solution paths that are genuinely useful rather than generic rearrangements of familiar patterns.",
    category: "Novelty",
    subQuestions: [
      question({
        id: "creative-solutions-proposals",
        title: "Can it propose novel hypotheses, designs, or solution paths?",
        description:
          "Measures whether the system generates options that move beyond obvious summaries or recombinations.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Systems can generate many plausible new directions, but the ratio of truly valuable ideas to generic ones is still uneven.",
        evaluationModes: ["expert_blind_review", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "planning_quality_adaptability"
          ),
          coverage("multimodal_understanding", "multimodal_generation")
        ],
        proofItems: [
          modeEvidence(
            "p-creative-solutions-1",
            "expert_blind_review",
            "Novel hypothesis and solution proposal quality",
            "Expert blind review found that models generate many plausible ideas, but only a minority are judged meaningfully non-obvious and worth pursuing.",
            "2026-02-14"
          )
        ]
      }),
      question({
        id: "creative-solutions-nontrivial",
        title: "Can experts judge its outputs as non-trivial?",
        description:
          "Tests whether expert raters distinguish the output as meaningfully valuable rather than boilerplate.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Experts do sometimes rate outputs as non-trivial, but not consistently enough to call this solved.",
        evaluationModes: ["expert_blind_review"],
        coverage: [
          coverage("multimodal_understanding", "multimodal_generation")
        ],
        proofItems: [
          modeEvidence(
            "p-creative-solutions-2",
            "expert_blind_review",
            "Expert judgment of non-trivial output quality",
            "Panel reviews show some outputs standing out as genuinely useful, but many still read as polished synthesis rather than strong original contribution.",
            "2026-03-01"
          )
        ]
      }),
      question({
        id: "creative-solutions-baselines",
        title: "Can it outperform baseline ideation workflows?",
        description:
          "Measures whether using the system creates better or broader idea portfolios than ordinary baseline workflows.",
        status: "met",
        confidence: "medium",
        rationale:
          "In many ideation settings, models already improve breadth and speed relative to ordinary first-pass brainstorming workflows.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage(
            "reasoning_execution",
            "planning_quality_adaptability"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-creative-solutions-3",
            "controlled_study",
            "AI-assisted ideation versus baseline workflows",
            "Controlled comparisons show AI-assisted teams producing broader option sets faster than baseline ideation processes.",
            "2026-02-24"
          )
        ]
      }),
      question({
        id: "creative-solutions-constraints",
        title: "Can it adapt novelty to concrete constraints and goals?",
        description:
          "Tests whether creative output remains useful when cost, timing, audience, or technical constraints are explicit.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Constraint-aware creativity is improving, but models still swing between generic novelty and impractical overreach.",
        evaluationModes: ["controlled_study", "expert_blind_review"],
        coverage: [
          coverage(
            "reasoning_execution",
            "planning_quality_adaptability"
          ),
          coverage("multimodal_understanding", "multimodal_generation")
        ],
        proofItems: [
          modeEvidence(
            "p-creative-solutions-4",
            "controlled_study",
            "Constraint-aware creative generation",
            "Evaluation studies show useful creativity under moderate constraints, but weaker performance when constraints become numerous or tightly coupled.",
            "2026-01-18"
          )
        ]
      }),
      question({
        id: "creative-solutions-boilerplate",
        title: "Can it distinguish useful synthesis from generic boilerplate?",
        description:
          "Measures whether the system can identify and avoid outputs that only sound polished without adding real value.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Systems can sometimes critique generic output well, but still frequently produce or accept it in practice.",
        evaluationModes: ["expert_blind_review", "controlled_study"],
        coverage: [
          coverage("metacognition_ethics", "self_evaluation"),
          coverage("epistemic_reliability", "factual_honesty")
        ],
        proofItems: [
          modeEvidence(
            "p-creative-solutions-5",
            "expert_blind_review",
            "Detection of generic versus genuinely useful synthesis",
            "Reviewer studies show partial success in distinguishing empty polish from useful synthesis, but still document over-acceptance of generic output.",
            "2026-03-11"
          )
        ]
      })
    ]
  },
  {
    id: "safety-control",
    title: "AI can stay controllable, safe, and resistant to misuse",
    description:
      "An AI system can follow explicit constraints, refuse harmful behavior, resist adversarial prompting, and remain steerable after change.",
    category: "Safety & control",
    subQuestions: [
      question({
        id: "safety-control-policies",
        title: "Can it follow explicit policies and constraints?",
        description:
          "Measures whether the system adheres to stated rules and operating boundaries during task execution.",
        status: "met",
        confidence: "high",
        rationale:
          "Constraint following is now strong on many standard safety and workflow policy settings, though edge cases still remain.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("safety_controllability", "steerability_constraint_adherence")
        ],
        proofItems: [
          modeEvidence(
            "p-safety-control-1",
            "benchmark",
            "Policy and constraint adherence",
            "Safety and workflow benchmark suites show strong adherence to explicit rule sets in most ordinary task conditions.",
            "2026-03-06"
          )
        ]
      }),
      question({
        id: "safety-control-refusal",
        title: "Can it refuse harmful requests consistently?",
        description:
          "Tests whether harmful instructions are declined robustly across paraphrases and repeated attempts.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Refusal quality is improved but still not stable enough under paraphrase pressure and determined probing.",
        evaluationModes: ["benchmark", "red_team"],
        coverage: [
          coverage(
            "safety_controllability",
            "harmfulness_prevention",
            "refusal_quality"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-safety-control-2",
            "red_team",
            "Refusal stability under harmful request variation",
            "Adversarial safety evaluations show solid ordinary refusal behavior, but still find inconsistency under paraphrase and persistence.",
            "2026-02-12"
          )
        ]
      }),
      question({
        id: "safety-control-alternatives",
        title: "Can it offer safe alternatives where appropriate?",
        description:
          "Measures whether the system gives constructive lower-risk pathways instead of only flat refusal when a legitimate safer route exists.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Constructive redirection exists in many domains, but quality varies substantially and is not yet consistently useful.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage(
            "safety_controllability",
            "harmfulness_prevention",
            "refusal_quality"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-safety-control-3",
            "controlled_study",
            "Safe alternative generation after refusal",
            "User studies show many better-than-baseline redirections, but still highlight inconsistency in how helpful those alternatives are.",
            "2026-01-25"
          )
        ]
      }),
      question({
        id: "safety-control-jailbreaks",
        title: "Can it resist jailbreaks and adversarial prompting?",
        description:
          "Tests whether safety behavior survives intentionally hostile prompting and prompt-wrapper attacks.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Adversarial prompting remains one of the clearest unresolved gaps between acceptable lab behavior and robust real deployment.",
        evaluationModes: ["red_team", "benchmark"],
        coverage: [
          coverage(
            "safety_controllability",
            "jailbreak_resistance",
            "misuse_resistance"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-safety-control-4",
            "red_team",
            "Jailbreak resistance under adversarial prompting",
            "Red-team tracks continue to expose meaningful safety degradation under sophisticated adversarial prompt attacks.",
            "2026-03-13"
          )
        ]
      }),
      question({
        id: "safety-control-steerability",
        title: "Can it remain steerable after prompt or capability changes?",
        description:
          "Measures whether updates, wrappers, or changing task contexts preserve controllability instead of eroding it unpredictably.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Steerability persists in many ordinary settings, but regressions still appear after prompt changes, tool additions, and model updates.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage(
            "safety_controllability",
            "steerability_constraint_adherence",
            "misuse_resistance"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-safety-control-5",
            "deployment_audit",
            "Steerability retention after system changes",
            "Release and deployment audits show that control quality can shift after prompt or capability changes, even when headline behavior looks stable.",
            "2026-02-27"
          )
        ]
      })
    ]
  },
  {
    id: "high-stakes-responsibility",
    title: "AI can handle sensitive and high-stakes contexts responsibly",
    description:
      "An AI system can protect private information, operate inside regulated constraints, remain accurate where harm is costly, and improve outcomes without raising risk.",
    category: "High-stakes use",
    subQuestions: [
      question({
        id: "high-stakes-responsibility-privacy",
        title: "Can it protect private or confidential information?",
        description:
          "Measures whether the system avoids inappropriate exposure, retention, or mishandling of sensitive information.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "There is meaningful progress on privacy-aware behavior, but sensitive-data handling is still not strong enough for broad unsupervised trust.",
        evaluationModes: ["deployment_audit", "red_team"],
        coverage: [
          coverage("safety_controllability", "privacy_data_handling")
        ],
        proofItems: [
          modeEvidence(
            "p-high-stakes-responsibility-1",
            "deployment_audit",
            "Privacy-preserving behavior in sensitive workflows",
            "Operational audits show improving private-data handling, but still document avoidable leakage and over-retention in some workflow designs.",
            "2026-03-02"
          )
        ]
      }),
      question({
        id: "high-stakes-responsibility-compliance",
        title: "Can it comply with regulated-domain rules?",
        description:
          "Tests whether the system respects domain-specific legal, procedural, or regulatory constraints in practice.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Constraint handling exists in narrow sandboxes, but broad regulated-domain compliance remains too fragile and context-dependent.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage(
            "safety_controllability",
            "steerability_constraint_adherence"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-high-stakes-responsibility-2",
            "deployment_audit",
            "Regulated-domain compliance reliability",
            "Domain audits continue to show that models can follow many explicit rules, but still miss edge-case and jurisdiction-specific constraints.",
            "2026-02-06"
          )
        ]
      }),
      question({
        id: "high-stakes-responsibility-accuracy",
        title: "Can it maintain factual accuracy in high-stakes tasks?",
        description:
          "Measures whether accuracy remains reliable in settings where mistakes create real harm rather than mere inconvenience.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Accuracy improves with retrieval and structure, but not enough to justify broad unsupervised reliance in high-stakes domains.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage("epistemic_reliability", "factual_accuracy")
        ],
        proofItems: [
          modeEvidence(
            "p-high-stakes-responsibility-3",
            "controlled_study",
            "High-stakes factual accuracy under real task framing",
            "Controlled high-stakes evaluations continue to show accuracy gaps large enough to require strong human oversight.",
            "2026-01-30"
          )
        ]
      }),
      question({
        id: "high-stakes-responsibility-auditability",
        title: "Can it provide auditable evidence trails for decisions?",
        description:
          "Tests whether a reviewer can reconstruct what the system saw, did, and relied on after the fact.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Audit tooling is improving, but action trace completeness and explanation fidelity still fall short in many higher-stakes settings.",
        evaluationModes: ["deployment_audit", "expert_blind_review"],
        coverage: [
          coverage("reasoning_execution", "execution_control"),
          coverage("epistemic_reliability", "citation_evidence_correctness")
        ],
        proofItems: [
          modeEvidence(
            "p-high-stakes-responsibility-4",
            "deployment_audit",
            "Auditable evidence trails in regulated workflows",
            "Case audits show partial action trace coverage, but still incomplete reconstruction of hidden state, retrieval paths, and tool decisions.",
            "2026-03-10"
          )
        ]
      }),
      question({
        id: "high-stakes-responsibility-outcomes",
        title: "Can it improve outcomes without increasing harm?",
        description:
          "Measures whether the system produces better real-world results rather than merely improving speed or user satisfaction.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Outcome evidence in high-stakes deployments is still too sparse and too mixed to justify strong claims of safe improvement.",
        evaluationModes: ["longitudinal_trial", "deployment_audit"],
        coverage: [
          coverage("safety_controllability", "harmfulness_prevention")
        ],
        proofItems: [
          modeEvidence(
            "p-high-stakes-responsibility-5",
            "longitudinal_trial",
            "Outcome improvement without added harm",
            "Longitudinal deployment studies remain too sparse and mixed to support broad claims that AI assistance improves high-stakes outcomes without offsetting risk.",
            "2026-03-15"
          )
        ]
      })
    ]
  },
  {
    id: "messy-world-reliability",
    title: "AI stays reliable in messy real-world conditions",
    description:
      "An AI system can remain competent when inputs are noisy, contexts are misleading, distributions shift, and long sessions create drift.",
    category: "Robustness",
    subQuestions: [
      question({
        id: "messy-world-reliability-noise",
        title: "Can it maintain performance under noisy or incomplete inputs?",
        description:
          "Measures resilience to missing fields, ambiguous formatting, transcription errors, and partial information.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Systems are more forgiving than before, but still lose meaningful performance as noise and incompleteness accumulate.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("robustness", "noisy_input_robustness")
        ],
        proofItems: [
          modeEvidence(
            "p-messy-world-reliability-1",
            "benchmark",
            "Noisy and incomplete input robustness",
            "Robustness benchmarks show useful tolerance to moderate corruption, but still clear degradation once inputs become meaningfully incomplete or messy.",
            "2026-03-07"
          )
        ]
      }),
      question({
        id: "messy-world-reliability-shift",
        title: "Can it withstand distribution shift and novel task formats?",
        description:
          "Tests whether competence survives when real deployment differs from known examples and familiar interfaces.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Distribution shift and interface novelty remain recurring failure modes even for otherwise strong systems.",
        evaluationModes: ["benchmark", "longitudinal_trial"],
        coverage: [
          coverage(
            "learning_generalization",
            "ood_generalization"
          ),
          coverage("robustness", "distribution_shift_robustness")
        ],
        proofItems: [
          modeEvidence(
            "p-messy-world-reliability-2",
            "benchmark",
            "Distribution shift and novel-format robustness",
            "Generalization evaluations continue to show substantial drops when task distributions or wrappers depart from familiar benchmark-style conditions.",
            "2026-02-17"
          )
        ]
      }),
      question({
        id: "messy-world-reliability-long-sessions",
        title: "Can it remain stable over long sessions or repeated use?",
        description:
          "Measures whether quality degrades over time as context, fatigue-like drift, or repeated interactions accumulate.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Long-run stability is still a clear weakness, especially in agentic and multi-turn operational settings.",
        evaluationModes: ["longitudinal_trial", "deployment_audit"],
        coverage: [
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-messy-world-reliability-3",
            "longitudinal_trial",
            "Long-session stability and drift resistance",
            "Long-duration trials continue to document noticeable drift, forgotten constraints, and rising oversight needs over repeated use.",
            "2026-03-13"
          )
        ]
      }),
      question({
        id: "messy-world-reliability-cascading-errors",
        title: "Can it avoid cascading errors after early mistakes?",
        description:
          "Tests whether the system contains damage after a bad early assumption instead of amplifying it through later steps.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Error containment is better than before, but bad early assumptions still propagate too often through multi-step workflows.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "execution_control"
          ),
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-messy-world-reliability-4",
            "deployment_audit",
            "Cascading-error containment after early mistakes",
            "Workflow audits show some self-recovery, but still frequent downstream compounding once an early assumption is wrong.",
            "2026-02-28"
          )
        ]
      }),
      question({
        id: "messy-world-reliability-misleading-context",
        title: "Can it preserve competence under misleading or adversarial context?",
        description:
          "Measures whether performance survives misleading framing, poisoned context, and adversarially structured inputs.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Adversarially misleading context continues to degrade behavior across reasoning, retrieval, and safety tasks.",
        evaluationModes: ["red_team", "benchmark"],
        coverage: [
          coverage("robustness", "misleading_context_robustness")
        ],
        proofItems: [
          modeEvidence(
            "p-messy-world-reliability-5",
            "red_team",
            "Robustness under misleading or adversarial context",
            "Adversarial evaluations show systems still being materially misled by poisoned framing, false premises, and manipulative context setup.",
            "2026-03-12"
          )
        ]
      })
    ]
  },
  {
    id: "delegated-responsibility",
    title: "AI can be trusted with meaningful delegated responsibility",
    description:
      "An AI system can integrate many capabilities into one governed, monitorable, and dependable system that institutions would plausibly trust with serious responsibility.",
    category: "Delegation",
    subQuestions: [
      question({
        id: "delegated-responsibility-role-coverage",
        title: "Can it perform reliably across varied role types?",
        description:
          "Measures whether one coherent system can cover a broad set of meaningful roles rather than a narrow slice of tasks.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Capability breadth is increasing, but dependable cross-role performance remains far from demonstrated in the real world.",
        evaluationModes: ["longitudinal_trial", "deployment_audit"],
        coverage: [
          coverage("learning_generalization", "transfer_generalization")
        ],
        proofItems: [
          modeEvidence(
            "p-delegated-responsibility-1",
            "deployment_audit",
            "Cross-role reliability in real deployments",
            "Deployment inventories show wider assistant use, but not reliable performance across a broad portfolio of meaningful delegated roles.",
            "2026-03-09"
          )
        ]
      }),
      question({
        id: "delegated-responsibility-integration",
        title: "Can it integrate multiple capabilities into one coherent system?",
        description:
          "Tests whether reasoning, learning, tool use, grounding, and safety behaviors remain aligned when combined in one operational system.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Integrated systems are increasingly impressive, but capability composition still creates brittleness, especially over longer runs.",
        evaluationModes: ["deployment_audit", "longitudinal_trial"],
        coverage: [
          coverage(
            "reasoning_execution",
            "execution_control",
            "tool_use_reliability"
          ),
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-delegated-responsibility-2",
            "deployment_audit",
            "Integrated capability coherence",
            "System audits show increasingly capable end-to-end behavior, but also document brittle interactions once many capabilities are composed together.",
            "2026-02-23"
          )
        ]
      }),
      question({
        id: "delegated-responsibility-governance",
        title: "Can it be monitored and governed after the fact?",
        description:
          "Measures whether institutions can reconstruct, inspect, and govern the system's actions in a practically meaningful way.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Current governance tooling is still too partial and too workflow-specific for broad delegated responsibility.",
        evaluationModes: ["deployment_audit", "expert_blind_review"],
        coverage: [
          coverage(
            "safety_controllability",
            "steerability_constraint_adherence"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-delegated-responsibility-3",
            "deployment_audit",
            "Post-hoc governance and monitoring quality",
            "Governance audits show some usable traces and controls, but not enough coverage or reliability for broad institutional delegation.",
            "2026-03-14"
          )
        ]
      }),
      question({
        id: "delegated-responsibility-severe-failure",
        title: "Can it avoid severe failures in high-impact settings?",
        description:
          "Tests tail-risk behavior rather than average-case competence under ordinary conditions.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Evidence on rare but severe failure prevention remains too weak for broad trust in high-impact delegation.",
        evaluationModes: ["red_team", "longitudinal_trial"],
        coverage: [
          coverage(
            "safety_controllability",
            "harmfulness_prevention",
            "misuse_resistance"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-delegated-responsibility-4",
            "red_team",
            "Severe-failure resistance in high-impact scenarios",
            "Tail-risk evaluations continue to find too much uncertainty and too many unresolved severe-failure modes for broad delegation.",
            "2026-03-16"
          )
        ]
      }),
      question({
        id: "delegated-responsibility-real-deployments",
        title: "Can it show strong evidence from real deployments, not only lab wins?",
        description:
          "Measures whether serious institutions have already delegated meaningful responsibility in practice, with convincing evidence of success.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Real deployment evidence is still dominated by bounded copilots, pilots, and supervised assistance rather than genuine responsibility transfer.",
        evaluationModes: ["longitudinal_trial", "deployment_audit"],
        coverage: [
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-delegated-responsibility-5",
            "deployment_audit",
            "Real-world evidence for meaningful delegation",
            "Deployment reviews show expanding use, but not the sustained, high-responsibility institutional delegation that this threshold would require.",
            "2026-03-17"
          )
        ]
      })
    ]
  }
];
