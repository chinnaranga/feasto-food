import { DOCS_PAGES } from '../../constants/docs';
import { DocsPage, DocsCategory } from '../../types/docs';

export const getPagesByCategory = (category: DocsCategory): DocsPage[] => {
  return DOCS_PAGES.filter((page) => page.category === category);
};

export const getPageById = (id: string): DocsPage | undefined => {
  return DOCS_PAGES.find((page) => page.id === id);
};

export const getRelatedPages = (page: DocsPage): DocsPage[] => {
  if (!page.relatedPages) return [];
  return DOCS_PAGES.filter((p) => page.relatedPages?.includes(p.id));
};
export default DOCS_PAGES;
