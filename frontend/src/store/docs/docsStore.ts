import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DocsStoreState {
  activePageId: string;
  searchQuery: string;
  collapsedSidebar: boolean;
  bookmarkedPages: string[];
  readingProgressPercentage: number;
  selectedComponentVariant: string;
  codeSnippetMode: 'tsx' | 'html';

  // Actions
  setActivePageId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  toggleBookmark: (pageId: string) => void;
  setReadingProgress: (progress: number) => void;
  setComponentVariant: (variant: string) => void;
  setCodeSnippetMode: (mode: 'tsx' | 'html') => void;
}

export const useDocsStore = create<DocsStoreState>()(
  persist(
    (set) => ({
      activePageId: 'overview',
      searchQuery: '',
      collapsedSidebar: false,
      bookmarkedPages: ['tokens', 'components'],
      readingProgressPercentage: 0,
      selectedComponentVariant: 'primary',
      codeSnippetMode: 'tsx',

      setActivePageId: (activePageId) => set({ activePageId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleSidebar: () => set((state) => ({ collapsedSidebar: !state.collapsedSidebar })),
      toggleBookmark: (pageId) =>
        set((state) => ({
          bookmarkedPages: state.bookmarkedPages.includes(pageId)
            ? state.bookmarkedPages.filter((id) => id !== pageId)
            : [...state.bookmarkedPages, pageId],
        })),
      setReadingProgress: (readingProgressPercentage) => set({ readingProgressPercentage }),
      setComponentVariant: (selectedComponentVariant) => set({ selectedComponentVariant }),
      setCodeSnippetMode: (codeSnippetMode) => set({ codeSnippetMode }),
    }),
    {
      name: 'feasto-design-system-docs-store',
      partialize: (state) => ({
        bookmarkedPages: state.bookmarkedPages,
        codeSnippetMode: state.codeSnippetMode,
      }),
    }
  )
);

export default useDocsStore;
