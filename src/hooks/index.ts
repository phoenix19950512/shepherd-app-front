import { debounce } from 'lodash';
import { useState, useEffect, useCallback } from 'react';

type SearchAction = (query: string) => void;

export const useTitle = (title: string) =>
  (document.title = title ? `${title} - Shepherd Tutors` : 'Shepherd Tutors');

export const useSearch = (
  action: SearchAction,
  throttleTime = 1000
): SearchAction => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // eslint-disable-next-line
  const throttledAction = useCallback(debounce(action, throttleTime), [
    action,
    throttleTime
  ]);

  useEffect(() => {
    if (searchQuery) {
      throttledAction(searchQuery);
    }
  }, [searchQuery, throttledAction, hasSearched]);

  const handleSearch: SearchAction = useCallback(
    (query) => {
      if (query) {
        setSearchQuery(query);
      }
      if (!query && hasSearched) {
        action(query);
      }
      if (!hasSearched) {
        setHasSearched(true);
      }
    },
    [hasSearched, action]
  );

  return handleSearch;
};
