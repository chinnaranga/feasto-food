import { DOCS_PAGES, COMPONENT_EXAMPLES } from '../../constants/docs';
import { DocsSearchResult } from '../../types/docs';

export const fuzzySearchDocs = (query: string): DocsSearchResult[] => {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: DocsSearchResult[] = [];

  // Search through standard pages
  DOCS_PAGES.forEach((page) => {
    let score = 0;

    if (page.title.toLowerCase().includes(cleanQuery)) {
      score += 50;
    }
    if (page.summary.toLowerCase().includes(cleanQuery)) {
      score += 20;
    }
    if (page.content.toLowerCase().includes(cleanQuery)) {
      score += 10;
    }
    if (page.tags.some((t) => t.toLowerCase().includes(cleanQuery))) {
      score += 30;
    }

    if (score > 0) {
      results.push({
        pageId: page.id,
        title: page.title,
        category: page.category,
        summary: page.summary,
        score,
      });
    }
  });

  // Search through component examples
  COMPONENT_EXAMPLES.forEach((comp) => {
    let score = 0;

    if (comp.name.toLowerCase().includes(cleanQuery)) {
      score += 60;
    }
    if (comp.description.toLowerCase().includes(cleanQuery)) {
      score += 25;
    }

    if (score > 0) {
      results.push({
        pageId: `comp-${comp.id}`,
        title: `${comp.name} Component`,
        category: 'components',
        summary: comp.description,
        score,
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
};
export default fuzzySearchDocs;
