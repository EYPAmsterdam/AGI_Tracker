import { SeedGroup, coverage, modeEvidence, question } from "@/data/seed-helpers";

export const capabilityPillarAgencySeeds: SeedGroup = [
  {
    id: "long-horizon-work",
    title: "AI can plan and complete long, multi-step work",
    description:
      "An AI system can break down complex goals, track dependencies over time, and carry work through changing conditions with limited supervision.",
    category: "Long-horizon agency",
    subQuestions: [
      question({
        id: "long-horizon-work-decompose",
        title: "Can it decompose goals into workable phases?",
        description:
          "Measures whether long projects are broken into realistic phases with meaningful checkpoints and outputs.",
        status: "met",
        confidence: "high",
        rationale:
          "Task decomposition is already one of the clearest strengths of modern agentic systems when goals are concrete and scoped.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("reasoning_execution", "planning_quality_adaptability")
        ],
        proofItems: [
          modeEvidence(
            "p-long-horizon-work-1",
            "benchmark",
            "Long-project decomposition quality",
            "Planning benchmarks show strong phase decomposition and milestone sequencing on well-specified multi-step goals.",
            "2026-02-26"
          )
        ]
      }),
      question({
        id: "long-horizon-work-state",
        title: "Can it maintain task state over long horizons?",
        description:
          "Tests whether the system preserves requirements, prior decisions, and unfinished work across extended workflows.",
        status: "not_met",
        confidence: "medium",
        rationale:
          "Long-horizon state retention is still brittle, especially once context becomes large and tasks branch.",
        evaluationModes: ["longitudinal_trial", "deployment_audit"],
        coverage: [
          coverage(
            "learning_generalization",
            "long_context_memory_generalization"
          ),
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-long-horizon-work-2",
            "longitudinal_trial",
            "State retention across extended workflows",
            "Long-run trials continue to show requirement drift and forgotten commitments over extended task horizons.",
            "2026-03-03"
          )
        ]
      }),
      question({
        id: "long-horizon-work-dependencies",
        title: "Can it track dependencies and intermediate outputs?",
        description:
          "Measures whether prerequisite work is respected and intermediate deliverables are handled in the right order.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Dependency tracking works on cleaner plans, but still misses hidden coupling and delayed prerequisites in larger workflows.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage(
            "reasoning_execution",
            "planning_quality_adaptability",
            "execution_control"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-long-horizon-work-3",
            "deployment_audit",
            "Dependency tracking in multi-step operations",
            "Operational audits show better dependency handling than earlier systems, but still document frequent misses on cross-workstream prerequisites.",
            "2026-02-11"
          )
        ]
      }),
      question({
        id: "long-horizon-work-replan",
        title: "Can it re-plan after failure or changing conditions?",
        description:
          "Tests whether the system updates its plan sensibly after delays, failed steps, or changing requirements.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Re-planning is often useful, but models still over-anchor on earlier structure when the task needs a deeper reset.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("reasoning_execution", "planning_quality_adaptability")
        ],
        proofItems: [
          modeEvidence(
            "p-long-horizon-work-4",
            "benchmark",
            "Adaptive re-planning after workflow failure",
            "Dynamic planning evaluations show strong recovery in moderate cases, but weaker restructuring once multiple assumptions break at once.",
            "2026-01-30"
          )
        ]
      }),
      question({
        id: "long-horizon-work-delivery",
        title: "Can it deliver end results with limited supervision?",
        description:
          "Measures whether the system can finish extended work with milestone-level oversight instead of dense step-by-step rescue.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Autonomous completion still drops sharply on real long-horizon work once priorities shift or errors compound.",
        evaluationModes: ["deployment_audit", "longitudinal_trial"],
        coverage: [
          coverage(
            "reasoning_execution",
            "execution_control"
          ),
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-long-horizon-work-5",
            "deployment_audit",
            "Minimal-supervision project delivery",
            "Field audits show some partial autonomy, but still document frequent human rescue on longer projects with moving requirements.",
            "2026-03-14"
          )
        ]
      })
    ]
  },
  {
    id: "digital-tool-use",
    title: "AI can use digital tools and external systems reliably",
    description:
      "An AI system can choose tools well, execute across systems, recover from failures, and use documentation to operate unfamiliar interfaces.",
    category: "Tool use",
    subQuestions: [
      question({
        id: "digital-tool-use-selection",
        title: "Can it choose the right tool for the task?",
        description:
          "Measures whether the system selects appropriate tools instead of defaulting to text-only reasoning or the wrong interface.",
        status: "met",
        confidence: "high",
        rationale:
          "Tool selection is now strong in many bounded environments where available tools and permissions are explicit.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("reasoning_execution", "tool_use_reliability")
        ],
        proofItems: [
          modeEvidence(
            "p-digital-tool-use-1",
            "benchmark",
            "Tool selection in bounded agent environments",
            "Tool-use benchmarks show high rates of correct tool choice when the task and available interfaces are clearly defined.",
            "2026-03-01"
          )
        ]
      }),
      question({
        id: "digital-tool-use-workflows",
        title: "Can it execute multi-tool workflows correctly?",
        description:
          "Tests whether the system can carry state and intent across multiple connected applications and services.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Cross-system execution is increasingly practical, but brittle handoffs and partial completion still limit reliability.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage(
            "reasoning_execution",
            "tool_use_reliability",
            "execution_control"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-digital-tool-use-2",
            "deployment_audit",
            "Cross-tool workflow execution",
            "Operational audits show good performance on bounded multi-app flows, but recurring failures when errors propagate across tools.",
            "2026-02-19"
          )
        ]
      }),
      question({
        id: "digital-tool-use-recovery",
        title: "Can it recover from tool or API failures?",
        description:
          "Measures whether the system retries, reroutes, or escalates sensibly after external failures rather than silently stalling.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Recovery patterns exist, but robust failure handling remains one of the main gaps between demos and production-grade autonomy.",
        evaluationModes: ["deployment_audit", "longitudinal_trial"],
        coverage: [
          coverage("reasoning_execution", "tool_use_reliability"),
          coverage("robustness", "long_horizon_drift_resistance")
        ],
        proofItems: [
          modeEvidence(
            "p-digital-tool-use-3",
            "deployment_audit",
            "Tool and API failure recovery",
            "Agent traces show partial recovery behavior, but still frequent stalls and incorrect retries after external system failures.",
            "2026-03-07"
          )
        ]
      }),
      question({
        id: "digital-tool-use-docs",
        title: "Can it learn new tools from documentation?",
        description:
          "Tests whether the system can read docs, infer usage patterns, and apply them correctly in a live task.",
        status: "met",
        confidence: "high",
        rationale:
          "Documentation-grounded tool use is already one of the better developed areas of practical agent performance.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage(
            "reasoning_execution",
            "tool_use_reliability"
          ),
          coverage("learning_generalization", "transfer_generalization")
        ],
        proofItems: [
          modeEvidence(
            "p-digital-tool-use-4",
            "leaderboard",
            "Documentation-grounded tool adoption",
            "Leaderboard results show top systems learning unfamiliar APIs and tool flows directly from documentation with modest correction.",
            "2026-03-12"
          )
        ]
      }),
      question({
        id: "digital-tool-use-audit-trail",
        title: "Can it leave an auditable trail of actions taken?",
        description:
          "Measures whether external actions, intermediate states, and decisions can be reconstructed after the fact.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Action logging is increasingly feasible, but trace quality and completeness still vary a lot across agent setups.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage("reasoning_execution", "execution_control")
        ],
        proofItems: [
          modeEvidence(
            "p-digital-tool-use-5",
            "deployment_audit",
            "Auditable action traces for agent workflows",
            "Trace audits show improving visibility into tool actions, though missing state transitions still limit full reconstruction.",
            "2026-02-24"
          )
        ]
      })
    ]
  },
  {
    id: "professional-software",
    title: "AI can build and maintain software at a professional level",
    description:
      "An AI system can implement, debug, refactor, architect, and sustain software work at a level useful to experienced engineers.",
    category: "Software",
    subQuestions: [
      question({
        id: "professional-software-hidden-tests",
        title: "Can it write code that passes hidden tests?",
        description:
          "Measures whether generated code generalizes beyond visible examples and public benchmark contamination.",
        status: "met",
        confidence: "high",
        rationale:
          "Strong code models now solve a large share of hidden-test implementation tasks across common software domains.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage("reasoning_execution", "code_task_execution")
        ],
        proofItems: [
          modeEvidence(
            "p-professional-software-1",
            "benchmark",
            "Hidden-test software implementation",
            "Contamination-resistant coding suites show strong hidden-test pass rates on many focused implementation tasks.",
            "2026-03-05"
          )
        ]
      }),
      question({
        id: "professional-software-debug",
        title: "Can it debug unfamiliar repositories?",
        description:
          "Tests whether the system can localize faults and patch them in codebases it has not seen before.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Repository debugging is improving quickly, but still struggles on architecture-heavy bugs and subtle multi-file regressions.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("reasoning_execution", "code_task_execution")
        ],
        proofItems: [
          modeEvidence(
            "p-professional-software-2",
            "benchmark",
            "Debugging unfamiliar repositories",
            "Repository debugging benchmarks show strong progress, but still leave meaningful gaps on dependency and state-management failures.",
            "2026-02-16"
          )
        ]
      }),
      question({
        id: "professional-software-refactor",
        title: "Can it refactor without breaking behavior?",
        description:
          "Measures whether code changes preserve external behavior instead of only improving local style or structure.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Refactoring quality is often good when tests are strong, but behavior-preserving change remains unreliable on messier codebases.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("reasoning_execution", "code_task_execution")
        ],
        proofItems: [
          modeEvidence(
            "p-professional-software-3",
            "deployment_audit",
            "Behavior-preserving refactor safety",
            "Code audits show useful cleanup and modularization, but still document regression risk on poorly covered systems.",
            "2026-03-09"
          )
        ]
      }),
      question({
        id: "professional-software-architecture",
        title: "Can it design reasonable architectures for real requirements?",
        description:
          "Tests whether the system proposes structures that reflect real tradeoffs, not only textbook decompositions.",
        status: "met",
        confidence: "medium",
        rationale:
          "Architecture proposals are often credible for small and mid-sized systems, though still need human judgment for long-term fit.",
        evaluationModes: ["expert_blind_review", "controlled_study"],
        coverage: [
          coverage(
            "reasoning_execution",
            "planning_quality_adaptability",
            "code_task_execution"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-professional-software-4",
            "expert_blind_review",
            "Architecture quality under real product constraints",
            "Senior engineer review panels judged many generated architectures workable, but not yet consistently strong on deeper platform tradeoffs.",
            "2026-01-20"
          )
        ]
      }),
      question({
        id: "professional-software-shipping",
        title: "Can it ship and maintain a working small application?",
        description:
          "Measures whether the system can carry a real app through build, release, and follow-up maintenance loops.",
        status: "not_met",
        confidence: "low",
        rationale:
          "Shipping small apps is feasible in demos, but dependable release hardening and maintenance still require heavy human ownership.",
        evaluationModes: ["deployment_audit", "longitudinal_trial"],
        coverage: [
          coverage(
            "reasoning_execution",
            "code_task_execution",
            "execution_control"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-professional-software-5",
            "deployment_audit",
            "Small-app shipping and maintenance",
            "Real project audits show promising build completion, but still document repeated human intervention at deployment and maintenance stages.",
            "2026-03-15"
          )
        ]
      })
    ]
  },
  {
    id: "multimodal-world-understanding",
    title: "AI can understand the world across text, images, audio, video, documents, and space",
    description:
      "An AI system can combine language with visual, document, temporal, and spatial evidence into one coherent understanding of the task and world state.",
    category: "Multimodal understanding",
    subQuestions: [
      question({
        id: "multimodal-world-understanding-grounding",
        title: "Can it ground language to visual or audio evidence?",
        description:
          "Measures whether the system can connect verbal claims or instructions to the correct parts of an image, screen, or audio trace.",
        status: "met",
        confidence: "high",
        rationale:
          "Grounding performance is already strong enough to support many document, inspection, and interface-centered workflows.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage(
            "multimodal_understanding",
            "cross_modal_grounding"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-multimodal-world-understanding-1",
            "benchmark",
            "Cross-modal grounding to image and audio evidence",
            "Grounding benchmarks show strong performance on tying language to the right regions, events, and perceptual cues.",
            "2026-03-02"
          )
        ]
      }),
      question({
        id: "multimodal-world-understanding-documents",
        title: "Can it reason over screenshots, documents, and forms?",
        description:
          "Tests whether the system can extract and use meaning from dense visual documents and real interface artifacts.",
        status: "met",
        confidence: "high",
        rationale:
          "Document and screen understanding is one of the more deployment-ready multimodal capabilities already visible in practice.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage(
            "multimodal_understanding",
            "multimodal_information_extraction"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-multimodal-world-understanding-2",
            "deployment_audit",
            "Reasoning over screenshots and forms",
            "Operational audits show strong extraction and reasoning performance on dashboards, forms, and scanned document workflows.",
            "2026-02-21"
          )
        ]
      }),
      question({
        id: "multimodal-world-understanding-synthesis",
        title: "Can it combine multiple modalities into one coherent conclusion?",
        description:
          "Measures whether text, images, charts, and other signals are integrated rather than treated as unrelated fragments.",
        status: "met",
        confidence: "high",
        rationale:
          "Cross-modal evidence synthesis is already strong in many analysis tasks when the sources are legible and the objective is clear.",
        evaluationModes: ["benchmark", "controlled_study"],
        coverage: [
          coverage("multimodal_understanding", "multimodal_reasoning")
        ],
        proofItems: [
          modeEvidence(
            "p-multimodal-world-understanding-3",
            "benchmark",
            "Multimodal evidence synthesis",
            "Case-based multimodal benchmarks show strong integration of text, image, and chart evidence into unified conclusions.",
            "2026-03-08"
          )
        ]
      }),
      question({
        id: "multimodal-world-understanding-video",
        title: "Can it track state across temporal sequences?",
        description:
          "Tests whether the system can reason about events and changes that unfold over time rather than in a single frame.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Temporal reasoning is clearly improving, but still lags behind static-image and document understanding.",
        evaluationModes: ["benchmark", "deployment_audit"],
        coverage: [
          coverage("multimodal_understanding", "multimodal_reasoning")
        ],
        proofItems: [
          modeEvidence(
            "p-multimodal-world-understanding-4",
            "benchmark",
            "Temporal state tracking over video-like sequences",
            "Temporal sequence benchmarks show useful progress, but still material misses when key changes are subtle or long-range.",
            "2026-02-13"
          )
        ]
      }),
      question({
        id: "multimodal-world-understanding-spatial",
        title: "Can it solve spatial and diagrammatic reasoning tasks?",
        description:
          "Measures reasoning over geometry, layout, diagrams, and visually structured state.",
        status: "met",
        confidence: "high",
        rationale:
          "Spatial and diagram reasoning is now strong on many benchmarked tasks, especially when the representation is explicit.",
        evaluationModes: ["benchmark", "leaderboard"],
        coverage: [
          coverage(
            "multimodal_understanding",
            "spatial_reasoning"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-multimodal-world-understanding-5",
            "leaderboard",
            "Spatial and diagrammatic reasoning",
            "Leaderboard evaluations show top multimodal systems solving a large share of diagram, chart, and spatial-relation tasks.",
            "2026-03-13"
          )
        ]
      })
    ]
  },
  {
    id: "human-interaction",
    title: "AI can interact with people appropriately and work with them",
    description:
      "An AI system can model people well enough to communicate clearly, adapt to their context, and collaborate without creating avoidable confusion or friction.",
    category: "Human interaction",
    subQuestions: [
      question({
        id: "human-interaction-user-modeling",
        title: "Can it model user goals and knowledge level?",
        description:
          "Measures whether the system infers what the user is trying to do and how much context or explanation they need.",
        status: "met",
        confidence: "high",
        rationale:
          "User modeling is already strong in many bounded assistant settings, especially where interaction history is short and goals are practical.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage("social_competence", "user_modeling")
        ],
        proofItems: [
          modeEvidence(
            "p-human-interaction-1",
            "controlled_study",
            "User-goal and knowledge-level inference",
            "Controlled interaction studies show strong performance in identifying user intent and choosing an appropriate explanation depth.",
            "2026-02-20"
          )
        ]
      }),
      question({
        id: "human-interaction-tone",
        title: "Can it adapt tone and explanation to its audience?",
        description:
          "Tests whether the system can shift style, depth, and framing without losing task correctness.",
        status: "met",
        confidence: "high",
        rationale:
          "Tone adaptation is one of the most mature and consistently high-rated aspects of current conversational models.",
        evaluationModes: ["controlled_study", "expert_blind_review"],
        coverage: [
          coverage("social_competence", "interaction_quality")
        ],
        proofItems: [
          modeEvidence(
            "p-human-interaction-2",
            "expert_blind_review",
            "Audience-adapted tone and explanation",
            "Blinded reviewers consistently rate top systems highly on style adaptation across novice, expert, and stressed-user scenarios.",
            "2026-03-05"
          )
        ]
      }),
      question({
        id: "human-interaction-recognition",
        title: "Can it recognize confusion, frustration, or disagreement?",
        description:
          "Measures whether the system can detect negative conversational states before the interaction breaks down.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Detection is increasingly useful on explicit cues, but quieter forms of frustration and disagreement remain easy to miss.",
        evaluationModes: ["controlled_study", "deployment_audit"],
        coverage: [
          coverage(
            "social_competence",
            "emotion_affect_handling",
            "interaction_quality"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-human-interaction-3",
            "deployment_audit",
            "Detection of confusion and frustration in live chats",
            "Conversation audits show improving recognition of explicit frustration, but still document late recognition of subtle confusion and disagreement.",
            "2026-02-08"
          )
        ]
      }),
      question({
        id: "human-interaction-collaboration",
        title: "Can it handle collaboration and handoff well?",
        description:
          "Tests whether the system can maintain shared context, divide work, and hand off cleanly to people when needed.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Collaborative behavior is promising, but real-world handoffs still fail when context is implicit or the workflow spans multiple people and tools.",
        evaluationModes: ["deployment_audit", "controlled_study"],
        coverage: [
          coverage(
            "social_competence",
            "interaction_quality",
            "perspective_taking"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-human-interaction-4",
            "deployment_audit",
            "Collaboration and handoff quality",
            "Operational evaluations show better collaboration structure and note quality, but still expose weak handoffs across larger multi-person workflows.",
            "2026-03-09"
          )
        ]
      }),
      question({
        id: "human-interaction-nuance",
        title: "Can it interpret nuance, implied meaning, and differing perspectives?",
        description:
          "Measures pragmatic understanding beyond literal surface meaning in social and cooperative settings.",
        status: "in_progress",
        confidence: "medium",
        rationale:
          "Nuance handling is clearly better than before, but still inconsistent in culturally loaded, indirect, or high-context exchanges.",
        evaluationModes: ["expert_blind_review", "controlled_study"],
        coverage: [
          coverage(
            "social_competence",
            "perspective_taking",
            "emotion_affect_handling"
          )
        ],
        proofItems: [
          modeEvidence(
            "p-human-interaction-5",
            "expert_blind_review",
            "Nuance and perspective interpretation",
            "Expert interaction panels found many strong responses, but still documented noticeable gaps on indirect meaning and subtle perspective shifts.",
            "2026-01-28"
          )
        ]
      })
    ]
  }
];
