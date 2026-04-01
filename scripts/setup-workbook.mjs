import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { loadLegacyMilestones, resolveLegacyMilestonesDirectory } from "./lib/legacy-milestones.mjs";
import {
  EVIDENCE_HEADERS,
  QUESTIONS_HEADERS,
  SHEET_NAMES,
  resolveWorkbookPath
} from "./lib/workbook-validator.mjs";

const projectRoot = process.cwd();
const workbookPath = resolveWorkbookPath(projectRoot);
const legacyDirectory = resolveLegacyMilestonesDirectory(projectRoot);
const legacyMilestones = loadLegacyMilestones(projectRoot);

const questionsRows = legacyMilestones.flatMap(({ content }) =>
  content.subQuestions.map((subQuestion, questionIndex) => ({
    milestone_id: content.id,
    milestone_title: content.title,
    milestone_description: content.description,
    milestone_category: content.category,
    milestone_sort_order: content.sortOrder,
    question_id: subQuestion.id,
    question_sort_order: questionIndex + 1,
    question_title: subQuestion.title,
    question_description: subQuestion.description,
    status: subQuestion.status,
    confidence: subQuestion.confidence,
    rationale: subQuestion.rationale,
    evaluation_modes: subQuestion.evaluationModes.join(", "),
    assessment_updated_at: content.updatedAt,
    recommended_source_1_title: "",
    recommended_source_1_url: "",
    recommended_source_1_note: "",
    recommended_source_2_title: "",
    recommended_source_2_url: "",
    recommended_source_2_note: ""
  }))
);

const questionsColumns = [
  { header: "milestone_id", key: "milestone_id", width: 22 },
  { header: "milestone_title", key: "milestone_title", width: 30 },
  { header: "milestone_description", key: "milestone_description", width: 48 },
  { header: "milestone_category", key: "milestone_category", width: 22 },
  { header: "milestone_sort_order", key: "milestone_sort_order", width: 16 },
  { header: "question_id", key: "question_id", width: 28 },
  { header: "question_sort_order", key: "question_sort_order", width: 16 },
  { header: "question_title", key: "question_title", width: 44 },
  { header: "question_description", key: "question_description", width: 52 },
  { header: "status", key: "status", width: 16 },
  { header: "confidence", key: "confidence", width: 16 },
  { header: "rationale", key: "rationale", width: 52 },
  { header: "evaluation_modes", key: "evaluation_modes", width: 28 },
  { header: "assessment_updated_at", key: "assessment_updated_at", width: 18 },
  { header: "recommended_source_1_title", key: "recommended_source_1_title", width: 30 },
  { header: "recommended_source_1_url", key: "recommended_source_1_url", width: 34 },
  { header: "recommended_source_1_note", key: "recommended_source_1_note", width: 34 },
  { header: "recommended_source_2_title", key: "recommended_source_2_title", width: 30 },
  { header: "recommended_source_2_url", key: "recommended_source_2_url", width: 34 },
  { header: "recommended_source_2_note", key: "recommended_source_2_note", width: 34 }
];

const evidenceColumns = [
  { header: "evidence_id", key: "evidence_id", width: 24 },
  { header: "question_id", key: "question_id", width: 28 },
  { header: "evidence_title", key: "evidence_title", width: 38 },
  { header: "source_type", key: "source_type", width: 18 },
  { header: "source_name", key: "source_name", width: 28 },
  { header: "url", key: "url", width: 40 },
  { header: "published_date", key: "published_date", width: 18 },
  { header: "short_explanation", key: "short_explanation", width: 48 },
  { header: "metric_name", key: "metric_name", width: 20 },
  { header: "metric_value", key: "metric_value", width: 16 },
  { header: "metric_unit", key: "metric_unit", width: 14 },
  { header: "model", key: "model", width: 22 },
  { header: "notes", key: "notes", width: 34 },
  { header: "active", key: "active", width: 12 }
];

const wrapColumns = new Set([
  "milestone_description",
  "question_title",
  "question_description",
  "rationale",
  "evaluation_modes",
  "recommended_source_1_title",
  "recommended_source_1_url",
  "recommended_source_1_note",
  "recommended_source_2_title",
  "recommended_source_2_url",
  "recommended_source_2_note",
  "evidence_title",
  "source_name",
  "url",
  "short_explanation",
  "notes"
]);

const headerGroups = {
  milestone: new Set([
    "milestone_id",
    "milestone_title",
    "milestone_description",
    "milestone_category",
    "milestone_sort_order"
  ]),
  question: new Set([
    "question_id",
    "question_sort_order",
    "question_title",
    "question_description"
  ]),
  assessment: new Set([
    "status",
    "confidence",
    "rationale",
    "evaluation_modes",
    "assessment_updated_at"
  ]),
  recommendation: new Set([
    "recommended_source_1_title",
    "recommended_source_1_url",
    "recommended_source_1_note",
    "recommended_source_2_title",
    "recommended_source_2_url",
    "recommended_source_2_note"
  ]),
  evidenceIdentity: new Set([
    "evidence_id",
    "question_id",
    "evidence_title"
  ]),
  evidenceSource: new Set([
    "source_type",
    "source_name",
    "url",
    "published_date",
    "short_explanation"
  ]),
  evidenceMetric: new Set([
    "metric_name",
    "metric_value",
    "metric_unit",
    "model"
  ]),
  evidenceAdmin: new Set([
    "notes",
    "active"
  ])
};

