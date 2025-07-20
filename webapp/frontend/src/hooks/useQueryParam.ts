import { useLocation } from 'react-router-dom';

/**
 * Custom hook to get a query parameter from the URL.
 * @param key The query parameter key to retrieve.
 * @returns The value of the query parameter, or null if not present.
 */
export function useQueryParam(key: string): string | null {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(key);
}
