// ─── Design System Documentation Types ────────────────────────────────────────

export type DocsCategory =
  | 'overview'
  | 'tokens'
  | 'components'
  | 'patterns'
  | 'accessibility'
  | 'onboarding';

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'z-index';
  usageNotes: string;
  description?: string;
  previewColor?: string;
  previewType?: string;
}

export interface DocsPage {
  id: string;
  title: string;
  summary: string;
  category: DocsCategory;
  tags: string[];
  version: string;
  content?: string;
  relatedPages?: string[];
}

export interface DocsSearchResult {
  id: string;
  pageId: string;
  title: string;
  snippet: string;
  summary?: string;
  score?: number;
  category: DocsCategory;
  matchType: 'exact' | 'tag' | 'content';
}

export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  code: string;
}
