import type { DealResponse } from '@/shared/types/api/responses';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { dealService } from '../services/dealService';

interface SearchParams {
  query?: string;
  category?: string;
  store?: string;
  university?: string;
  isActive?: boolean;
}

interface UseSearchDealsResult {
  deals: DealResponse[];
  isLoading: boolean;
  error: Error | null;
  searchDeals: (params: SearchParams) => void;
  clearSearch: () => void;
  isSearching: boolean;
  hasSearched: boolean;
}

export const useSearchDeals = (): UseSearchDealsResult => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [hasSearched, setHasSearched] = useState(false);
  
  // Use ref to ensure queryFn always has access to latest searchParams
  const searchParamsRef = useRef<SearchParams>(searchParams);
  searchParamsRef.current = searchParams;

  const {
    data: deals = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['deals', 'search', searchParams],
    queryFn: () => {
      const params = searchParamsRef.current;
      return dealService.searchDeals({ query: params.query });
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const searchDeals = useCallback((params: SearchParams) => {
    console.log('useSearchDeals: searchDeals called with:', params);
    setSearchParams(params);
    setHasSearched(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({});
    setHasSearched(false);
  }, []);

  return {
    deals,
    isLoading: isLoading || isFetching,
    error: error as Error | null,
    searchDeals,
    clearSearch,
    isSearching: isLoading || isFetching,
    hasSearched
  };
};
