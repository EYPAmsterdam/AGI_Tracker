import fs from "node:fs";
import path from "node:path";

const LEGACY_DIRECTORIES = [
  path.join("content", "archive", "legacy-milestones"),
  path.join("content", "milestones")
];

export const resolveLegacyMilestonesDirectory = (projectRoot) => {
  const resolvedPath = LEGACY_DIRECTORIES.map((relativePath) =>
    path.join(projectRoot, relativePath)
  ).find((directoryPath) => fs.existsSync(directoryPath));

  if (!resolvedPath) {
    throw new Error(
      `Legacy milestone source directory not found. Checked: ${LEGACY_DIRECTORIES.join(", ")}`
    );
  }

  return resolvedPath;
};

export const loadLegacyMilestones = (projectRoot) => {
  const directoryPath = resolveLegacyMilestonesDirectory(projectRoot);
  const filePaths = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right));

  return filePaths.map((filePath) => ({
    filePath,
    fileName: path.basename(filePath),
    content: JSON.parse(fs.readFileSync(filePath, "utf8"))
  }));
};
