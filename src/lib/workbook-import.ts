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
  capabilityTracker: "Capability Tracker",
  benchmarkRegistry: "Benchmark Registry",
  ingestionPriority: "(Ingestion Priority)",
  evidenceEntries: "Evidence Entries"
} as const;

const REQUIRED_CAPABILITY_HEADERS = [
  "Capability ID",
  "Dimension",
  "Capability",
  "Definition / what we want to track",
  "Priority",
  "Coverage status",
  "Recommended primary benchmark",
  "Recommended secondary benchmarks",
  "Primary benchmark source tier",
  "Primary benchmark source type",
  "Public leaderboard / source",
  "Ingest method",
  "Recommended for v1?",
  "Notes / caveats"
];

const REQUIRED_BENCHMARK_HEADERS = [
  "Benchmark ID",
  "Benchmark",
  "Primary dimension",
  "Primary capabilities covered",
  "What the benchmark actually measures",
  "Leaderboard / source",
  "Source owner",
  "Source tier",
  "Tracker status",
  "Public leaderboard?",
  "API / ingest path",
  "Update cadence",
  "Why use it",
  "Main caveat",
  "Primary URL",
  "Secondary URL"
];

const EVIDENCE_HEADERS = [
  "Evidence ID",
  "Capability ID",
  "Evidence Title",
  "Source Type",
  "Source Name",
  "URL",
  "Published Date",
  "Short Explanation",
  "Benchmark ID",
  "Benchmark Name",
  "Metric Name",
  "Metric Value",
  "Metric Unit",
  "Model",
  "Notes",
  "Active?"
];

type WorkbookValidationResult = {
  milestoneContents: MilestoneContent[];
  warnings: string[];
  workbookPath: string;
  workbookUpdatedAt: string;
};

type CapabilityTrackerRow = {
  capabilityId: string;
  dimension: string;
  capability: string;
  definition: string;
  priority: string;
  coverageStatus: string;
  primaryBenchmark: string;
  secondaryBenchmarks: string[];
  sourceTier: string;
  sourceType: string;
  sourceName: string;
  ingestMethod: string;
  recommendedForV1: boolean;
  notes: string;
  assessmentStatus: Status;
  assessmentConfidence: Confidence;
  evaluationModes: EvaluationMode[];
  assessmentRationale: string;
  assessmentUpdatedAt: string;
};

type BenchmarkRegistryRow = {
  benchmarkId: string;
  benchmark: string;
  primaryDimension: string;
  primaryCapabilitiesCovered: string;
  measures: string;
  leaderboardSource: string;
  sourceOwner: string;
  sourceTier: string;
  trackerStatus: string;
  publicLeaderboard: string;
  ingestPath: string;
  updateCadence: string;
  whyUseIt: string;
  mainCaveat: string;
  primaryUrl: string;
  secondaryUrl: string;
};

type IngestionPriorityRow = {
  priority: number | null;
  benchmark: string;
};

