export interface CommunitySuggestion {
  id: string;
  author: string;
  suggestedDimension: string;
  note: string;
  status: "queued" | "reviewing" | "merged";
  createdAt: string;
}

export interface CommunityFormPrefill {
  suggestedDimension: string;
  suggestedQuestion: string;
  suggestedEvidenceLink: string;
}
