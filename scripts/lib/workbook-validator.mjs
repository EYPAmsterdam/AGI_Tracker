import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

export const WORKBOOK_RELATIVE_PATH = path.join(
  "content",
  "workbook",
  "AGI benchmark mapping.xlsx"
);

export const SHEET_NAMES = {
  questions: "Questions",
  evidence: "Evidence"
};

export const QUESTIONS_HEADERS = [
  "dimension_id",
  "dimension_title",
  "dimension_description",
  "dimension_category",
  "dimension_sort_order",
  "question_id",
  "question_sort_order",
  "question_title",
  "question_description",
  "status",
  "confidence",
  "rationale",
  "evaluation_modes",
  "assessment_updated_at",
  "recommended_source_1_title",
  "recommended_source_1_url",
  "recommended_source_1_note",
  "recommended_source_2_title",
  "recommended_source_2_url",
  "recommended_source_2_note"
];

export const EVIDENCE_HEADERS = [
  "evidence_id",
  "question_id",
  "evidence_title",
  "source_type",
  "source_name",
  "url",
  "published_date",
  "short_explanation",
  "metric_name",
  "metric_value",
  "metric_unit",
  "model",
  "notes",
  "active"
];

const VALID_STATUS_VALUES = new Set([
  "unassessed",
  "not met",
  "in progress",
  "met"
]);

const VALID_CONFIDENCE_VALUES = new Set([
  "unassessed",
  "low",
  "medium",
  "high"
]);

const VALID_EVALUATION_MODES = new Set([
  "benchmark",
  "leaderboard",
  "controlled study",
  "deployment audit",
  "red team",
  "red team evaluation",
  "longitudinal trial",
  "expert blind review"
]);

const VALID_SOURCE_TYPES = new Set([
  "benchmark",
  "leaderboard",
  "research paper",
  "news",
  "implementation"
]);

const toCellString = (value) => String(value ?? "").trim();

const normalizeKey = (value) =>
  toCellString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const splitList = (value) =>
  toCellString(value)
    .split(/\r?\n|;/)
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

const isDateString = (value) => {
  const trimmed = toCellString(value);

  if (!trimmed) {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return false;
  }

  const [year, month, day] = trimmed.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const isOptionalDateString = (value) => {
  const trimmed = toCellString(value);
  return trimmed === "" || isDateString(trimmed);
};

const isOptionalHttpUrl = (value) => {
  const trimmed = toCellString(value);

  if (!trimmed) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isActiveEvidenceRow = (value) => {
  const normalized = normalizeKey(value);
  return normalized === "" || normalized === "yes" || normalized === "true" || normalized === "1";
};

const getSheetHeaders = (sheet) => {
  const rows = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: ""
  });

  return (rows[0] ?? []).map((value) => toCellString(value)).filter(Boolean);
};

const readRows = (sheet) =>
  xlsx.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false
  });

const isMeaningfulRow = (row) =>
  Object.values(row).some((value) => toCellString(value).length > 0);

const pushMissingHeaderErrors = (errors, sheetName, headers, requiredHeaders) => {
  const headerSet = new Set(headers);
  const missingHeaders = requiredHeaders.filter((header) => !headerSet.has(header));

  if (missingHeaders.length > 0) {
    errors.push(`${sheetName} is missing required columns: ${missingHeaders.join(", ")}`);
  }
};

export const resolveWorkbookPath = (projectRoot) =>
  path.join(projectRoot, WORKBOOK_RELATIVE_PATH);

