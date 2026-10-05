import { DocsPage, DocsCategory } from '../../types/docs';

export const buildCategoryTree = (pages: DocsPage[]) => {
  const categories: Record<DocsCategory, DocsPage[]> = {
    overview: [],
    tokens: [],
    components: [],
    patterns: [],
    accessibility: [],
    onboarding: [],
  };

  pages.forEach((page) => {
    if (categories[page.category]) {
      categories[page.category].push(page);
    }
  });

  return categories;
};
export default buildCategoryTree;
