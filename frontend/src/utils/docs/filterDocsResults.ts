import { DocsSearchResult } from '../../types/docs';

export const filterSearchMatches = (
  results: DocsSearchResult[],
  minScore = 5
): DocsSearchResult[] => {
  return results.filter((res) => res.score >= minScore);
};
export default filterSearchMatches;
