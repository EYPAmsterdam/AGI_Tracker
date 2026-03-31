import "server-only";

import { getMilestoneDataset } from "@/data/milestones";
import { sortByUpdatedAt, statusToProgressValue } from "@/lib/milestone-utils";

export const getMilestoneById = (id: string) =>
  getMilestoneDataset().milestones.find((milestone) => milestone.id === id);

export const getRecentMilestoneUpdates = (limit = 5) =>
  sortByUpdatedAt(getMilestoneDataset().milestones).slice(0, limit);

export const getRecentEvidence = (limit = 8) =>
  [...getMilestoneDataset().evidenceRecords]
    .sort((left, right) => right.proofItem.date.localeCompare(left.proofItem.date))
    .slice(0, limit);

export const getOverviewStats = () => {
  const { evidenceRecords, milestones } = getMilestoneDataset();
  const met = milestones.filter((milestone) => milestone.status === "met").length;
  const inProgress = milestones.filter(
    (milestone) => milestone.status === "in_progress"
  ).length;
  const notMet = milestones.filter((milestone) => milestone.status === "not_met").length;
  const unassessed = milestones.filter(
    (milestone) => milestone.status === "unassessed"
  ).length;
  const milestoneCount = Math.max(1, milestones.length);
  const progressAverage = Math.round(
    (milestones.reduce((sum, milestone) => sum + milestone.progressPercent, 0) /
      milestoneCount)
  );
  const subQuestionCoverage = milestones.reduce(
    (sum, milestone) =>
      sum +
      milestone.subQuestions.reduce(
        (inner, subQuestion) => inner + statusToProgressValue(subQuestion.status),
        0
      ),
    0
  );

  return {
    met,
    inProgress,
    notMet,
    unassessed,
    progressAverage,
    evidenceCount: evidenceRecords.length,
    subQuestionCoverage
  };
};
