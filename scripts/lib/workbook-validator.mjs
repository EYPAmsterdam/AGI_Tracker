import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

export const WORKBOOK_RELATIVE_PATH = path.join(
  "content",
  "workbook",
  "AGI benchmark mapping.xlsx"
);

export const SHEET_NAMES = {
  capabilityTracker: "Capability Tracker",
  benchmarkRegistry: "Benchmark Registry",
  evidenceEntries: "Evidence Entries"
};

export const REQUIRED_CAPABILITY_HEADERS = [
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

export const OPTIONAL_CAPABILITY_HEADERS = [
  "Assessment Status",
  "Assessment Confidence",
  "Evaluation Modes",
  "Assessment Rationale",
  "Assessment Updated At"
];

export const REQUIRED_BENCHMARK_HEADERS = [
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

export const EVIDENCE_HEADERS = [
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
  capabilityHeaders,
  benchmarkHeaders,
  evidenceHeaders,
  capabilityRows,
  benchmarkRows,
  evidenceRows,
  hasEvidenceSheet
}) => {
  const errors = [];
  const warnings = [];
  const capabilityIdPaths = new Map();
  const benchmarkIdPaths = new Map();
  const benchmarkLookup = new Map();
  const dimensionNames = new Set();
  const activeEvidenceRows = evidenceRows.filter((row) => isActiveEvidenceRow(row["Active?"]));
  const summary = {
    dimensions: 0,
    capabilities: capabilityRows.length,
    benchmarks: benchmarkRows.length,
    evidenceEntries: activeEvidenceRows.length
  };

  pushMissingHeaderErrors(
    errors,
    SHEET_NAMES.capabilityTracker,
    capabilityHeaders,
    REQUIRED_CAPABILITY_HEADERS
  );
  pushMissingHeaderErrors(
    errors,
    SHEET_NAMES.benchmarkRegistry,
    benchmarkHeaders,
    REQUIRED_BENCHMARK_HEADERS
  );

  if (!hasEvidenceSheet) {
    errors.push(
      `${SHEET_NAMES.evidenceEntries} is missing. Run "npm run setup-workbook" to add the evidence-entry sheet and required columns.`
    );
  } else {
    pushMissingHeaderErrors(
      errors,
      SHEET_NAMES.evidenceEntries,
      evidenceHeaders,
      EVIDENCE_HEADERS
    );
  }

  const missingOptionalCapabilityHeaders = OPTIONAL_CAPABILITY_HEADERS.filter(
    (header) => !new Set(capabilityHeaders).has(header)
  );

  if (missingOptionalCapabilityHeaders.length > 0) {
    warnings.push(
      `${SHEET_NAMES.capabilityTracker} is missing optional workflow columns: ${missingOptionalCapabilityHeaders.join(
        ", "
      )}`
    );
  }

  if (capabilityRows.length === 0) {
    errors.push(`${SHEET_NAMES.capabilityTracker} does not contain any capability rows.`);
  }

  if (benchmarkRows.length === 0) {
    errors.push(`${SHEET_NAMES.benchmarkRegistry} does not contain any benchmark rows.`);
  }

  benchmarkRows.forEach((row, index) => {
    const pathLabel = `${SHEET_NAMES.benchmarkRegistry}[${index + 2}]`;
    const benchmarkId = toCellString(row["Benchmark ID"]);
    const benchmarkName = toCellString(row["Benchmark"]);
    const primaryDimension = toCellString(row["Primary dimension"]);
    const primaryUrl = toCellString(row["Primary URL"]);
    const secondaryUrl = toCellString(row["Secondary URL"]);

    if (!benchmarkId) {
      errors.push(`${pathLabel} is missing Benchmark ID.`);
    } else if (benchmarkIdPaths.has(normalizeKey(benchmarkId))) {
      errors.push(
        `${pathLabel} duplicates Benchmark ID from ${benchmarkIdPaths.get(normalizeKey(benchmarkId))}.`
      );
    } else {
      benchmarkIdPaths.set(normalizeKey(benchmarkId), pathLabel);
      benchmarkLookup.set(normalizeKey(benchmarkId), pathLabel);
    }

    if (!benchmarkName) {
      errors.push(`${pathLabel} is missing Benchmark.`);
    } else {
      benchmarkLookup.set(normalizeKey(benchmarkName), pathLabel);
    }

    if (!primaryDimension) {
      errors.push(`${pathLabel} is missing Primary dimension.`);
    }

    if (!isOptionalHttpUrl(primaryUrl)) {
      errors.push(`${pathLabel} has an invalid Primary URL.`);
    } else if (!primaryUrl) {
      warnings.push(`${pathLabel} is missing Primary URL.`);
    }

    if (!isOptionalHttpUrl(secondaryUrl)) {
      errors.push(`${pathLabel} has an invalid Secondary URL.`);
    }
  });

  capabilityRows.forEach((row, index) => {
    const pathLabel = `${SHEET_NAMES.capabilityTracker}[${index + 2}]`;
    const capabilityId = toCellString(row["Capability ID"]);
    const dimension = toCellString(row["Dimension"]);
    const capability = toCellString(row["Capability"]);
    const definition = toCellString(row["Definition / what we want to track"]);
    const assessmentStatus = normalizeKey(row["Assessment Status"]);
    const assessmentConfidence = normalizeKey(row["Assessment Confidence"]);
    const assessmentUpdatedAt = toCellString(row["Assessment Updated At"]);
    const requestedBenchmarks = [
      toCellString(row["Recommended primary benchmark"]),
      ...splitList(row["Recommended secondary benchmarks"])
    ].filter(Boolean);

    if (!capabilityId) {
      errors.push(`${pathLabel} is missing Capability ID.`);
    } else if (capabilityIdPaths.has(normalizeKey(capabilityId))) {
      errors.push(
        `${pathLabel} duplicates Capability ID from ${capabilityIdPaths.get(normalizeKey(capabilityId))}.`
      );
    } else {
      capabilityIdPaths.set(normalizeKey(capabilityId), pathLabel);
    }

    if (!dimension) {
      errors.push(`${pathLabel} is missing Dimension.`);
    } else {
      dimensionNames.add(dimension);
    }

    if (!capability) {
      errors.push(`${pathLabel} is missing Capability.`);
    }

    if (!definition) {
      errors.push(`${pathLabel} is missing Definition / what we want to track.`);
    }

    if (assessmentStatus && !VALID_STATUS_VALUES.has(assessmentStatus)) {
      errors.push(`${pathLabel} has an invalid Assessment Status.`);
    }

    if (assessmentConfidence && !VALID_CONFIDENCE_VALUES.has(assessmentConfidence)) {
      errors.push(`${pathLabel} has an invalid Assessment Confidence.`);
    }

    const evaluationModes = splitList(row["Evaluation Modes"]).map((value) => normalizeKey(value));
    const invalidModes = evaluationModes.filter((value) => !VALID_EVALUATION_MODES.has(value));

    if (invalidModes.length > 0) {
      errors.push(`${pathLabel} has invalid Evaluation Modes: ${invalidModes.join(", ")}.`);
    }

    if (assessmentUpdatedAt && !isOptionalDateString(assessmentUpdatedAt)) {
      errors.push(`${pathLabel} has an invalid Assessment Updated At value.`);
    }

    requestedBenchmarks.forEach((benchmarkName) => {
      if (!benchmarkLookup.has(normalizeKey(benchmarkName))) {
        warnings.push(
          `${pathLabel} references benchmark "${benchmarkName}" but it was not found in ${SHEET_NAMES.benchmarkRegistry}.`
        );
      }
    });
  });

  activeEvidenceRows.forEach((row, index) => {
    const pathLabel = `${SHEET_NAMES.evidenceEntries}[${index + 2}]`;
    const capabilityId = toCellString(row["Capability ID"]);
    const evidenceTitle = toCellString(row["Evidence Title"]);
    const url = toCellString(row["URL"]);
    const publishedDate = toCellString(row["Published Date"]);
    const benchmarkId = toCellString(row["Benchmark ID"]);

    if (!capabilityId) {
      errors.push(`${pathLabel} is missing Capability ID.`);
    } else if (!capabilityIdPaths.has(normalizeKey(capabilityId))) {
      errors.push(`${pathLabel} references unknown Capability ID "${capabilityId}".`);
    }

    if (!evidenceTitle) {
      errors.push(`${pathLabel} is missing Evidence Title.`);
    }

    if (!url) {
      errors.push(`${pathLabel} is missing URL.`);
    } else if (!isOptionalHttpUrl(url)) {
      errors.push(`${pathLabel} has an invalid URL.`);
    }

    if (publishedDate && !isDateString(publishedDate)) {
      errors.push(`${pathLabel} has an invalid Published Date.`);
    }

    if (benchmarkId && !benchmarkIdPaths.has(normalizeKey(benchmarkId))) {
      errors.push(`${pathLabel} references unknown Benchmark ID "${benchmarkId}".`);
    }
  });

  summary.dimensions = dimensionNames.size;

  if (summary.evidenceEntries === 0) {
    warnings.push(
      `${SHEET_NAMES.evidenceEntries} currently has no published evidence rows. This is valid for the MVP until you start filling evidence entries manually.`
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
        dimensions: 0,
        capabilities: 0,
        benchmarks: 0,
        evidenceEntries: 0
      }
    };
  }

  const workbook = xlsx.readFile(workbookPath, {
    cellDates: false
  });
  const capabilitySheet = workbook.Sheets[SHEET_NAMES.capabilityTracker];
  const benchmarkSheet = workbook.Sheets[SHEET_NAMES.benchmarkRegistry];
  const evidenceSheet = workbook.Sheets[SHEET_NAMES.evidenceEntries];
  const capabilityHeaders = capabilitySheet ? getSheetHeaders(capabilitySheet) : [];
  const benchmarkHeaders = benchmarkSheet ? getSheetHeaders(benchmarkSheet) : [];
  const evidenceHeaders = evidenceSheet ? getSheetHeaders(evidenceSheet) : [];
  const capabilityRows = capabilitySheet ? readRows(capabilitySheet) : [];
  const benchmarkRows = benchmarkSheet ? readRows(benchmarkSheet) : [];
  const evidenceRows = evidenceSheet ? readRows(evidenceSheet) : [];

  const report = validateWorkbookData({
    capabilityHeaders,
    benchmarkHeaders,
    evidenceHeaders,
    capabilityRows,
    benchmarkRows,
    evidenceRows,
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
    `Validated ${summary.dimensions} dimensions, ${summary.capabilities} capabilities, ${summary.benchmarks} benchmarks, and ${summary.evidenceEntries} published evidence entries.`
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
