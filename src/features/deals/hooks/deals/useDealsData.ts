import {
  useDealsInfiniteQuery,
  useFeaturedFeedQuery,
  useHomeFeedQuery,
  useLatestFeedQuery,
  usePopularFeedQuery,
  useTrendingFeedQuery,
} from '@/features/deals/hooks/useDealsQuery';
import { Deal } from '@/shared/types/entities/deal';
import type { FeedType } from '@/shared/types/api/responses';
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

  const latestFeedQuery = useLatestFeedQuery({ enabled: feedType === 'latest' });
  const featuredFeedQuery = useFeaturedFeedQuery({ enabled: feedType === 'featured' });
  const popularFeedQuery = usePopularFeedQuery({ enabled: feedType === 'popular' });
  const trendingFeedQuery = useTrendingFeedQuery({ enabled: feedType === 'trending' });

  const singleFeedQuery = useMemo(() => {
    switch (feedType) {
      case 'latest':
        return latestFeedQuery;
      case 'featured':
        return featuredFeedQuery;
      case 'popular':
        return popularFeedQuery;
      case 'trending':
        return trendingFeedQuery;
      default:
        return null;
    }
  }, [feedType, latestFeedQuery, featuredFeedQuery, popularFeedQuery, trendingFeedQuery]);

  // Flatten all pages into a single array of deals
  const deals = useMemo(() => {
    if (isSingleFeedMode) return singleFeedQuery?.data ?? [];
    if (useFeedApis) return homeFeedData ?? [];
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.items);
  }, [data?.pages, homeFeedData, isSingleFeedMode, singleFeedQuery?.data, useFeedApis]);

  const activeLoading = isSingleFeedMode
    ? singleFeedQuery?.isLoading ?? false
    : useFeedApis
      ? isLoadingHomeFeed
      : isLoading;
  const activeError = isSingleFeedMode
    ? singleFeedQuery?.error
    : useFeedApis
      ? homeFeedError
      : error;

  return {
    deals,
    loading: activeLoading,
    error: activeError ? 'Failed to load deals. Please try again later.' : null,
    refetch: async () => {
      if (isSingleFeedMode && singleFeedQuery?.refetch) {
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
