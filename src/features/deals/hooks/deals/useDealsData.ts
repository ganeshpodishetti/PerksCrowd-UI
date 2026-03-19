import {
    useDealsInfiniteQuery,
    useHomeFeedQuery,
    useSingleFeedQuery
} from '@/features/deals/hooks/useDealsQuery';
import type { FeedType } from '@/shared/types/api/responses';
import { Deal } from '@/shared/types/entities/deal';
import { useMemo } from 'react';

interface UseDealsDataReturn {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useDealsData = ({
  useFeedApis = false,
  feedType,
}: {
  useFeedApis?: boolean;
  feedType?: FeedType;
} = {}): UseDealsDataReturn => {
  const isSingleFeedMode = Boolean(feedType);
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    hasNextPage, 
    isFetchingNextPage, 
    fetchNextPage 
  } = useDealsInfiniteQuery({ enabled: !useFeedApis && !isSingleFeedMode });

  const {
    data: homeFeedData,
    isLoading: isLoadingHomeFeed,
    error: homeFeedError,
    refetch: refetchHomeFeed,
  } = useHomeFeedQuery({ enabled: useFeedApis && !isSingleFeedMode });

  const singleFeedQuery = useSingleFeedQuery(feedType, { enabled: isSingleFeedMode });

  // Flatten all pages into a single array of deals
  const deals = useMemo(() => {
    if (isSingleFeedMode) return singleFeedQuery.data ?? [];
    if (useFeedApis) return homeFeedData ?? [];
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.items);
  }, [data?.pages, homeFeedData, isSingleFeedMode, singleFeedQuery.data, useFeedApis]);

  const activeLoading = isSingleFeedMode
    ? singleFeedQuery.isLoading
    : useFeedApis
      ? isLoadingHomeFeed
      : isLoading;
  const activeError = isSingleFeedMode
    ? singleFeedQuery.error
    : useFeedApis
      ? homeFeedError
      : error;

  return {
    deals,
    loading: activeLoading,
    error: activeError ? 'Failed to load deals. Please try again later.' : null,
    refetch: async () => {
      if (isSingleFeedMode) {
        await singleFeedQuery.refetch();
      } else if (useFeedApis) {
        await refetchHomeFeed();
      } else {
        await refetch();
      }
    },
    hasMore: useFeedApis || isSingleFeedMode ? false : !!hasNextPage,
    isFetchingNextPage: useFeedApis || isSingleFeedMode ? false : isFetchingNextPage,
    fetchNextPage: () => {
      if (!useFeedApis && !isSingleFeedMode && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };
};
