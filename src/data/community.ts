import { CommunitySuggestion } from "@/types/community";

export const communitySuggestions: CommunitySuggestion[] = [
  {
    id: "community-1",
    author: "A. Chen",
    suggestedDimension: "Separate factual accuracy from factual honesty more explicitly",
    note: "The new evidence dimension covers both, but a future revision could make bluffing-versus-being-wrong a more visible distinction in the public wording.",
    status: "reviewing",
    createdAt: "2026-03-18"
  },
  {
    id: "community-2",
    author: "J. Morales",
    suggestedDimension: "Add a stronger threshold for long-horizon drift resistance",
    note: "Repeated-use stability may deserve its own more prominent card or a more demanding question set under the reliability dimension.",
    status: "queued",
    createdAt: "2026-03-20"
  },
  {
    id: "community-3",
    author: "R. Singh",
    suggestedDimension: "Expose the hidden capability coverage map more clearly",
    note: "A lightweight legend showing which deeper dimensions each card covers could help expert users audit completeness without confusing general audiences.",
    status: "merged",
    createdAt: "2026-03-14"
  },
  {
    id: "community-4",
    author: "L. Becker",
    suggestedDimension: "Strengthen the scientific-backing note on each granular item",
    note: "Showing the best evidence forms directly in the detail view would make it easier to see what kind of science could actually satisfy each question.",
    status: "queued",
    createdAt: "2026-03-21"
  }
];
