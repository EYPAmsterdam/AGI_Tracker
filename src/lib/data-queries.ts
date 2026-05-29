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
  const trackedMilestoneCount = milestones.reduce(
    (sum, milestone) => sum + milestone.subQuestions.length,
    0
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
  const subQuestionStatusCounts = milestones.reduce(
    (acc, milestone) => {
      for (const subQuestion of milestone.subQuestions) {
        acc[subQuestion.status] += 1;
      }
      return acc;
    },
    { met: 0, in_progress: 0, not_met: 0, unassessed: 0 }
  );
  const progressAverage = Math.round(
    (subQuestionCoverage / Math.max(1, trackedMilestoneCount)) * 100
  );

  return {
    met,
    inProgress,
    notMet,
    unassessed,
    progressAverage,
    trackedMilestoneCount,
    evidenceCount: evidenceRecords.length,
    subQuestionCoverage,
    subQuestionsMet: subQuestionStatusCounts.met,
    subQuestionsInProgress: subQuestionStatusCounts.in_progress,
    subQuestionsNotMet:
      trackedMilestoneCount -
      subQuestionStatusCounts.met -
      subQuestionStatusCounts.in_progress
  };
};

export const getOverviewDimensionProgress = () =>
  getMilestoneDataset().milestones.map((milestone) => ({
    id: milestone.id,
    label: milestone.category,
    progressPercent: milestone.progressPercent,
    status: milestone.status
  }));
