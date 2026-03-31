import assert from "node:assert/strict";
import {
  EVIDENCE_HEADERS,
  OPTIONAL_CAPABILITY_HEADERS,
  REQUIRED_BENCHMARK_HEADERS,
  REQUIRED_CAPABILITY_HEADERS,
  validateWorkbookData
} from "./lib/workbook-validator.mjs";

const createValidWorkbookData = () => ({
  capabilityHeaders: [...REQUIRED_CAPABILITY_HEADERS, ...OPTIONAL_CAPABILITY_HEADERS],
  benchmarkHeaders: [...REQUIRED_BENCHMARK_HEADERS],
  evidenceHeaders: [...EVIDENCE_HEADERS],
  hasEvidenceSheet: true,
  capabilityRows: [
    {
      "Capability ID": "001",
      Dimension: "Cognitive Reasoning & Task Execution",
      Capability: "Problem understanding",
      "Definition / what we want to track":
        "Can the system infer the actual task from instructions and context?",
      Priority: "High",
      "Coverage status": "Mapped",
      "Recommended primary benchmark": "GAIA",
      "Recommended secondary benchmarks": "",
      "Primary benchmark source tier": "A",
      "Primary benchmark source type": "Benchmark",
      "Public leaderboard / source": "Official GAIA Hugging Face leaderboard",
      "Ingest method": "API",
      "Recommended for v1?": "Yes",
      "Notes / caveats": "Use with manual review.",
      "Assessment Status": "Unassessed",
      "Assessment Confidence": "Unassessed",
      "Evaluation Modes": "Benchmark; Leaderboard",
      "Assessment Rationale": "",
      "Assessment Updated At": ""
    }
  ],
  benchmarkRows: [
    {
      "Benchmark ID": "GAIA",
      Benchmark: "GAIA",
      "Primary dimension": "Cognitive Reasoning & Task Execution",
      "Primary capabilities covered": "Problem understanding",
      "What the benchmark actually measures": "Real-world task completion",
      "Leaderboard / source": "Official GAIA Hugging Face leaderboard",
      "Source owner": "GAIA",
      "Source tier": "A",
      "Tracker status": "Tracked",
      "Public leaderboard?": "Yes",
      "API / ingest path": "API",
      "Update cadence": "Weekly",
      "Why use it": "Strong task grounding signal",
      "Main caveat": "Requires manual interpretation",
      "Primary URL": "https://example.org/gaia",
      "Secondary URL": ""
    }
  ],
  evidenceRows: []
});

const runCase = (name, fn) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
};

runCase("valid workbook data passes with only no-evidence warning", () => {
  const report = validateWorkbookData(createValidWorkbookData());

  assert.equal(report.errors.length, 0);
  assert.equal(report.warnings.length, 1);
  assert.match(report.warnings[0], /no published evidence rows/i);
});

runCase("invalid enum values fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.capabilityRows[0]["Assessment Status"] = "done";

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("invalid Assessment Status")));
});

runCase("bad URLs fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.benchmarkRows[0]["Primary URL"] = "notaurl";

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("invalid Primary URL")));
});

runCase("duplicate IDs fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.capabilityRows.push({
    ...workbookData.capabilityRows[0],
    Capability: "Execution control"
  });

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("duplicates Capability ID")));
});

runCase("malformed dates fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.evidenceRows.push({
    "Evidence ID": "ev-001",
    "Capability ID": "001",
    "Evidence Title": "Example evidence",
    "Source Type": "benchmark",
    "Source Name": "GAIA",
    URL: "https://example.org/evidence",
    "Published Date": "2026-02-30",
    "Short Explanation": "Example explanation",
    "Benchmark ID": "GAIA",
    "Benchmark Name": "GAIA",
    "Metric Name": "Score",
    "Metric Value": "84.2",
    "Metric Unit": "%",
    Model: "Example model",
    Notes: "",
    "Active?": "Yes"
  });

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("invalid Published Date")));
});

console.log("Validator smoke tests passed.");
