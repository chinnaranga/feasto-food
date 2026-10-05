import { DesignToken, DocsPage, ComponentExample } from '../types/docs';

export const DesignTokenConstants = {
  COLORS: [
    { name: '--brand-orange', value: '#e35205', category: 'color', usageNotes: 'Primary brand accent color for active buttons, key CTAs, and active navigation badges.', previewColor: '#e35205', description: 'Primary brand accent color' },
    { name: '--neutral-900', value: '#0f172a', category: 'color', usageNotes: 'Primary text color for headlines and high-emphasis labels.', previewColor: '#0f172a', description: 'Headlines and high-emphasis text' },
    { name: '--neutral-500', value: '#64748b', category: 'color', usageNotes: 'Secondary text color for subtitles, timestamps, and metadata.', previewColor: '#64748b', description: 'Subtitles and secondary labels' },
    { name: '--neutral-100', value: '#f1f5f9', category: 'color', usageNotes: 'Soft neutral background tint for cards and input fields.', previewColor: '#f1f5f9', description: 'Soft card tint' },
    { name: '--neutral-50', value: '#f8fafc', category: 'color', usageNotes: 'Page body background color.', previewColor: '#f8fafc', description: 'Body background' },
    { name: '--border-subtle', value: '#e2e8f0', category: 'color', usageNotes: '1px border color for cards and container boundaries.', previewColor: '#e2e8f0', description: 'Border boundary' },
  ] as DesignToken[],

  SPACING: [
    { name: 'spacing-xs', value: '4px', category: 'spacing', usageNotes: 'Tight element gap for badges and status indicators.', description: '4px element gap' },
    { name: 'spacing-sm', value: '8px', category: 'spacing', usageNotes: 'Compact padding for buttons and input controls.', description: '8px compact padding' },
    { name: 'spacing-md', value: '16px', category: 'spacing', usageNotes: 'Standard card inner padding and section margins.', description: '16px card padding' },
    { name: 'spacing-lg', value: '24px', category: 'spacing', usageNotes: 'Major section grid gaps and container padding.', description: '24px section gap' },
  ] as DesignToken[],
};

export const COLOR_TOKENS: DesignToken[] = DesignTokenConstants.COLORS;
export const SPACING_TOKENS: DesignToken[] = DesignTokenConstants.SPACING;
export const COMPONENT_EXAMPLES: ComponentExample[] = [];

export const DOCS_PAGES: DocsPage[] = [
  { id: 'overview', title: 'Design System Overview', summary: 'Product philosophy, visual principles, light-theme rules, and motion guidelines.', category: 'overview', tags: ['philosophy', 'principles', 'light-theme'], version: 'v2.4.1' },
  { id: 'tokens', title: 'Design Tokens', summary: 'Color palette swatches, typography scales, spacing grids, radius tokens, and elevation shadows.', category: 'tokens', tags: ['colors', 'typography', 'spacing', 'tokens'], version: 'v2.4.1' },
  { id: 'components', title: 'Component Catalog', summary: 'Live interactive component sandbox and prop specs for Button, Input, Card, Badge, Modal, Drawer, Table, Tabs, Chips, Status Pills.', category: 'components', tags: ['button', 'input', 'card', 'badge', 'modal', 'table', 'tabs'], version: 'v2.4.1' },
  { id: 'patterns', title: 'Patterns & Architecture Guidelines', summary: 'Page layout structures, form handling guidelines, data table patterns, error states, and responsive breakpoints.', category: 'patterns', tags: ['layouts', 'forms', 'tables', 'search'], version: 'v2.4.1' },
  { id: 'accessibility', title: 'Accessibility Guide (WCAG 2.1 AA)', summary: 'Focus outline management, keyboard navigation maps, color contrast ratios, screen reader ARIA roles.', category: 'accessibility', tags: ['a11y', 'focus', 'keyboard', 'aria', 'contrast'], version: 'v2.4.1' },
  { id: 'onboarding', title: 'Developer Onboarding & Handover Guide', summary: 'Codebase folder structure walkthrough, component creation guide, state management rules, release engineering protocols.', category: 'onboarding', tags: ['onboarding', 'folder-structure', 'dx', 'release'], version: 'v2.4.1' },
];
