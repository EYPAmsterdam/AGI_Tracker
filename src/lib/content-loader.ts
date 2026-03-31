import "server-only";

import { buildMilestoneFromContent } from "@/lib/milestone-utils";
import {
  formatContentValidationErrors,
  validateMilestoneContents
} from "@/lib/content-validation";
import { loadWorkbookMilestoneContents } from "@/lib/workbook-import";
import { EvidenceRecord, Milestone } from "@/types/agi";
import { MilestoneContent } from "@/types/content";

interface MilestoneDataset {
  milestoneContents: MilestoneContent[];
  milestones: Milestone[];
  evidenceRecords: EvidenceRecord[];
  milestoneCategories: string[];
  latestUpdatedAt: string;
  warnings: string[];
}

let cachedDataset: MilestoneDataset | null = null;
let lastWarningSignature = "";

const buildEvidenceRecords = (milestones: Milestone[]): EvidenceRecord[] =>
  milestones.flatMap((milestone) =>
    milestone.subQuestions.flatMap((subQuestion) =>
      subQuestion.proofItems.map((proofItem) => ({
        milestoneId: milestone.id,
        milestoneTitle: milestone.title,
        milestoneCategory: milestone.category,
        subQuestionId: subQuestion.id,
        subQuestionTitle: subQuestion.title,
        subQuestionStatus: subQuestion.status,
        proofItem
      }))
    )
  );

const warnOnce = (warnings: string[]) => {
  if (warnings.length === 0) {
    return;
  }

  const warningSignature = warnings.join("\n");

  if (warningSignature === lastWarningSignature) {
    return;
  }

  lastWarningSignature = warningSignature;
  console.warn(`Content warnings:\n${warnings.map((warning) => `- ${warning}`).join("\n")}`);
};

const buildMilestoneDataset = (): MilestoneDataset => {
  const workbookData = loadWorkbookMilestoneContents();
  const validationReport = validateMilestoneContents(workbookData.milestoneContents);
  const allWarnings = [...workbookData.warnings, ...validationReport.warnings];

  if (validationReport.errors.length > 0) {
    throw new Error(
      `Milestone content validation failed:\n${formatContentValidationErrors(validationReport.errors)}`
    );
  }

  const milestoneContents = [...workbookData.milestoneContents].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.title.localeCompare(right.title);
  });
  const milestones = milestoneContents.map(buildMilestoneFromContent);
  const milestoneCategories = Array.from(
    new Set(milestones.map((milestone) => milestone.category))
  ).sort((left, right) => left.localeCompare(right));
  const latestUpdatedAt =
    [...milestones]
      .map((milestone) => milestone.updatedAt)
      .sort((left, right) => right.localeCompare(left))[0] ?? "";
  const evidenceRecords = buildEvidenceRecords(milestones);

  warnOnce(allWarnings);

  return {
    milestoneContents,
    milestones,
    evidenceRecords,
    milestoneCategories,
    latestUpdatedAt,
    warnings: allWarnings
  };
};

export const getMilestoneDataset = (): MilestoneDataset => {
  if (process.env.NODE_ENV !== "development" && cachedDataset) {
    return cachedDataset;
  }

  const dataset = buildMilestoneDataset();

  if (process.env.NODE_ENV !== "development") {
    cachedDataset = dataset;
  }

  return dataset;
};
