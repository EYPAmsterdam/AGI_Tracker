import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatWorkbookValidationReport,
  validateWorkbook
} from "./lib/workbook-validator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const report = validateWorkbook(projectRoot);

console.log(formatWorkbookValidationReport(report));

if (report.errors.length > 0) {
  process.exit(1);
}
