import "server-only";

import fs from "node:fs";
import path from "node:path";
import * as xlsx from "xlsx";
import {
  Confidence,
  EvaluationMode,
  ProofItem,
  ProofType,
  SourceRecommendation,
  Status
} from "@/types/agi";
import { MilestoneContent } from "@/types/content";

xlsx.set_fs(fs);

const workbookPath = path.join(
  process.cwd(),
  "content",
  "workbook",
  "AGI benchmark mapping.xlsx"
);

const SHEET_NAMES = {
  questions: "Questions",
  evidence: "Evidence"
} as const;

const QUESTIONS_HEADERS = [
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
] as const;

const EVIDENCE_HEADERS = [
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
] as const;

type WorkbookValidationResult = {
  milestoneContents: MilestoneContent[];
  warnings: string[];
  workbookPath: string;
  workbookUpdatedAt: string;
};

type QuestionRow = {
  dimensionId: string;
  dimensionTitle: string;
  dimensionDescription: string;
  dimensionCategory: string;
  dimensionSortOrder: number;
  questionId: string;
  questionSortOrder: number;
  questionTitle: string;
  questionDescription: string;
  status: Status;
  confidence: Confidence;
  rationale: string;
  evaluationModes: EvaluationMode[];
  assessmentUpdatedAt: string;
  recommendedSource1Title: string;
  recommendedSource1Url: string;
  recommendedSource1Note: string;
  recommendedSource2Title: string;
  recommendedSource2Url: string;
  recommendedSource2Note: string;
};

type EvidenceRow = {
  evidenceId: string;
  questionId: string;
  evidenceTitle: string;
  sourceType: string;
  sourceName: string;
  url: string;
  publishedDate: string;
  shortExplanation: string;
  metricName: string;
  metricValue: string;
  metricUnit: string;
  model: string;
  notes: string;
  active: boolean;
};

const toCellString = (value: unknown) => String(value ?? "").trim();

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const splitList = (value: string) =>
  value
    .split(/\r?\n|;/)
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

const toIsoDateString = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
};

const toPositiveInteger = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
};

const toYesNoBoolean = (value: string) => {
  const normalized = normalizeKey(value);
  return normalized === "" || normalized === "yes" || normalized === "true" || normalized === "1";
};

const parseStatus = (value: string): Status => {
  const normalized = normalizeKey(value);

  if (normalized === "met") {
    return "met";
  }

  if (normalized === "in progress") {
    return "in_progress";
  }

  if (normalized === "not met") {
    return "not_met";
  }

  return "unassessed";
};

const parseConfidence = (value: string): Confidence => {
  const normalized = normalizeKey(value);

  if (normalized === "high") {
    return "high";
  }

  if (normalized === "medium") {
    return "medium";
  }

  if (normalized === "low") {
    return "low";
  }

  return "unassessed";
};

const parseEvaluationModes = (value: string): EvaluationMode[] => {
  const modes = splitList(value)
    .map((entry) => normalizeKey(entry))
    .map((entry) => {
      if (entry === "benchmark") {
        return "benchmark";
      }

      if (entry === "leaderboard") {
        return "leaderboard";
      }

      if (entry === "controlled study") {
        return "controlled_study";
      }

      if (entry === "deployment audit") {
        return "deployment_audit";
      }

      if (entry === "red team" || entry === "red team evaluation") {
        return "red_team";
      }

      if (entry === "longitudinal trial") {
        return "longitudinal_trial";
      }

      if (entry === "expert blind review") {
        return "expert_blind_review";
      }

      return null;
    })
    .filter((mode): mode is EvaluationMode => mode !== null);

  return Array.from(new Set(modes));
};

const parseProofType = (value: string): ProofType => {
  const normalized = normalizeKey(value);

  if (normalized.includes("leaderboard")) {
    return "leaderboard";
  }

  if (normalized.includes("paper") || normalized.includes("research")) {
    return "research_paper";
  }

  if (normalized.includes("news")) {
    return "news";
  }

  if (normalized.includes("implementation") || normalized.includes("demo")) {
    return "implementation";
  }

  return "benchmark";
};

const tryGetHostname = (value: string) => {
  if (!value) {
    return "";
  }

  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const getWorkbook = () => {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Workbook not found: ${workbookPath}`);
  }

  return xlsx.readFile(workbookPath, {
    cellDates: false
  });
};

const getSheet = (workbook: xlsx.WorkBook, sheetName: string) => {
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Required workbook sheet is missing: ${sheetName}`);
  }

  return sheet;
};