export const validateWorkbookData = ({
  questionHeaders,
  evidenceHeaders,
  questionRows: rawQuestionRows,
  evidenceRows: rawEvidenceRows,
  hasQuestionsSheet,
  hasEvidenceSheet
}) => {
  const questionRows = rawQuestionRows.filter(isMeaningfulRow);
  const evidenceRows = rawEvidenceRows.filter(isMeaningfulRow);
  const errors = [];
  const warnings = [];
  const dimensionPaths = new Map();
  const questionPaths = new Map();
  const questionToDimension = new Map();
  const evidencePaths = new Map();
  const dimensionSnapshots = new Map();
  const activeEvidenceRows = evidenceRows.filter((row) => isActiveEvidenceRow(row.active));
  const summary = {
    milestones: 0,
    questions: questionRows.length,
    evidenceEntries: activeEvidenceRows.length
  };

  if (!hasQuestionsSheet) {
    errors.push(`${SHEET_NAMES.questions} is missing.`);
  } else {
    pushMissingHeaderErrors(errors, SHEET_NAMES.questions, questionHeaders, QUESTIONS_HEADERS);
  }

  if (!hasEvidenceSheet) {
    errors.push(`${SHEET_NAMES.evidence} is missing.`);
  } else {
    pushMissingHeaderErrors(errors, SHEET_NAMES.evidence, evidenceHeaders, EVIDENCE_HEADERS);
  }

  if (questionRows.length === 0) {
    errors.push(`${SHEET_NAMES.questions} does not contain any question rows.`);
  }

  questionRows.forEach((row, index) => {
    const pathLabel = `${SHEET_NAMES.questions}[${index + 2}]`;
    const dimensionId = toCellString(row.dimension_id);
    const dimensionTitle = toCellString(row.dimension_title);
    const dimensionDescription = toCellString(row.dimension_description);
    const dimensionCategory = toCellString(row.dimension_category);
    const dimensionSortOrder = Number.parseInt(toCellString(row.dimension_sort_order), 10);
    const questionId = toCellString(row.question_id);
    const questionSortOrder = Number.parseInt(toCellString(row.question_sort_order), 10);
    const questionTitle = toCellString(row.question_title);
    const questionDescription = toCellString(row.question_description);
    const status = normalizeKey(row.status);
    const confidence = normalizeKey(row.confidence);
    const evaluationModes = splitList(row.evaluation_modes).map((value) => normalizeKey(value));
    const assessmentUpdatedAt = toCellString(row.assessment_updated_at);
    const recommendationUrls = [
      toCellString(row.recommended_source_1_url),
      toCellString(row.recommended_source_2_url)
    ];

    if (!dimensionId) {
      errors.push(`${pathLabel} is missing dimension_id.`);
    }

    if (!dimensionTitle) {
      errors.push(`${pathLabel} is missing dimension_title.`);
    }

    if (!dimensionDescription) {
      errors.push(`${pathLabel} is missing dimension_description.`);
    }

    if (!dimensionCategory) {
      errors.push(`${pathLabel} is missing dimension_category.`);
    }

    if (!Number.isInteger(dimensionSortOrder) || dimensionSortOrder < 1) {
      errors.push(`${pathLabel} has an invalid dimension_sort_order.`);
    }

    if (!questionId) {
      errors.push(`${pathLabel} is missing question_id.`);
    } else if (questionPaths.has(questionId)) {
      errors.push(`${pathLabel} duplicates question_id from ${questionPaths.get(questionId)}.`);
    } else {
      questionPaths.set(questionId, pathLabel);
      questionToDimension.set(questionId, dimensionId);
    }

    if (!Number.isInteger(questionSortOrder) || questionSortOrder < 1) {
      errors.push(`${pathLabel} has an invalid question_sort_order.`);
    }

    if (!questionTitle) {
      errors.push(`${pathLabel} is missing question_title.`);
    }

    if (!questionDescription) {
      errors.push(`${pathLabel} is missing question_description.`);
    }

    if (!VALID_STATUS_VALUES.has(status)) {
      errors.push(`${pathLabel} has an invalid status.`);
    }

    if (!VALID_CONFIDENCE_VALUES.has(confidence)) {
      errors.push(`${pathLabel} has an invalid confidence.`);
    }

    if (assessmentUpdatedAt && !isOptionalDateString(assessmentUpdatedAt)) {
      errors.push(`${pathLabel} has an invalid assessment_updated_at.`);
    }

    const invalidModes = evaluationModes.filter((value) => !VALID_EVALUATION_MODES.has(value));

    if (invalidModes.length > 0) {
      errors.push(`${pathLabel} has invalid evaluation_modes: ${invalidModes.join(", ")}.`);
    }

    recommendationUrls.forEach((url, recommendationIndex) => {
      if (!isOptionalHttpUrl(url)) {
        errors.push(
          `${pathLabel} has an invalid recommended_source_${recommendationIndex + 1}_url.`
        );
      }
    });

    if (dimensionId) {
      const existingSnapshot = dimensionSnapshots.get(dimensionId);
      const currentSnapshot = {
        dimensionTitle,
        dimensionDescription,
        dimensionCategory,
        dimensionSortOrder
      };

      if (!existingSnapshot) {
        dimensionSnapshots.set(dimensionId, currentSnapshot);
        dimensionPaths.set(dimensionId, pathLabel);
      } else {
        if (existingSnapshot.dimensionTitle !== currentSnapshot.dimensionTitle) {
          errors.push(
            `${pathLabel} changes dimension_title for ${dimensionId}; first seen at ${dimensionPaths.get(dimensionId)}.`
          );
        }

        if (existingSnapshot.dimensionDescription !== currentSnapshot.dimensionDescription) {
          errors.push(
            `${pathLabel} changes dimension_description for ${dimensionId}; first seen at ${dimensionPaths.get(dimensionId)}.`
          );
        }

        if (existingSnapshot.dimensionCategory !== currentSnapshot.dimensionCategory) {
          errors.push(
            `${pathLabel} changes dimension_category for ${dimensionId}; first seen at ${dimensionPaths.get(dimensionId)}.`
          );
        }

        if (existingSnapshot.dimensionSortOrder !== currentSnapshot.dimensionSortOrder) {
          errors.push(
            `${pathLabel} changes dimension_sort_order for ${dimensionId}; first seen at ${dimensionPaths.get(dimensionId)}.`
          );
        }
      }
    }
  });

  summary.milestones = dimensionSnapshots.size;

  activeEvidenceRows.forEach((row, index) => {
    const pathLabel = `${SHEET_NAMES.evidence}[${index + 2}]`;
    const evidenceId = toCellString(row.evidence_id);
    const questionId = toCellString(row.question_id);
    const evidenceTitle = toCellString(row.evidence_title);
    const sourceType = normalizeKey(row.source_type);
    const sourceName = toCellString(row.source_name);
    const url = toCellString(row.url);
    const publishedDate = toCellString(row.published_date);

    if (!evidenceId) {
      errors.push(`${pathLabel} is missing evidence_id.`);
    } else if (evidencePaths.has(evidenceId)) {
      errors.push(`${pathLabel} duplicates evidence_id from ${evidencePaths.get(evidenceId)}.`);
    } else {
      evidencePaths.set(evidenceId, pathLabel);
    }

    if (!questionId) {
      errors.push(`${pathLabel} is missing question_id.`);
    } else if (!questionToDimension.has(questionId)) {
      errors.push(`${pathLabel} references unknown question_id "${questionId}".`);
    }

    if (!evidenceTitle) {
      errors.push(`${pathLabel} is missing evidence_title.`);
    }

    if (!VALID_SOURCE_TYPES.has(sourceType)) {
      errors.push(`${pathLabel} has an invalid source_type.`);
    }

    if (!sourceName) {
      errors.push(`${pathLabel} is missing source_name.`);
    }

    if (!url) {
      errors.push(`${pathLabel} is missing url.`);
    } else if (!isOptionalHttpUrl(url)) {
      errors.push(`${pathLabel} has an invalid url.`);
    }

    if (publishedDate && !isDateString(publishedDate)) {
      errors.push(`${pathLabel} has an invalid published_date.`);
    }
  });

  if (summary.evidenceEntries === 0) {
    warnings.push(
      `${SHEET_NAMES.evidence} currently has no published evidence rows. This is valid for the MVP until you start filling evidence entries manually.`
    );
  }

  return { errors, warnings, summary };
};

