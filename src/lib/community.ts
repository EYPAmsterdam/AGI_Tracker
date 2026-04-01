export const buildCommunityHref = ({
  dimensionId,
  questionId,
  source
}: {
  dimensionId?: string;
  questionId?: string;
  source?: string;
} = {}) => {
  const params = new URLSearchParams();

  if (dimensionId) {
    params.set("dimensionId", dimensionId);
  }

  if (questionId) {
    params.set("questionId", questionId);
  }

  if (source) {
    params.set("source", source);
  }

  const query = params.toString();

  return query ? `/community?${query}` : "/community";
};
