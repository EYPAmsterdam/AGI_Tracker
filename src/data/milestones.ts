import "server-only";

import { getMilestoneDataset } from "@/lib/content-loader";

export { getMilestoneDataset };

export const getMilestones = () => getMilestoneDataset().milestones;

export const getMilestoneContents = () => getMilestoneDataset().milestoneContents;

export const getEvidenceRecords = () => getMilestoneDataset().evidenceRecords;

export const getMilestoneCategories = () => getMilestoneDataset().milestoneCategories;

export const getLatestUpdatedAt = () => getMilestoneDataset().latestUpdatedAt;
