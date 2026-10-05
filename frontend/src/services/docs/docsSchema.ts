import { DocsPage, ComponentExample } from '../../types/docs';

export const createDocsPage = (page: Omit<DocsPage, 'tags'> & { tags?: string[] }): DocsPage => {
  return {
    ...page,
    tags: page.tags || [],
  };
};

export const createComponentExample = (example: ComponentExample): ComponentExample => {
  return example;
};
