import { useCallback } from 'react';
import { useDocsStore } from '../../store/docs/docsStore';

export const useDocsBookmarks = () => {
  const bookmarkedPages = useDocsStore((state) => state.bookmarkedPages);
  const toggleBookmark = useDocsStore((state) => state.toggleBookmark);

  const isBookmarked = useCallback((pageId: string) => {
    return bookmarkedPages.includes(pageId);
  }, [bookmarkedPages]);

  return {
    bookmarks: bookmarkedPages,
    isBookmarked,
    toggleBookmark,
  };
};
export default useDocsBookmarks;
