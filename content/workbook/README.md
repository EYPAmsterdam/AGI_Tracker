# Workbook Authoring Flow

The published tracker now reads from `AGI benchmark mapping.xlsx` at build time.

## Sheets

- `Capability Tracker`
  Keeps the capability map. Existing mapping columns come from the source workbook. The MVP also uses these workflow columns:
  `Assessment Status`, `Assessment Confidence`, `Evaluation Modes`, `Assessment Rationale`, `Assessment Updated At`.
- `Benchmark Registry`
  Holds benchmark and leaderboard sources that can be recommended for capabilities.
- `Evidence Entries`
  Holds the evidence that is actually published on the site. Leave rows out until you have real evidence to add.

## Evidence Entries Columns

- `Evidence ID`: Stable unique ID for the evidence row.
- `Capability ID`: Must match a `Capability ID` in `Capability Tracker`.
- `Evidence Title`: Human-readable title shown in the UI.
- `Source Type`: Used to classify the evidence as benchmark, leaderboard, research paper, news, or implementation.
- `Source Name`: Source or publisher shown in the UI.
- `URL`: Required published link.
- `Published Date`: `YYYY-MM-DD` when known.
- `Short Explanation`: Short evidence summary.
- `Benchmark ID`: Optional link back to `Benchmark Registry`.
- `Benchmark Name`: Optional display value.
- `Metric Name`, `Metric Value`, `Metric Unit`, `Model`: Optional benchmark details.
- `Notes`: Extra internal context that will be appended to the short explanation when published.
- `Active?`: Leave blank or set to `Yes` to publish. Set to `No` to keep a row in the workbook without publishing it.

## Commands

- `npm run setup-workbook`
  Adds the workflow columns and the `Evidence Entries` sheet if they are missing.
- `npm run validate-content`
  Validates workbook structure, IDs, URLs, dates, and evidence references.
- `npm run build`
  Validates the workbook and builds the static site.