const getSheetHeaders = (sheet: xlsx.WorkSheet) => {
  const rows = xlsx.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    raw: false,
    defval: ""
  });

  return (rows[0] ?? []).map((value) => toCellString(value)).filter(Boolean);
};

const assertRequiredHeaders = (
  sheetName: string,
  headers: string[],
  requiredHeaders: readonly string[]
) => {
  const headerSet = new Set(headers);
  const missingHeaders = requiredHeaders.filter((header) => !headerSet.has(header));

  if (missingHeaders.length > 0) {
    throw new Error(
      `${sheetName} is missing required columns: ${missingHeaders.join(", ")}`
    );
  }
};

const readRows = (sheet: xlsx.WorkSheet) =>
  xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false
  });

const getWorkbookUpdatedAt = () => fs.statSync(workbookPath).mtime.toISOString().slice(0, 10);

const buildQuestionRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): QuestionRow => ({
      dimensionId: toCellString(row.dimension_id),
      dimensionTitle: toCellString(row.dimension_title),
      dimensionDescription: toCellString(row.dimension_description),
      dimensionCategory: toCellString(row.dimension_category),
      dimensionSortOrder: toPositiveInteger(toCellString(row.dimension_sort_order)),
      questionId: toCellString(row.question_id),
      questionSortOrder: toPositiveInteger(toCellString(row.question_sort_order)),
      questionTitle: toCellString(row.question_title),
      questionDescription: toCellString(row.question_description),
      status: parseStatus(toCellString(row.status)),
      confidence: parseConfidence(toCellString(row.confidence)),
      rationale: toCellString(row.rationale),
      evaluationModes: parseEvaluationModes(toCellString(row.evaluation_modes)),
      assessmentUpdatedAt: toIsoDateString(toCellString(row.assessment_updated_at)),
      recommendedSource1Title: toCellString(row.recommended_source_1_title),
      recommendedSource1Url: toCellString(row.recommended_source_1_url),
      recommendedSource1Note: toCellString(row.recommended_source_1_note),
      recommendedSource2Title: toCellString(row.recommended_source_2_title),
      recommendedSource2Url: toCellString(row.recommended_source_2_url),
      recommendedSource2Note: toCellString(row.recommended_source_2_note)
    }))
    .filter((row) => row.dimensionId && row.questionId && row.questionTitle);

const buildEvidenceRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): EvidenceRow => ({
      evidenceId: toCellString(row.evidence_id),
      questionId: toCellString(row.question_id),
      evidenceTitle: toCellString(row.evidence_title),
      sourceType: toCellString(row.source_type),
      sourceName: toCellString(row.source_name),
      url: toCellString(row.url),
      publishedDate: toIsoDateString(toCellString(row.published_date)),
      shortExplanation: toCellString(row.short_explanation),
      metricName: toCellString(row.metric_name),
      metricValue: toCellString(row.metric_value),
      metricUnit: toCellString(row.metric_unit),
      model: toCellString(row.model),
      notes: toCellString(row.notes),
      active: toYesNoBoolean(toCellString(row.active))
    }))
    .filter((row) => row.questionId && row.evidenceTitle && row.url && row.active);

const createSourceRecommendations = (question: QuestionRow): SourceRecommendation[] => {
  const recommendationInputs = [
    {
      slot: 1,
      title: question.recommendedSource1Title,
      url: question.recommendedSource1Url,
      note: question.recommendedSource1Note
    },
    {
      slot: 2,
      title: question.recommendedSource2Title,
      url: question.recommendedSource2Url,
      note: question.recommendedSource2Note
    }
  ];

  return recommendationInputs
    .filter((recommendation) => recommendation.title || recommendation.url || recommendation.note)
    .map((recommendation) => ({
      id: `${question.questionId}-source-${recommendation.slot}`,
      benchmarkId: `${question.questionId}-source-${recommendation.slot}`,
      title: recommendation.title || `Suggested source ${recommendation.slot}`,
      source: tryGetHostname(recommendation.url),
      sourceTier: "",
      sourceType: "",
      trackerStatus: "",
      ingestMethod: "",
      updateCadence: "",
      whyUseIt: recommendation.note,
      caveat: "",
      url: recommendation.url,
      secondaryUrl: "",
      recommendedForV1: true,
      priorityRank: recommendation.slot
    }));
};

