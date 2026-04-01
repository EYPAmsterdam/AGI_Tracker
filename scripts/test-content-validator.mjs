import assert from "node:assert/strict";
import {
  EVIDENCE_HEADERS,
  QUESTIONS_HEADERS,
  validateWorkbookData
} from "./lib/workbook-validator.mjs";

const createValidWorkbookData = () => ({
  questionHeaders: [...QUESTIONS_HEADERS],
  evidenceHeaders: [...EVIDENCE_HEADERS],
  hasQuestionsSheet: true,
  hasEvidenceSheet: true,
  questionRows: [
    {
      milestone_id: "task-understanding",
      milestone_title: "AI can understand what a task is really asking",
      milestone_description:
        "An AI system can recover intent from messy instructions, isolate the real job to be done, and frame the task correctly before acting.",
      milestone_category: "Task understanding",
      milestone_sort_order: "1",
      question_id: "task-understanding-goal-inference",
      question_sort_order: "1",
      question_title: "Can it infer the real goal from messy instructions?",
      question_description:
        "Tests whether the system can recover underlying intent when requests are informal, cluttered, or only partially specified.",
      status: "met",
      confidence: "high",
      rationale: "Legacy placeholder rationale.",
      evaluation_modes: "benchmark, controlled_study",
      assessment_updated_at: "2026-03-10",
      recommended_source_1_title: "",
      recommended_source_1_url: "",
      recommended_source_1_note: "",
      recommended_source_2_title: "",
      recommended_source_2_url: "",
      recommended_source_2_note: ""
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
  workbookData.questionRows[0].status = "done";

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("invalid status")));
});

runCase("bad recommendation URLs fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.questionRows[0].recommended_source_1_url = "notaurl";

  const report = validateWorkbookData(workbookData);

  assert.ok(
    report.errors.some((error) => error.includes("invalid recommended_source_1_url"))
  );
});

runCase("duplicate question IDs fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.questionRows.push({
    ...workbookData.questionRows[0],
    question_title: "Can it identify missing constraints and ask clarifying questions?"
  });

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("duplicates question_id")));
});

runCase("malformed evidence dates fail validation", () => {
  const workbookData = createValidWorkbookData();
  workbookData.evidenceRows.push({
    evidence_id: "ev-001",
    question_id: "task-understanding-goal-inference",
    evidence_title: "Example evidence",
    source_type: "benchmark",
    source_name: "Example benchmark",
    url: "https://example.org/evidence",
    published_date: "2026-02-30",
    short_explanation: "Example explanation",
    metric_name: "Score",
    metric_value: "84.2",
    metric_unit: "%",
    model: "Example model",
    notes: "",
    active: "Yes"
  });

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes("invalid published_date")));
});

runCase("evidence must reference a known question", () => {
  const workbookData = createValidWorkbookData();
  workbookData.evidenceRows.push({
    evidence_id: "ev-002",
    question_id: "missing-question",
    evidence_title: "Example evidence",
    source_type: "benchmark",
    source_name: "Example benchmark",
    url: "https://example.org/evidence",
    published_date: "2026-03-11",
    short_explanation: "Example explanation",
    metric_name: "",
    metric_value: "",
    metric_unit: "",
    model: "",
    notes: "",
    active: "Yes"
  });

  const report = validateWorkbookData(workbookData);

  assert.ok(report.errors.some((error) => error.includes('unknown question_id "missing-question"')));
});

console.log("Validator smoke tests passed.");