const fills = {
  milestone: "DDEBF7",
  question: "E4F5E9",
  assessment: "FCE7C8",
  recommendation: "E8E4F6",
  evidenceIdentity: "DDEBF7",
  evidenceSource: "E4F5E9",
  evidenceMetric: "FCE7C8",
  evidenceAdmin: "F4DDE3"
};

const border = {
  top: { style: "thin", color: { argb: "FFC9D3DD" } },
  left: { style: "thin", color: { argb: "FFC9D3DD" } },
  bottom: { style: "thin", color: { argb: "FFC9D3DD" } },
  right: { style: "thin", color: { argb: "FFC9D3DD" } }
};

const populateWorksheet = (worksheet, columns, rows) => {
  worksheet.columns = columns;

  const headerRow = worksheet.getRow(1);
  headerRow.values = columns.map((column) => column.header);

  rows.forEach((row) => {
    worksheet.addRow(row);
  });
};

const styleHeaderRow = (worksheet, headers, groupLookup) => {
  const headerRow = worksheet.getRow(1);

  headerRow.height = 28;

  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    const group = groupLookup(header);

    cell.font = {
      bold: true,
      color: { argb: "FF22313F" }
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${fills[group]}` }
    };
    cell.border = border;
  });
};

const styleWorksheet = (worksheet, columns) => {
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: "A1",
    to: `${worksheet.getColumn(columns.length).letter}1`
  };

  columns.forEach((columnConfig) => {
    const column = worksheet.getColumn(columnConfig.key);

    column.width = columnConfig.width;
    column.alignment = {
      vertical: "top",
      wrapText: wrapColumns.has(columnConfig.key)
    };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    row.height = 22;
    row.eachCell((cell) => {
      cell.border = border;
      cell.alignment = {
        vertical: "top",
        wrapText: wrapColumns.has(worksheet.getColumn(cell.col).key)
      };
    });
  });
};

const applyListValidation = (worksheet, columnKey, values, rowCount = 500) => {
  const column = worksheet.getColumn(columnKey);
  const formula = `"${values.join(",")}"`;

  worksheet.dataValidations.add(`${column.letter}2:${column.letter}${rowCount}`, {
    type: "list",
    allowBlank: true,
    formulae: [formula],
    showErrorMessage: true,
    errorTitle: "Invalid value",
    error: "Choose one of the dropdown values."
  });
};

const workbook = new ExcelJS.Workbook();
workbook.creator = "Codex";
workbook.created = new Date();
workbook.modified = new Date();
workbook.calcProperties.fullCalcOnLoad = true;

const questionsSheet = workbook.addWorksheet(SHEET_NAMES.questions, {
  views: [{ state: "frozen", ySplit: 1 }]
});
populateWorksheet(questionsSheet, questionsColumns, questionsRows);
styleHeaderRow(questionsSheet, QUESTIONS_HEADERS, (header) => {
  if (headerGroups.milestone.has(header)) {
    return "milestone";
  }

  if (headerGroups.question.has(header)) {
    return "question";
  }

  if (headerGroups.assessment.has(header)) {
    return "assessment";
  }

  return "recommendation";
});
styleWorksheet(questionsSheet, questionsColumns);
applyListValidation(questionsSheet, "status", ["unassessed", "not_met", "in_progress", "met"]);
applyListValidation(questionsSheet, "confidence", ["unassessed", "low", "medium", "high"]);

const evidenceSheet = workbook.addWorksheet(SHEET_NAMES.evidence, {
  views: [{ state: "frozen", ySplit: 1 }]
});
populateWorksheet(evidenceSheet, evidenceColumns, []);
styleHeaderRow(evidenceSheet, EVIDENCE_HEADERS, (header) => {
  if (headerGroups.evidenceIdentity.has(header)) {
    return "evidenceIdentity";
  }

  if (headerGroups.evidenceSource.has(header)) {
    return "evidenceSource";
  }

  if (headerGroups.evidenceMetric.has(header)) {
    return "evidenceMetric";
  }

  return "evidenceAdmin";
});
styleWorksheet(evidenceSheet, evidenceColumns);
applyListValidation(
  evidenceSheet,
  "source_type",
  ["benchmark", "leaderboard", "research_paper", "news", "implementation"]
);
applyListValidation(evidenceSheet, "active", ["Yes", "No"]);

fs.mkdirSync(path.dirname(workbookPath), { recursive: true });
await workbook.xlsx.writeFile(workbookPath);

console.log(`Workbook rebuilt: ${workbookPath}`);
console.log(`Legacy milestone source: ${legacyDirectory}`);
console.log(
  `Seeded ${legacyMilestones.length} milestones and ${questionsRows.length} question rows into ${SHEET_NAMES.questions}.`
);
console.log(`Created empty ${SHEET_NAMES.evidence} sheet for manual evidence entry.`);