type EvidenceEntryRow = {
  evidenceId: string;
  capabilityId: string;
  title: string;
  sourceType: string;
  sourceName: string;
  url: string;
  publishedDate: string;
  shortExplanation: string;
  benchmarkId: string;
  benchmarkName: string;
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

const toYesNoBoolean = (value: string) => {
  const normalized = normalizeKey(value);

  return normalized === "yes" || normalized === "true" || normalized === "1";
};

const splitList = (value: string) =>
  value
    .split(/\r?\n|;/)
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

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
  requiredHeaders: string[]
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

const buildCapabilityTrackerRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): CapabilityTrackerRow => ({
      capabilityId: toCellString(row["Capability ID"]),
      dimension: toCellString(row["Dimension"]),
      capability: toCellString(row["Capability"]),
      definition: toCellString(row["Definition / what we want to track"]),
      priority: toCellString(row["Priority"]),
      coverageStatus: toCellString(row["Coverage status"]),
      primaryBenchmark: toCellString(row["Recommended primary benchmark"]),
      secondaryBenchmarks: splitList(
        toCellString(row["Recommended secondary benchmarks"])
      ),
      sourceTier: toCellString(row["Primary benchmark source tier"]),
      sourceType: toCellString(row["Primary benchmark source type"]),
      sourceName: toCellString(row["Public leaderboard / source"]),
      ingestMethod: toCellString(row["Ingest method"]),
      recommendedForV1: toYesNoBoolean(toCellString(row["Recommended for v1?"])),
      notes: toCellString(row["Notes / caveats"]),
      assessmentStatus: parseStatus(toCellString(row["Assessment Status"])),
      assessmentConfidence: parseConfidence(
        toCellString(row["Assessment Confidence"])
      ),
      evaluationModes: parseEvaluationModes(toCellString(row["Evaluation Modes"])),
      assessmentRationale: toCellString(row["Assessment Rationale"]),
      assessmentUpdatedAt: toIsoDateString(toCellString(row["Assessment Updated At"]))
    }))
    .filter((row) => row.capabilityId && row.dimension && row.capability);

const buildBenchmarkRegistryRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): BenchmarkRegistryRow => ({
      benchmarkId: toCellString(row["Benchmark ID"]),
      benchmark: toCellString(row["Benchmark"]),
      primaryDimension: toCellString(row["Primary dimension"]),
      primaryCapabilitiesCovered: toCellString(row["Primary capabilities covered"]),
      measures: toCellString(row["What the benchmark actually measures"]),
      leaderboardSource: toCellString(row["Leaderboard / source"]),
      sourceOwner: toCellString(row["Source owner"]),
      sourceTier: toCellString(row["Source tier"]),
      trackerStatus: toCellString(row["Tracker status"]),
      publicLeaderboard: toCellString(row["Public leaderboard?"]),
      ingestPath: toCellString(row["API / ingest path"]),
      updateCadence: toCellString(row["Update cadence"]),
      whyUseIt: toCellString(row["Why use it"]),
      mainCaveat: toCellString(row["Main caveat"]),
      primaryUrl: toCellString(row["Primary URL"]),
      secondaryUrl: toCellString(row["Secondary URL"])
    }))
    .filter((row) => row.benchmarkId && row.benchmark);

const buildIngestionPriorityRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): IngestionPriorityRow => ({
      priority: Number.parseInt(toCellString(row["Priority"]), 10) || null,
      benchmark: toCellString(row["Benchmark"])
    }))
    .filter((row) => row.benchmark);

const buildEvidenceEntryRows = (sheet: xlsx.WorkSheet) =>
  readRows(sheet)
    .map((row): EvidenceEntryRow => ({
      evidenceId: toCellString(row["Evidence ID"]),
      capabilityId: toCellString(row["Capability ID"]),
      title: toCellString(row["Evidence Title"]),
      sourceType: toCellString(row["Source Type"]),
      sourceName: toCellString(row["Source Name"]),
      url: toCellString(row["URL"]),
      publishedDate: toIsoDateString(toCellString(row["Published Date"])),
      shortExplanation: toCellString(row["Short Explanation"]),
      benchmarkId: toCellString(row["Benchmark ID"]),
      benchmarkName: toCellString(row["Benchmark Name"]),
      metricName: toCellString(row["Metric Name"]),
      metricValue: toCellString(row["Metric Value"]),
      metricUnit: toCellString(row["Metric Unit"]),
      model: toCellString(row["Model"]),
      notes: toCellString(row["Notes"]),
      active: toCellString(row["Active?"]) === ""
        ? true
        : toYesNoBoolean(toCellString(row["Active?"]))
    }))
    .filter((row) => row.capabilityId && row.title && row.url && row.active);