const buildEvidenceItems = (rows: EvidenceRow[], workbookUpdatedAt: string): ProofItem[] =>
  rows.map((row) => {
    const explanationParts = [
      row.shortExplanation,
      row.metricName && row.metricValue
        ? `${row.metricName}: ${row.metricValue}${row.metricUnit ? ` ${row.metricUnit}` : ""}`
        : "",
      row.model ? `Model: ${row.model}` : "",
      row.notes
    ].filter(Boolean);

    return {
      id: row.evidenceId || slugify(`${row.questionId}-${row.evidenceTitle}`),
      type: parseProofType(row.sourceType),
      title: row.evidenceTitle,
      source: row.sourceName,
      url: row.url,
      shortExplanation: explanationParts.join(" | "),
      date: row.publishedDate || workbookUpdatedAt
    };
  });

export const loadWorkbookMilestoneContents = (): WorkbookValidationResult => {
  const workbook = getWorkbook();
  const warnings: string[] = [];
  const questionsSheet = getSheet(workbook, SHEET_NAMES.questions);
  const evidenceSheet = getSheet(workbook, SHEET_NAMES.evidence);

  assertRequiredHeaders(
    SHEET_NAMES.questions,
    getSheetHeaders(questionsSheet),
    QUESTIONS_HEADERS
  );
  assertRequiredHeaders(
    SHEET_NAMES.evidence,
    getSheetHeaders(evidenceSheet),
    EVIDENCE_HEADERS
  );

  const questionRows = buildQuestionRows(questionsSheet).sort((left, right) => {
    if (left.dimensionSortOrder !== right.dimensionSortOrder) {
      return left.dimensionSortOrder - right.dimensionSortOrder;
    }

    if (left.questionSortOrder !== right.questionSortOrder) {
      return left.questionSortOrder - right.questionSortOrder;
    }

    return left.questionTitle.localeCompare(right.questionTitle);
  });
  const evidenceRows = buildEvidenceRows(evidenceSheet);
  const workbookUpdatedAt = getWorkbookUpdatedAt();
  const evidenceByQuestion = new Map<string, EvidenceRow[]>();

  for (const evidenceRow of evidenceRows) {
    const existingRows = evidenceByQuestion.get(evidenceRow.questionId) ?? [];

    existingRows.push(evidenceRow);
    evidenceByQuestion.set(evidenceRow.questionId, existingRows);
  }

  const milestoneGroups = new Map<
    string,
    {
      milestoneId: string;
      milestoneTitle: string;
      milestoneDescription: string;
      milestoneCategory: string;
      milestoneSortOrder: number;
      questions: QuestionRow[];
    }
  >();

  for (const questionRow of questionRows) {
    const existingGroup = milestoneGroups.get(questionRow.dimensionId);

    if (existingGroup) {
      existingGroup.questions.push(questionRow);
      continue;
    }

    milestoneGroups.set(questionRow.dimensionId, {
      milestoneId: questionRow.dimensionId,
      milestoneTitle: questionRow.dimensionTitle,
      milestoneDescription: questionRow.dimensionDescription,
      milestoneCategory: questionRow.dimensionCategory,
      milestoneSortOrder: questionRow.dimensionSortOrder,
      questions: [questionRow]
    });
  }

  const milestoneContents = Array.from(milestoneGroups.values())
    .sort((left, right) => left.milestoneSortOrder - right.milestoneSortOrder)
    .map((milestoneGroup) => {
      const updatedAt =
        [...milestoneGroup.questions]
          .map((question) => question.assessmentUpdatedAt)
          .filter(Boolean)
          .sort((left, right) => right.localeCompare(left))[0] ?? workbookUpdatedAt;

      return {
        id: milestoneGroup.milestoneId,
        title: milestoneGroup.milestoneTitle,
        description: milestoneGroup.milestoneDescription,
        category: milestoneGroup.milestoneCategory,
        sortOrder: milestoneGroup.milestoneSortOrder,
        updatedAt,
        subQuestions: milestoneGroup.questions
          .sort((left, right) => left.questionSortOrder - right.questionSortOrder)
          .map((question) => ({
            id: question.questionId,
            title: question.questionTitle,
            description: question.questionDescription,
            status: question.status,
            confidence: question.confidence,
            rationale: question.rationale,
            evaluationModes: question.evaluationModes,
            coverage: [],
            proofItems: buildEvidenceItems(
              evidenceByQuestion.get(question.questionId) ?? [],
              workbookUpdatedAt
            ),
            sourceRecommendations: createSourceRecommendations(question)
          }))
      } satisfies MilestoneContent;
    });

  if (milestoneContents.length === 0) {
    warnings.push("No dimension content could be built from the Questions sheet.");
  }

  return {
    milestoneContents,
    warnings,
    workbookPath,
    workbookUpdatedAt
  };
};
