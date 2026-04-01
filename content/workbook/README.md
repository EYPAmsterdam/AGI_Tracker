# Workbook Authoring Flow

The published tracker now reads from `AGI benchmark mapping.xlsx` at build time.

## Sheets

- `Questions`
  This is the main editing sheet. Each row is one tracker sub-question, with the parent milestone fields repeated so the hierarchy stays editable in one place.
- `Evidence`
  This is the published evidence sheet. Each row is one evidence item linked to a sub-question by `question_id`.

There are no other workbook sheets in the MVP.

## Questions Columns

- `milestone_id`, `milestone_title`, `milestone_description`, `milestone_category`, `milestone_sort_order`
- `question_id`, `question_sort_order`, `question_title`, `question_description`
- `status`, `confidence`, `rationale`, `evaluation_modes`, `assessment_updated_at`
- `recommended_source_1_title`, `recommended_source_1_url`, `recommended_source_1_note`
- `recommended_source_2_title`, `recommended_source_2_url`, `recommended_source_2_note`

## Evidence Columns

- `evidence_id`: Stable unique ID for the evidence row.
- `question_id`: Must match a `question_id` in `Questions`.
- `evidence_title`: Human-readable title shown in the UI.
- `source_type`: `benchmark`, `leaderboard`, `research_paper`, `news`, or `implementation`.
- `source_name`: Source or publisher shown in the UI.
- `url`: Required published link.
- `published_date`: `YYYY-MM-DD` when known.
- `short_explanation`: Short evidence summary.
- `metric_name`, `metric_value`, `metric_unit`, `model`: Optional benchmark details.
- `notes`: Extra internal context appended to the displayed summary.
- `active`: Leave blank or set to `Yes` to publish. Set to `No` to keep a row in the workbook without publishing it.

## Commands

- `npm run setup-workbook`
  Rebuilds the workbook from the archived legacy milestone JSON and writes the simplified two-sheet workbook.
- `npm run validate-content`
  Validates workbook structure, IDs, URLs, dates, and evidence references.
- `npm run build`
  Validates the workbook and builds the static site.