const createSourceRecommendation = ({
  capability,
  benchmark,
  priorityRank,
  recommendedForV1
}: {
  capability: CapabilityTrackerRow;
  benchmark: BenchmarkRegistryRow;
  priorityRank: number | null;
  recommendedForV1: boolean;
}): SourceRecommendation => ({
  id: `${slugify(capability.capabilityId)}-${slugify(benchmark.benchmarkId)}`,
  benchmarkId: benchmark.benchmarkId,
  title: benchmark.benchmark,
  source: benchmark.leaderboardSource || benchmark.sourceOwner,
  sourceTier: benchmark.sourceTier,
  sourceType: capability.sourceType,
  trackerStatus: benchmark.trackerStatus,
  ingestMethod: benchmark.ingestPath,
  updateCadence: benchmark.updateCadence,
  whyUseIt: benchmark.whyUseIt,
  caveat: benchmark.mainCaveat,
  url: benchmark.primaryUrl,
  secondaryUrl: benchmark.secondaryUrl,
  recommendedForV1,
  priorityRank
});

const buildSourceRecommendations = ({
  capability,
  benchmarkByKey,
  priorityByBenchmark,
  warnings
}: {
  capability: CapabilityTrackerRow;
  benchmarkByKey: Map<string, BenchmarkRegistryRow>;
  priorityByBenchmark: Map<string, number | null>;
  warnings: string[];
}) => {
  const requestedBenchmarks = [
    capability.primaryBenchmark,
    ...capability.secondaryBenchmarks
  ].filter(Boolean);
  const seenKeys = new Set<string>();
  const recommendations: SourceRecommendation[] = [];

  for (const benchmarkName of requestedBenchmarks) {
    const lookupKey = normalizeKey(benchmarkName);

    if (!lookupKey || seenKeys.has(lookupKey)) {
      continue;
    }

    seenKeys.add(lookupKey);

    const benchmark =
      benchmarkByKey.get(lookupKey) ?? benchmarkByKey.get(normalizeKey(benchmarkName));

    if (!benchmark) {
      warnings.push(
        `Capability ${capability.capabilityId} references benchmark "${benchmarkName}" but it was not found in Benchmark Registry.`
      );
      continue;
    }

    recommendations.push(
      createSourceRecommendation({
        capability,
        benchmark,
        priorityRank: priorityByBenchmark.get(lookupKey) ?? null,
        recommendedForV1: capability.recommendedForV1
      })
    );
  }

  return recommendations.sort((left, right) => {
    const leftPriority = left.priorityRank ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = right.priorityRank ?? Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.title.localeCompare(right.title);
  });
};

const buildEvidenceItems = (rows: EvidenceEntryRow[]): ProofItem[] =>
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
      id: row.evidenceId || slugify(`${row.capabilityId}-${row.title}`),
      type: parseProofType(row.sourceType),
      title: row.title,
      source: row.sourceName || row.benchmarkName || row.benchmarkId,
      url: row.url,
      shortExplanation: explanationParts.join(" | "),
      date: row.publishedDate || getWorkbookUpdatedAt()
    };
  });

const buildCapabilityRationale = (capability: CapabilityTrackerRow) => {
  const rationaleParts = [
    `Capability ID: ${capability.capabilityId}.`,
    capability.coverageStatus ? `Coverage status: ${capability.coverageStatus}.` : "",
    capability.primaryBenchmark
      ? `Primary benchmark anchor: ${capability.primaryBenchmark}.`
      : "",
    capability.ingestMethod
      ? `Preferred ingest method: ${capability.ingestMethod}.`
      : "",
    capability.notes,
    capability.assessmentRationale
  ].filter(Boolean);

  return rationaleParts.join(" ");
};

