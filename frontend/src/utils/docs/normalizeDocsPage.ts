import { DocsPage } from '../../types/docs';

export const normalizeDocsText = (page: DocsPage): string => {
  return `${page.title} ${page.summary} ${page.content} ${page.tags.join(' ')}`.toLowerCase();
};
export default normalizeDocsText;