export const validateWorkbook = (projectRoot) => {
  const workbookPath = resolveWorkbookPath(projectRoot);

  if (!fs.existsSync(workbookPath)) {
    return {
      workbookPath,
      errors: [`Workbook not found: ${workbookPath}`],
      warnings: [],
      summary: {
        milestones: 0,
        questions: 0,
        evidenceEntries: 0
      }
    };
  }

  const workbook = xlsx.readFile(workbookPath, {
    cellDates: false
  });
  const questionsSheet = workbook.Sheets[SHEET_NAMES.questions];
  const evidenceSheet = workbook.Sheets[SHEET_NAMES.evidence];
  const questionHeaders = questionsSheet ? getSheetHeaders(questionsSheet) : [];
  const evidenceHeaders = evidenceSheet ? getSheetHeaders(evidenceSheet) : [];
  const questionRows = questionsSheet ? readRows(questionsSheet) : [];
  const evidenceRows = evidenceSheet ? readRows(evidenceSheet) : [];

  const report = validateWorkbookData({
    questionHeaders,
    evidenceHeaders,
    questionRows,
    evidenceRows,
    hasQuestionsSheet: Boolean(questionsSheet),
    hasEvidenceSheet: Boolean(evidenceSheet)
  });

  return {
    workbookPath,
    ...report
  };
};

export const formatWorkbookValidationReport = ({ workbookPath, summary, warnings, errors }) => {
  const lines = [
    `Workbook: ${workbookPath}`,
    `Validated ${summary.milestones} dimensions, ${summary.questions} questions, and ${summary.evidenceEntries} published evidence entries.`
  ];

  if (warnings.length > 0) {
    lines.push("Warnings:");
    warnings.forEach((warning) => lines.push(`- ${warning}`));
  }

  if (errors.length > 0) {
    lines.push("Errors:");
    errors.forEach((error) => lines.push(`- ${error}`));
  }

  return lines.join("\n");
};
