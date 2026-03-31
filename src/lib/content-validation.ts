import { MilestoneContent } from "@/types/content";

const STATUS_VALUES = new Set(["unassessed", "not_met", "in_progress", "met"]);
const CONFIDENCE_VALUES = new Set(["unassessed", "low", "medium", "high"]);
const PROOF_TYPE_VALUES = new Set([
  "benchmark",
  "leaderboard",
  "research_paper",
  "news",
  "implementation"
]);
const EVALUATION_MODE_VALUES = new Set([
  "benchmark",
  "leaderboard",
  "controlled_study",
  "deployment_audit",
  "red_team",
  "longitudinal_trial",
  "expert_blind_review"
]);

interface ValidationReport {
  errors: string[];
  warnings: string[];
}

const isNonEmptyString = (value: string) => value.trim().length > 0;

const isDateString = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const isOptionalHttpUrl = (value: string) => {
  if (!value.trim()) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const formatContentValidationErrors = (errors: string[]) =>
  errors.map((error) => `- ${error}`).join("\n");

export const validateMilestoneContents = (
  contents: MilestoneContent[]
): ValidationReport => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenMilestoneIds = new Map<string, string>();
  const seenSubQuestionIds = new Map<string, string>();
  const seenProofItemIds = new Map<string, string>();
  const seenSourceRecommendationIds = new Map<string, string>();
  const seenSortOrders = new Map<number, string>();

  if (contents.length === 0) {
    errors.push("No milestone content could be derived from the workbook.");
  }

  contents.forEach((milestone, milestoneIndex) => {
    const milestonePath = `milestones[${milestoneIndex}]`;

    if (!isNonEmptyString(milestone.id)) {
      errors.push(`${milestonePath}.id must be a non-empty string.`);
    } else if (seenMilestoneIds.has(milestone.id)) {
      errors.push(`${milestonePath}.id duplicates ${seenMilestoneIds.get(milestone.id)}.`);
    } else {
      seenMilestoneIds.set(milestone.id, milestonePath);
    }

    if (!isNonEmptyString(milestone.title)) {
      errors.push(`${milestonePath}.title must be a non-empty string.`);
    }

    if (!isNonEmptyString(milestone.description)) {
      errors.push(`${milestonePath}.description must be a non-empty string.`);
    }

    if (!isNonEmptyString(milestone.category)) {
      errors.push(`${milestonePath}.category must be a non-empty string.`);
    }

    if (!Number.isInteger(milestone.sortOrder) || milestone.sortOrder < 1) {
      errors.push(`${milestonePath}.sortOrder must be a positive integer.`);
    } else if (seenSortOrders.has(milestone.sortOrder)) {
      errors.push(
        `${milestonePath}.sortOrder duplicates ${seenSortOrders.get(milestone.sortOrder)}.`
      );
    } else {
      seenSortOrders.set(milestone.sortOrder, milestonePath);
    }

    if (!isDateString(milestone.updatedAt)) {
      errors.push(`${milestonePath}.updatedAt must be a valid YYYY-MM-DD date.`);
    }

    if (milestone.subQuestions.length === 0) {
      warnings.push(`${milestonePath} has no capabilities yet.`);
    }

    milestone.subQuestions.forEach((subQuestion, subQuestionIndex) => {
      const subQuestionPath = `${milestonePath}.subQuestions[${subQuestionIndex}]`;

      if (!isNonEmptyString(subQuestion.id)) {
        errors.push(`${subQuestionPath}.id must be a non-empty string.`);
      } else if (seenSubQuestionIds.has(subQuestion.id)) {
        errors.push(
          `${subQuestionPath}.id duplicates ${seenSubQuestionIds.get(subQuestion.id)}.`
        );
      } else {
        seenSubQuestionIds.set(subQuestion.id, subQuestionPath);
      }

      if (!isNonEmptyString(subQuestion.title)) {
        errors.push(`${subQuestionPath}.title must be a non-empty string.`);
      }

      if (!isNonEmptyString(subQuestion.description)) {
        errors.push(`${subQuestionPath}.description must be a non-empty string.`);
      }

      if (!STATUS_VALUES.has(subQuestion.status)) {
        errors.push(`${subQuestionPath}.status must be a valid status value.`);
      }

      if (!CONFIDENCE_VALUES.has(subQuestion.confidence)) {
        errors.push(`${subQuestionPath}.confidence must be a valid confidence value.`);
      }

      subQuestion.evaluationModes.forEach((mode, modeIndex) => {
        if (!EVALUATION_MODE_VALUES.has(mode)) {
          errors.push(
            `${subQuestionPath}.evaluationModes[${modeIndex}] must be a valid evaluation mode.`
          );
        }
      });

      subQuestion.coverage.forEach((coverageEntry, coverageIndex) => {
        const coveragePath = `${subQuestionPath}.coverage[${coverageIndex}]`;

        if (!isNonEmptyString(coverageEntry.dimensionId)) {
          errors.push(`${coveragePath}.dimensionId must be a non-empty string.`);
        }

        if (coverageEntry.capabilityIds.some((capabilityId) => !isNonEmptyString(capabilityId))) {
          errors.push(`${coveragePath}.capabilityIds must not contain empty values.`);
        }
      });

      subQuestion.proofItems.forEach((proofItem, proofItemIndex) => {
        const proofPath = `${subQuestionPath}.proofItems[${proofItemIndex}]`;

        if (!isNonEmptyString(proofItem.id)) {
          errors.push(`${proofPath}.id must be a non-empty string.`);
        } else if (seenProofItemIds.has(proofItem.id)) {
          errors.push(`${proofPath}.id duplicates ${seenProofItemIds.get(proofItem.id)}.`);
        } else {
          seenProofItemIds.set(proofItem.id, proofPath);
        }

        if (!PROOF_TYPE_VALUES.has(proofItem.type)) {
          errors.push(`${proofPath}.type must be a valid proof type.`);
        }

        if (!isNonEmptyString(proofItem.title)) {
          errors.push(`${proofPath}.title must be a non-empty string.`);
        }

        if (!isNonEmptyString(proofItem.source)) {
          errors.push(`${proofPath}.source must be a non-empty string.`);
        }

        if (!isOptionalHttpUrl(proofItem.url)) {
          errors.push(`${proofPath}.url must be a valid http(s) URL.`);
        }

        if (!isDateString(proofItem.date)) {
          errors.push(`${proofPath}.date must be a valid YYYY-MM-DD date.`);
        }
      });

      subQuestion.sourceRecommendations.forEach((recommendation, recommendationIndex) => {
        const recommendationPath = `${subQuestionPath}.sourceRecommendations[${recommendationIndex}]`;

        if (!isNonEmptyString(recommendation.id)) {
          errors.push(`${recommendationPath}.id must be a non-empty string.`);
        } else if (seenSourceRecommendationIds.has(recommendation.id)) {
          errors.push(
            `${recommendationPath}.id duplicates ${seenSourceRecommendationIds.get(recommendation.id)}.`
          );
        } else {
          seenSourceRecommendationIds.set(recommendation.id, recommendationPath);
        }

        if (!isNonEmptyString(recommendation.title)) {
          errors.push(`${recommendationPath}.title must be a non-empty string.`);
        }

        if (!isOptionalHttpUrl(recommendation.url)) {
          errors.push(`${recommendationPath}.url must be a valid http(s) URL.`);
        }

        if (!isOptionalHttpUrl(recommendation.secondaryUrl)) {
          errors.push(`${recommendationPath}.secondaryUrl must be a valid http(s) URL.`);
        }

        if (
          recommendation.priorityRank !== null &&
          (!Number.isInteger(recommendation.priorityRank) || recommendation.priorityRank < 1)
        ) {
          errors.push(
            `${recommendationPath}.priorityRank must be null or a positive integer.`
          );
        }
      });
    });
  });

  return { errors, warnings };
};
