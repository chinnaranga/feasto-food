import { useDocsStore } from '../../store/docs/docsStore';
import DocsClientService from '../../services/docs/docsClient';

export function useDocsNavigation() {
  const { searchQuery, setSearchQuery, bookmarkedPages, toggleBookmark } = useDocsStore();

  const searchResults = DocsClientService.searchDocs(searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    bookmarkedPages,
    toggleBookmark,
  };
}

export default useDocsNavigation;
