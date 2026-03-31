import xlsx from "xlsx";
import {
  EVIDENCE_HEADERS,
  OPTIONAL_CAPABILITY_HEADERS,
  REQUIRED_CAPABILITY_HEADERS,
  SHEET_NAMES,
  resolveWorkbookPath
} from "./lib/workbook-validator.mjs";

const projectRoot = process.cwd();
const workbookPath = resolveWorkbookPath(projectRoot);
const workbook = xlsx.readFile(workbookPath, {
  cellDates: false
});

const getRows = (sheet) =>
  xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: ""
  });

const writeRows = (sheetName, rows) => {
  workbook.Sheets[sheetName] = xlsx.utils.aoa_to_sheet(rows);

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }
};

const capabilitySheet = workbook.Sheets[SHEET_NAMES.capabilityTracker];

if (!capabilitySheet) {
  throw new Error(`Required sheet is missing: ${SHEET_NAMES.capabilityTracker}`);
}

const capabilityRows = getRows(capabilitySheet);
const capabilityHeaders = (capabilityRows[0] ?? []).map((value) => String(value).trim());
const missingCapabilityHeaders = REQUIRED_CAPABILITY_HEADERS.filter(
  (header) => !capabilityHeaders.includes(header)
);

if (missingCapabilityHeaders.length > 0) {
  throw new Error(
    `${SHEET_NAMES.capabilityTracker} is missing required columns: ${missingCapabilityHeaders.join(", ")}`
  );
}

const addedCapabilityColumns = OPTIONAL_CAPABILITY_HEADERS.filter(
  (header) => !capabilityHeaders.includes(header)
);
const updatedCapabilityHeaders = [...capabilityHeaders];

addedCapabilityColumns.forEach((header) => updatedCapabilityHeaders.push(header));

const normalizedCapabilityRows = capabilityRows.map((row, index) => {
  if (index === 0) {
    return updatedCapabilityHeaders;
  }

  const nextRow = [...row];

  while (nextRow.length < updatedCapabilityHeaders.length) {
    nextRow.push("");
  }

  return nextRow;
});

writeRows(SHEET_NAMES.capabilityTracker, normalizedCapabilityRows);

const evidenceSheet = workbook.Sheets[SHEET_NAMES.evidenceEntries];
let createdEvidenceSheet = false;
let addedEvidenceColumns = [];

if (!evidenceSheet) {
  writeRows(SHEET_NAMES.evidenceEntries, [EVIDENCE_HEADERS]);
  createdEvidenceSheet = true;
  addedEvidenceColumns = [...EVIDENCE_HEADERS];
} else {
  const evidenceRows = getRows(evidenceSheet);
  const evidenceHeaders = (evidenceRows[0] ?? []).map((value) => String(value).trim());
  addedEvidenceColumns = EVIDENCE_HEADERS.filter(
    (header) => !evidenceHeaders.includes(header)
  );
  const updatedEvidenceHeaders = [...evidenceHeaders];

  addedEvidenceColumns.forEach((header) => updatedEvidenceHeaders.push(header));

  const normalizedEvidenceRows = evidenceRows.map((row, index) => {
    if (index === 0) {
      return updatedEvidenceHeaders;
    }

    const nextRow = [...row];

    while (nextRow.length < updatedEvidenceHeaders.length) {
      nextRow.push("");
    }

    return nextRow;
  });

  writeRows(SHEET_NAMES.evidenceEntries, normalizedEvidenceRows.length > 0 ? normalizedEvidenceRows : [EVIDENCE_HEADERS]);
}

xlsx.writeFile(workbook, workbookPath);

console.log(`Workbook prepared: ${workbookPath}`);
console.log(
  addedCapabilityColumns.length > 0
    ? `Added capability workflow columns: ${addedCapabilityColumns.join(", ")}`
    : "Capability workflow columns already present."
);
console.log(
  createdEvidenceSheet
    ? `Created ${SHEET_NAMES.evidenceEntries} sheet.`
    : "Evidence Entries sheet already present."
);

if (!createdEvidenceSheet) {
  console.log(
    addedEvidenceColumns.length > 0
      ? `Added evidence columns: ${addedEvidenceColumns.join(", ")}`
      : "Evidence columns already present."
  );
}
