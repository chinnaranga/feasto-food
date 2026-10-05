import { useMemo } from 'react';
import { useDocsStore } from '../../store/docs/docsStore';
import { fuzzySearchDocs } from '../../services/docs/docsSearch';

export const useDocsSearch = () => {
  const searchQuery = useDocsStore((state) => state.searchQuery);
  const setSearchQuery = useDocsStore((state) => state.setSearchQuery);

  const results = useMemo(() => {
    return fuzzySearchDocs(searchQuery);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    results,
  };
};
export default useDocsSearch;
