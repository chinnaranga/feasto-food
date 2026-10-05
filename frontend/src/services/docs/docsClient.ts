import { DOCS_PAGES } from '../../constants/docs';
import { DocsPage, DocsSearchResult } from '../../types/docs';

export class DocsClientService {
  static searchDocs(query: string): DocsSearchResult[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();

    return DOCS_PAGES.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.summary.toLowerCase().includes(q) ||
        page.tags.some((t) => t.toLowerCase().includes(q))
    ).map((page) => ({
      id: `srch-${page.id}`,
      pageId: page.id,
      title: page.title,
      snippet: page.summary,
      category: page.category,
      matchType: page.title.toLowerCase().includes(q) ? 'exact' : 'content',
    }));
  }

  static getPageById(id: string): DocsPage | undefined {
    return DOCS_PAGES.find((p) => p.id === id);
  }
}

export default DocsClientService;