export const loadWorkbookMilestoneContents = (): WorkbookValidationResult => {
  const workbook = getWorkbook();
  const warnings: string[] = [];
  const capabilitySheet = getSheet(workbook, SHEET_NAMES.capabilityTracker);
  const benchmarkSheet = getSheet(workbook, SHEET_NAMES.benchmarkRegistry);
  const ingestionSheet = workbook.Sheets[SHEET_NAMES.ingestionPriority];
  const evidenceSheet = workbook.Sheets[SHEET_NAMES.evidenceEntries];

  assertRequiredHeaders(
    SHEET_NAMES.capabilityTracker,
    getSheetHeaders(capabilitySheet),
    REQUIRED_CAPABILITY_HEADERS
  );
  assertRequiredHeaders(
    SHEET_NAMES.benchmarkRegistry,
    getSheetHeaders(benchmarkSheet),
    REQUIRED_BENCHMARK_HEADERS
  );

  if (evidenceSheet) {
    assertRequiredHeaders(
      SHEET_NAMES.evidenceEntries,
      getSheetHeaders(evidenceSheet),
      EVIDENCE_HEADERS
    );
  } else {
    warnings.push(
      `Workbook sheet "${SHEET_NAMES.evidenceEntries}" is missing. Actual evidence items will remain empty until that sheet is added.`
    );
  }

  const capabilityRows = buildCapabilityTrackerRows(capabilitySheet);
  const benchmarkRows = buildBenchmarkRegistryRows(benchmarkSheet);
  const priorityRows = ingestionSheet ? buildIngestionPriorityRows(ingestionSheet) : [];
  const evidenceRows = evidenceSheet ? buildEvidenceEntryRows(evidenceSheet) : [];
  const benchmarkByKey = new Map<string, BenchmarkRegistryRow>();
  const priorityByBenchmark = new Map<string, number | null>();
  const evidenceByCapability = new Map<string, EvidenceEntryRow[]>();
  const workbookUpdatedAt = getWorkbookUpdatedAt();

  for (const benchmark of benchmarkRows) {
    benchmarkByKey.set(normalizeKey(benchmark.benchmarkId), benchmark);
    benchmarkByKey.set(normalizeKey(benchmark.benchmark), benchmark);
  }

  for (const priority of priorityRows) {
    priorityByBenchmark.set(normalizeKey(priority.benchmark), priority.priority);
  }

  for (const evidence of evidenceRows) {
    const key = normalizeKey(evidence.capabilityId);
    const existingRows = evidenceByCapability.get(key) ?? [];

    existingRows.push(evidence);
    evidenceByCapability.set(key, existingRows);
  }

  const dimensionsInOrder = Array.from(
    new Set(capabilityRows.map((capability) => capability.dimension))
  );

  const milestoneContents = dimensionsInOrder.map((dimension, dimensionIndex) => {
    const capabilities = capabilityRows.filter(
      (capability) => capability.dimension === dimension
    );
    const dimensionUpdatedAt =
      [...capabilities]
        .map((capability) => capability.assessmentUpdatedAt)
        .filter(Boolean)
        .sort((left, right) => right.localeCompare(left))[0] ?? workbookUpdatedAt;

    return {
      id: slugify(dimension),
      title: dimension,
      description: `Capabilities currently mapped in the workbook under ${dimension}. Assessment status and evidence remain manual until filled into the workbook.`,
      category: "Capability dimension",
      sortOrder: dimensionIndex + 1,
      updatedAt: dimensionUpdatedAt,
      subQuestions: capabilities.map((capability) => {
        const capabilityKey = normalizeKey(capability.capabilityId);
        const evidenceItems = buildEvidenceItems(
          evidenceByCapability.get(capabilityKey) ?? []
        );

        return {
          id: slugify(`capability-${capability.capabilityId}`),
          title: capability.capability,
          description: capability.definition,
          status: capability.assessmentStatus,
          confidence: capability.assessmentConfidence,
          rationale: buildCapabilityRationale(capability),
          evaluationModes: capability.evaluationModes,
          coverage: [],
          proofItems: evidenceItems,
          sourceRecommendations: buildSourceRecommendations({
            capability,
            benchmarkByKey,
            priorityByBenchmark,
            warnings
          })
        };
      })
    } satisfies MilestoneContent;
  });

  return {
    milestoneContents,
    warnings,
    workbookPath,
    workbookUpdatedAt
  };
};
