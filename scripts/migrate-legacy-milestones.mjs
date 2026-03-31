import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateStaticExpression,
  findConstInitializer,
  parseTypeScriptSourceFile
} from "./lib/ts-static-evaluator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const legacySeedFiles = [
  {
    filePath: path.join(projectRoot, "src", "data", "seeds", "capability-pillars-foundations.ts"),
    constName: "capabilityPillarFoundationSeeds"
  },
  {
    filePath: path.join(projectRoot, "src", "data", "seeds", "capability-pillars-agency.ts"),
    constName: "capabilityPillarAgencySeeds"
  },
  {
    filePath: path.join(projectRoot, "src", "data", "seeds", "capability-pillars-advanced.ts"),
    constName: "capabilityPillarAdvancedSeeds"
  }
];
const outputDirectory = path.join(projectRoot, "content", "milestones");

const proofTypeFromMode = {
  benchmark: "benchmark",
  leaderboard: "leaderboard",
  controlled_study: "research_paper",
  deployment_audit: "implementation",
  red_team: "benchmark",
  longitudinal_trial: "research_paper",
  expert_blind_review: "research_paper"
};

const sourceFromMode = {
  benchmark: "Open Capability Benchmark Consortium",
  leaderboard: "Frontier Evaluation Arena",
  controlled_study: "Center for Applied AI Evaluation",
  deployment_audit: "Operational AI Audit Lab",
  red_team: "Model Red-Team Exchange",
  longitudinal_trial: "Long-Run Systems Study Group",
  expert_blind_review: "Expert Review Panel on AI Performance"
};

const titlePrefixFromMode = {
  benchmark: "Benchmark suite",
  leaderboard: "Leaderboard",
  controlled_study: "Controlled study",
  deployment_audit: "Deployment audit",
  red_team: "Red-team evaluation",
  longitudinal_trial: "Longitudinal trial",
  expert_blind_review: "Expert blind review"
};

const urlRootFromMode = {
  benchmark: "benchmarks",
  leaderboard: "leaderboards",
  controlled_study: "studies",
  deployment_audit: "audits",
  red_team: "red-team",
  longitudinal_trial: "trials",
  expert_blind_review: "expert-review"
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const modeEvidence = (id, mode, topic, shortExplanation, date) => ({
  id,
  type: proofTypeFromMode[mode],
  title: `${titlePrefixFromMode[mode]}: ${topic}`,
  source: sourceFromMode[mode],
  url: `https://capability-evals.example/${urlRootFromMode[mode]}/${slugify(topic)}`,
  shortExplanation,
  date
});

const evaluateSeedGroup = ({ filePath, constName }) => {
  const sourceFile = parseTypeScriptSourceFile(filePath);
  const initializer = findConstInitializer(sourceFile, constName);

  return evaluateStaticExpression(initializer, {
    sourceFile,
    callHandlers: {
      question: ({ node, evaluate }) => evaluate(node.arguments[0]),
      coverage: ({ node, evaluate }) => {
        const [dimensionId, ...capabilityIds] = node.arguments.map((argument) =>
          evaluate(argument)
        );

        return { dimensionId, capabilityIds };
      },
      modeEvidence: ({ node, evaluate }) => {
        const [id, mode, topic, shortExplanation, date] = node.arguments.map((argument) =>
          evaluate(argument)
        );

        return modeEvidence(id, mode, topic, shortExplanation, date);
      }
    }
  });
};

const deriveUpdatedAt = (milestone) => {
  const proofDates = milestone.subQuestions.flatMap((subQuestion) =>
    subQuestion.proofItems.map((proofItem) => proofItem.date)
  );

  const latestProofDate = [...proofDates].sort((left, right) => right.localeCompare(left))[0];

  if (!latestProofDate) {
    throw new Error(`Milestone "${milestone.id}" has no proof item dates.`);
  }

  return latestProofDate;
};

const writeMilestoneContentFiles = (milestones) => {
  fs.mkdirSync(outputDirectory, { recursive: true });

  milestones.forEach((milestone, index) => {
    const sortOrder = index + 1;
    const milestoneContent = {
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      category: milestone.category,
      sortOrder,
      updatedAt: deriveUpdatedAt(milestone),
      subQuestions: milestone.subQuestions
    };
    const fileName = `${String(sortOrder).padStart(2, "0")}-${milestone.id}.json`;
    const outputPath = path.join(outputDirectory, fileName);

    fs.writeFileSync(outputPath, `${JSON.stringify(milestoneContent, null, 2)}\n`, "utf8");
  });
};

const milestoneSeeds = legacySeedFiles.flatMap(evaluateSeedGroup);
writeMilestoneContentFiles(milestoneSeeds);

console.log(`Wrote ${milestoneSeeds.length} milestone content files to ${outputDirectory}.`);
