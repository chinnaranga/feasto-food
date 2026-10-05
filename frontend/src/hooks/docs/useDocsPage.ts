import { useMemo } from 'react';
import { useDocsStore } from '../../store/docs/docsStore';
import { DOCS_PAGES, COMPONENT_EXAMPLES } from '../../constants/docs';
import { DocsPage } from '../../types/docs';

export const useDocsPage = () => {
  const activePageId = useDocsStore((state) => state.activePageId);

  const data = useMemo(() => {
    // If it's a component page
    if (activePageId.startsWith('comp-')) {
      const compId = activePageId.replace('comp-', '');
      const comp = COMPONENT_EXAMPLES.find((c) => c.id === compId);

      if (comp) {
        const syntheticPage: DocsPage = {
          id: activePageId,
          title: `${comp.name} Component`,
          summary: comp.description,
          category: 'components',
          tags: ['Component', 'UI'],
          content: `
# ${comp.name} Component

${comp.description}

## Usage Guidelines
Follow the Do and Don't rules listed below to match Feasto's layout patterns.
          `,
        };
        return { page: syntheticPage, component: comp };
      }
    }

    // Standard documentation page
    const page = DOCS_PAGES.find((p) => p.id === activePageId);
    return { page: page || DOCS_PAGES[0], component: null };
  }, [activePageId]);

  return data;
};
export default useDocsPage;
