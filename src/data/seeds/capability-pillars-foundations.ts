import { SeedGroup, coverage, modeEvidence, question } from "@/data/seed-helpers";

export const capabilityPillarFoundationSeeds: SeedGroup = [
  {
    id: "task-understanding",
    title: "AI can understand what a task is really asking",
    description:
      "An AI system can recover intent from messy instructions, isolate the real job to be done, and frame the task correctly before acting.",
    category: "Task understanding",
    subQuestions: [
      question({
        id: "task-understanding-goal-inference",
        title: "Can it infer the real goal from messy instructions?",
        description:
          "Tests whether the system can recover underlying intent when requests are informal, cluttered, or only partially specified.",
        status: "met",
        confidence: "high",
        rationale:
          "Current frontier systems are already strong at reconstructing user intent in ordinary text workflows, even when prompts are noisy or indirect.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("reasoning_execution", "problem_understanding"),
          coverage("social_competence", "user_modeling")
        ],
        proofItems: [
          modeEvidence(
            "p-task-understanding-1",
            "benchmark",
            "Task-goal inference from messy instructions",
            "Hidden-answer prompt suites show strong recovery of user intent from indirect, noisy, and incomplete requests.",
            "2026-03-06"
          )
        ]
      }),
      question({
        id: "task-understanding-clarification",
        title: "Can it identify missing constraints and ask clarifying questions?",
        description:
          "Checks whether the system notices when a request is underspecified and asks the right follow-up before executing.",
        status: "met",
        confidence: "high",
        rationale:
          "Ambiguity handling is now solid in many assistant workflows when the model is allowed to pause and clarify before acting.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "problem_understanding",
            "execution_control"
          ),
          coverage("social_competence", "user_modeling")
        ],
        proofItems: [
          modeEvidence(
            "p-task-understanding-2",
            "controlled_study",
            "Clarification behavior on underspecified requests",
            "Controlled user studies show high rates of useful follow-up questions before action on incomplete enterprise tasks.",
            "2026-02-18"
          )
        ]
      }),
      question({
        id: "task-understanding-relevance",
        title: "Can it separate relevant from irrelevant information?",
        description:
          "Measures whether the system can ignore distracting context and extract the task-critical variables.",
        status: "met",
        confidence: "high",
        rationale:
          "Relevance filtering is competitive on many structured and semi-structured tasks, though high-noise adversarial settings still reduce accuracy.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("reasoning_execution", "problem_understanding"),
          coverage("robustness", "misleading_context_robustness")
        ],
        proofItems: [
          modeEvidence(
            "p-task-understanding-3",
            "leaderboard",
            "Relevant-variable extraction under distracting context",
            "Leaderboard evaluations show top systems retaining the right task variables even when prompts include decoys and irrelevant detail.",
            "2026-03-10"
          )
        ]
      }),
      question({
        id: "task-understanding-task-frame",
        title: "Can it map ambiguous requests to the right task structure?",
        description:
          "Tests whether the system chooses the correct frame for planning, retrieval, analysis, generation, or execution.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Models often choose the right frame, but still misclassify edge cases where requests could plausibly be handled in more than one way.",
        evaluationModes: ["benchmark", "expert_blind_review"],
        coverage: [
          coverage(
            "reasoning_execution",
            "problem_understanding",
            "planning_quality_adaptability"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-task-understanding-4",
            "expert_blind_review",
            "Task-frame selection for ambiguous user requests",
            "Expert raters judged many outputs well-framed, but noted persistent failures on ambiguous planning-versus-retrieval boundaries.",
            "2026-01-27"
          )
        ]
      }),
      question({
        id: "task-understanding-paraphrase",
        title: "Can it keep the same interpretation across paraphrases?",
        description:
          "Looks for stable task understanding when the same request is reworded in different ways.",
        status: "met",
        confidence: "high",
        rationale:
          "Paraphrase stability has improved materially on broad assistant tasks, especially where the intent is ordinary and the context is clean.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("reasoning_execution", "problem_understanding")
        ],
        proofItems: [
          modeEvidence(
            "p-task-understanding-5",
            "benchmark",
            "Paraphrase-stable task interpretation",
            "Repeated-query evaluation sets show stable intent interpretation across alternate phrasings of the same user goal.",
            "2026-02-12"
          )
        ]
      })
    ]
  },
  {
    id: "hard-reasoning",
    title: "AI can reason through hard problems under real constraints",
    description:
      "An AI system can solve multi-step problems, preserve logic under pressure, and adapt when constraints change midstream.",
    category: "Reasoning",
    subQuestions: [
      question({
        id: "hard-reasoning-hidden-answers",
        title: "Can it solve multi-step problems with hidden answers?",
        description:
          "Measures generalization on problems where the correct answer cannot be reverse-engineered from visible hints.",
        status: "met",
        confidence: "high",
        rationale:
          "Reasoning performance is now strong on several hidden-answer suites, although difficulty spikes still expose brittle failures.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("reasoning_execution", "multi_step_reasoning_under_constraints")
        ],
        proofItems: [
          modeEvidence(
            "p-hard-reasoning-1",
            "benchmark",
            "Hidden-answer multi-step reasoning",
            "Contamination-resistant reasoning sets show strong performance on problems that require actual stepwise solution rather than pattern recall.",
            "2026-03-08"
          )
        ]
      }),
      question({
        id: "hard-reasoning-consistency",
        title: "Can it maintain logical consistency across long chains?",
        description:
          "Tests whether intermediate claims stay mutually consistent in longer reasoning traces.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Long chains are better than before, but consistency still degrades as reasoning depth and branching increase.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "multi_step_reasoning_under_constraints"
          ),
          coverage("metacognition_ethics", "self_evaluation")
        ],
        proofItems: [
          modeEvidence(
            "p-hard-reasoning-2",
            "controlled_study",
            "Long-chain logical consistency",
            "Trace audits show meaningful gains, but still document contradiction rates rising on longer branching reasoning paths.",
            "2026-02-09"
          )
        ]
      }),
      question({
        id: "hard-reasoning-constraints",
        title: "Can it satisfy explicit constraints without dropping any?",
        description:
          "Checks whether the system respects all stated constraints rather than satisfying only the most salient ones.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Constraint tracking works well on simple settings, but omission errors remain common when tasks contain many simultaneous requirements.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage(
            "reasoning_execution",
            "multi_step_reasoning_under_constraints",
            "execution_control"
          ),
          coverage("safety_controllability", "steerability_constraint_adherence")
        ],
        proofItems: [
          modeEvidence(
            "p-hard-reasoning-3",
            "leaderboard",
            "Constraint-satisfaction under multi-rule prompts",
            "Leaderboard tracks show strong progress, but still clear performance loss once tasks exceed a moderate number of simultaneous hard constraints.",
            "2026-03-11"
          )
        ]
      }),
      question({
        id: "hard-reasoning-adaptation",
        title: "Can it adapt reasoning when constraints change?",
        description:
          "Tests whether the system updates its reasoning cleanly after new facts, constraints, or tradeoffs are introduced.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Dynamic adaptation is increasingly workable, but systems still anchor too strongly on earlier assumptions in harder cases.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("reasoning_execution", "planning_quality_adaptability")
        ],
        proofItems: [
          modeEvidence(
            "p-hard-reasoning-4",
            "benchmark",
            "Reasoning under changing task constraints",
            "Adaptive reasoning evaluations show models revising plans successfully in many cases, but not yet with robust consistency under repeated shifts.",
            "2026-01-31"
          )
        ]
      }),
      question({
        id: "hard-reasoning-justification",
        title: "Can it justify conclusions in a way that can be independently checked?",
        description:
          "Measures whether explanations expose enough structure, evidence, or intermediate logic for third parties to verify the result.",
        status: "met",
        confidence: "medium",
        rationale:
          "Systems often produce readable, checkable reasoning summaries, especially when asked to tie answers to explicit steps or evidence.",
        evaluationModes: ["expert_blind_review", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "multi_step_reasoning_under_constraints"
          ),
          coverage("epistemic_reliability", "factual_honesty")
        ],
        proofItems: [
          modeEvidence(
            "p-hard-reasoning-5",
            "expert_blind_review",
            "Checkable reasoning justifications",
            "Blinded reviewers found many model explanations sufficiently structured for independent verification, though some still overstated certainty.",
            "2026-02-22"
          )
        ]
      })
    ]
  },
  {
    id: "learning-generalization",
    title: "AI can learn new tasks quickly and generalize beyond examples",
    description:
      "An AI system can adapt from limited demonstrations and preserve competence when the task, domain, language, or input distribution changes.",
    category: "Learning",
    subQuestions: [
      question({
        id: "learning-generalization-few-shot",
        title: "Can it learn from a few examples?",
        description:
          "Measures whether the system can acquire a new task format from only a small number of demonstrations.",
        status: "met",
        confidence: "high",
        rationale:
          "Few-shot task acquisition is already strong across many structured transformation, extraction, and drafting tasks.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("learning_generalization", "in_context_learning_adaptation")
        ],
        proofItems: [
          modeEvidence(
            "p-learning-generalization-1",
            "benchmark",
            "Few-shot task acquisition",
            "Benchmark batteries show top systems learning new task formats from just a handful of examples across varied domains.",
            "2026-02-25"
          )
        ]
      }),
      question({
        id: "learning-generalization-transfer",
        title: "Can it transfer to new domains, tasks, and languages?",
        description:
          "Tests whether competence carries across context shifts without task-specific retraining.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Transfer is increasingly real, but performance still varies sharply with domain novelty and local jargon.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("learning_generalization", "transfer_generalization")
        ],
        proofItems: [
          modeEvidence(
            "p-learning-generalization-2",
            "controlled_study",
            "Cross-domain and cross-language transfer",
            "Cross-domain evaluations show meaningful transfer, but still large drops when specialized terminology or unfamiliar workflows appear.",
            "2026-01-21"
          )
        ]
      }),
      question({
        id: "learning-generalization-ood",
        title: "Can it hold up under out-of-distribution inputs?",
        description:
          "Measures whether competence survives when the deployment distribution differs from the examples used to set the task up.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Distribution shift remains one of the clearest persistent weaknesses for otherwise capable models.",
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
            "p-learning-generalization-3",
            "benchmark",
            "Out-of-distribution task retention",
            "Generalization stress tests continue to show steep degradation when task inputs depart from the setup examples used to establish the pattern.",
            "2026-03-03"
          )
        ]
      }),
      question({
        id: "learning-generalization-latent-rules",
        title: "Can it infer latent rules from demonstrations?",
        description:
          "Looks for recovery of hidden structure rather than superficial mimicry of the examples.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Rule induction is promising on moderate complexity problems, but still degrades on compositional or partially ambiguous hidden rules.",
        evaluationModes: ["benchmark", "expert_blind_review"],
        coverage: [
          coverage(
            "learning_generalization",
            "in_context_learning_adaptation"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-learning-generalization-4",
            "benchmark",
            "Latent rule inference from sparse demonstrations",
            "Rule-discovery benchmarks show real abstraction ability, but with large failure rates once hidden rules become deeply compositional.",
            "2026-02-04"
          )
        ]
      }),
      question({
        id: "learning-generalization-abstractions",
        title: "Can it form reusable abstractions instead of copying surface patterns?",
        description:
          "Tests whether the system builds task-level structure that can be reused later in a changed setting.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "There is evidence of abstraction formation, but reuse remains inconsistent once the surface form and task wrapper both change.",
        evaluationModes: ["controlled_study", "expert_blind_review"],
        coverage: [
          coverage(
            "learning_generalization",
            "long_context_memory_generalization",
            "transfer_generalization"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-learning-generalization-5",
            "expert_blind_review",
            "Reusable abstraction formation",
            "Expert review of transfer tasks found many models building partial abstractions, but not applying them robustly under larger task shifts.",
            "2026-01-29"
          )
        ]
      })
    ]
  },
  {
    id: "grounded-facts-evidence",
    title: "AI can stay grounded in facts and evidence",
    description:
      "An AI system can retrieve the right evidence, cite it correctly, avoid unsupported claims, and stay stable when context is misleading.",
    category: "Evidence & truth",
    subQuestions: [
      question({
        id: "grounded-facts-retrieval",
        title: "Can it retrieve the right supporting sources?",
        description:
          "Measures whether the system selects evidence that is actually relevant to the claim or task at hand.",
        status: "met",
        confidence: "high",
        rationale:
          "Grounded retrieval performance is now strong in many constrained workflows where evidence access is explicit and searchable.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage(
            "epistemic_reliability",
            "factual_accuracy",
            "citation_evidence_correctness"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-grounded-facts-1",
            "benchmark",
            "Evidence retrieval relevance",
            "Retrieval-grounding benchmarks show strong source selection performance for claims that have clear supporting passages or documents.",
            "2026-02-28"
          )
        ]
      }),
      question({
        id: "grounded-facts-citations",
        title: "Can it cite evidence correctly?",
        description:
          "Checks whether cited passages actually support the generated conclusion and are attributed correctly.",
        status: "met",
        confidence: "high",
        rationale:
          "Citation fidelity is increasingly dependable in constrained answer settings and evidence-centered writing tasks.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("epistemic_reliability", "citation_evidence_correctness")
        ],
        proofItems: [
          modeEvidence(
            "p-grounded-facts-2",
            "benchmark",
            "Citation fidelity under constrained evidence use",
            "Benchmark suites show high performance on tying claims to the correct supporting text rather than merely nearby passages.",
            "2026-03-01"
          )
        ]
      }),
      question({
        id: "grounded-facts-unsupported-claims",
        title: "Can it avoid unsupported claims when evidence is missing?",
        description:
          "Tests whether the system refrains from confident fabrication when the evidence base is sparse or absent.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Models are better at saying less when evidence is sparse, but unsupported claims still appear too often in open-ended settings.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage(
            "epistemic_reliability",
            "hallucination_resistance",
            "factual_honesty"
          ),
          coverage("metacognition_ethics", "abstention")
        ],
        proofItems: [
          modeEvidence(
            "p-grounded-facts-3",
            "controlled_study",
            "Unsupported-claim suppression with missing evidence",
            "Study results show better abstention and fewer fabricated details, but still meaningful unsupported-claim rates in open-domain tasks.",
            "2026-02-15"
          )
        ]
      }),
      question({
        id: "grounded-facts-consistency",
        title: "Can it stay consistent across repeated factual queries?",
        description:
          "Measures whether the same factual question receives stable answers across paraphrases, sessions, and minor context changes.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Factual consistency has improved, but drift across repeated queries and lightly altered context remains visible.",
        evaluationModes: ["benchmark", "longitudinal_trial"],
        coverage: [
          coverage("epistemic_reliability", "knowledge_consistency")
        ],
        proofItems: [
          modeEvidence(
            "p-grounded-facts-4",
            "benchmark",
            "Repeated-query factual consistency",
            "Repeated-answer benchmarks show better stability than earlier systems, but still detect answer drift under paraphrase and context shuffling.",
            "2026-01-26"
          )
        ]
      }),
      question({
        id: "grounded-facts-misinformation",
        title: "Can it resist misleading or fabricated context?",
        description:
          "Looks for robustness against false premises, poisoned retrieval, and manipulative evidence framing.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Misleading context is still a major failure mode, especially when false claims are presented with the appearance of authority.",
        evaluationModes: ["benchmark", "red_team"],
        coverage: [
          coverage(
            "epistemic_reliability",
            "misinformation_robustness",
            "hallucination_resistance"
          ),
          coverage("robustness", "misleading_context_robustness")
        ],
        proofItems: [
          modeEvidence(
            "p-grounded-facts-5",
            "red_team",
            "Resistance to fabricated or poisoned evidence context",
            "Adversarial evaluations continue to show models being pulled off course by false but authoritative-looking contextual scaffolds.",
            "2026-03-09"
          )
        ]
      })
    ]
  },
  {
    id: "self-monitoring-recovery",
    title: "AI knows when it may be wrong and can recover",
    description:
      "An AI system can estimate uncertainty, abstain when needed, detect its own errors, and improve after feedback instead of bluffing through risk.",
    category: "Self-monitoring",
    subQuestions: [
      question({
        id: "self-monitoring-calibration",
        title: "Can it produce calibrated confidence?",
        description:
          "Measures whether expressed confidence tracks actual correctness rather than sounding persuasive by default.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Calibration is improving, but many systems still sound too certain in the very cases where error rates are highest.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("metacognition_ethics", "uncertainty_calibration")
        ],
        proofItems: [
          modeEvidence(
            "p-self-monitoring-1",
            "benchmark",
            "Confidence calibration against answer correctness",
            "Calibration benchmarks show meaningful progress, but still reveal overconfidence on harder and more ambiguous tasks.",
            "2026-03-04"
          )
        ]
      }),
      question({
        id: "self-monitoring-abstention",
        title: "Can it abstain when evidence is insufficient?",
        description:
          "Tests whether the system declines or narrows an answer when the available evidence does not justify a confident response.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Abstention behavior exists, but it is still not reliably triggered in all of the cases where it should be.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("metacognition_ethics", "abstention")
        ],
        proofItems: [
          modeEvidence(
            "p-self-monitoring-2",
            "controlled_study",
            "Abstention under insufficient evidence",
            "Controlled evaluations show more frequent and more useful abstention than earlier systems, but still leave critical misses.",
            "2026-02-07"
          )
        ]
      }),
      question({
        id: "self-monitoring-contradictions",
        title: "Can it detect internal contradictions?",
        description:
          "Measures whether the system notices when its own intermediate claims or outputs conflict with one another.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Self-diagnosis works in many simpler cases, but hidden contradictions inside longer outputs still slip through too often.",
        evaluationModes: ["benchmark", "expert_blind_review"],
        coverage: [
          coverage("metacognition_ethics", "self_evaluation")
        ],
        proofItems: [
          modeEvidence(
            "p-self-monitoring-3",
            "expert_blind_review",
            "Internal contradiction detection",
            "Review panels found reliable detection of obvious inconsistencies, but weaker performance once contradictions depended on longer output context.",
            "2026-01-24"
          )
        ]
      }),
      question({
        id: "self-monitoring-self-correction",
        title: "Can it self-correct after feedback or tool results?",
        description:
          "Tests whether new evidence, critique, or tool output leads to an improved answer rather than defensive persistence.",
        status: "met",
        confidence: "high",
        rationale:
          "Explicit critique and tool feedback often lead to materially better second-pass answers in a wide range of workflows.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage("metacognition_ethics", "self_correction")
        ],
        proofItems: [
          modeEvidence(
            "p-self-monitoring-4",
            "controlled_study",
            "Second-pass improvement after critique",
            "Repeated-answer studies show strong gains after critique or tool feedback, especially on factual and coding tasks.",
            "2026-02-27"
          )
        ]
      }),
      question({
        id: "self-monitoring-escalation",
        title: "Can it escalate uncertainty instead of bluffing in high-risk cases?",
        description:
          "Measures whether the system hands off or narrows scope when risk is high and confidence is weak.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Escalation behavior is present in some high-stakes copilots, but trigger quality and consistency remain uneven.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage(
            "metacognition_ethics",
            "uncertainty_calibration",
            "abstention"
          ),
          coverage("epistemic_reliability", "factual_honesty")
        ],
        proofItems: [
          modeEvidence(
            "p-self-monitoring-5",
            "deployment_audit",
            "High-risk uncertainty escalation",
            "Operational audits show improving escalation behavior in bounded workflows, but also document cases where the model still pressed ahead too confidently.",
            "2026-03-12"
          )
        ]
      })
    ]
  }
];
