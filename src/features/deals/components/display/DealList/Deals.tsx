'use client'

import { useDealsSearch } from "@/features/deals/hooks/deals/useDealsSearch";
import { generateEmptyDealsMessage } from "@/features/deals/utils/dealFormatting";
import { useDealsData } from "@/features/deals/hooks/deals/useDealsData";
import {
    sortOptions,
    useDealsFilter,
    type SortOption,
} from "@/features/deals/hooks/deals/useDealsFilter";
import { useDealsLoadMore } from "@/features/deals/hooks/deals/useDealsLoadMore";
import { Button } from "@/shared/components/ui/button";
import { ensureClientContext } from '@/shared/utils/runtimeSafety';
import type { Deal } from "@/shared/types/entities/deal";
import type { FeedType } from '@/shared/types/api/responses';
import React, { createContext, ReactNode, use } from "react";
import HeroSearchSection from "../../search/HeroSearchSection/HeroSearchSection";
import DealSkeleton from "../DealSkeleton/DealSkeleton";
import { DealsFilters as DealsFiltersBar } from "./DealsFilters";
import { DealsGrid } from "./DealsGrid";
import { DealsLoadMore } from "./DealsLoadMore";

interface DealsContextValue {
  deals: Deal[];
  filteredDeals: Deal[];
  displayedDeals: Deal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isSearching: boolean;
  hasSearched: boolean;
  searchResults: Deal[];
  handleSearchResults: (deals: Deal[], loading: boolean, searched: boolean) => void;
  emptyMessage: string;
  searchTerm: string;
  selectedCategory: string;
  selectedStore: string;
  activeSort: SortOption;
  setActiveSort: (sort: SortOption) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}

const DealsContext = createContext<DealsContextValue | null>(null);

const fallbackDealsContext: DealsContextValue = {
  deals: [],
  filteredDeals: [],
  displayedDeals: [],
  loading: false,
  error: null,
  refetch: async () => undefined,
  isSearching: false,
  hasSearched: false,
  searchResults: [],
  handleSearchResults: () => undefined,
  emptyMessage: '',
  searchTerm: '',
  selectedCategory: 'All',
  selectedStore: 'All',
  activeSort: sortOptions[0],
  setActiveSort: () => undefined,
  hasMore: false,
  isLoadingMore: false,
  loadMore: () => undefined,
};

const useDealsContext = (): DealsContextValue =>
  ensureClientContext(
    use(DealsContext),
    fallbackDealsContext,
    'Deals.* components must be rendered inside <Deals>.',
  );

interface DealsProps {
  initialCategory?: string;
  initialStore?: string;
  initialSearchQuery?: string;
  excludeUniversitySpecific?: boolean;
  feedType?: FeedType;
  children: ReactNode;
}

function DealsRoot({
  initialCategory,
  initialStore,
  initialSearchQuery = '',
  excludeUniversitySpecific = false,
  feedType,
  children,
}: DealsProps) {
  const {
    deals,
    loading,
    error,
    refetch,
    hasMore: serverHasMore,
    isFetchingNextPage,
    fetchNextPage,
  } = useDealsData({ feedType });

  const {
    searchResults,
    isSearching,
    hasSearched,
    handleSearchResults,
  } = useDealsSearch({ initialSearchQuery });

  const {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setActiveSort,
  } = useDealsFilter({
    deals,
    initialCategory,
    initialStore,
    excludeUniversitySpecific,
  });

  // Use search results if available, otherwise use filtered deals
  const dealsToDisplay = hasSearched ? searchResults : filteredDeals;

  const { displayedDeals, hasMore, isLoadingMore, loadMore } = useDealsLoadMore({
    deals: dealsToDisplay,
    hasMore: serverHasMore,
    isFetchingNextPage,
    fetchNextPage,
  });

  const emptyMessage = generateEmptyDealsMessage(
    hasSearched,
    searchResults.length,
    searchTerm,
    selectedCategory,
    selectedStore,
  );

  const value: DealsContextValue = {
    deals,
    filteredDeals,
    displayedDeals,
    loading,
    error,
    refetch,
    isSearching,
    hasSearched,
    searchResults,
    handleSearchResults,
    emptyMessage,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setActiveSort,
    hasMore,
    isLoadingMore,
    loadMore,
  };

  return (
    <DealsContext value={value}>
      <div className="bg-white dark:bg-neutral-950">{children}</div>
    </DealsContext>
  );
}

/** Catalogue heading, shown only while loading or on error. */
function DealsStatus() {
  const { loading, error } = useDealsContext();
  if (!loading && !error) return null;

  return (
    <div className="mb-10 text-center">
      <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-100">
        Student Deals
      </h1>
      <p className="mt-2 text-sm text-brand-700 dark:text-brand-300">
        {loading ? 'Loading the best offers for students…' : 'Exclusive offers for students'}
      </p>
    </div>
  );
}

/** Marketing heading plus the search box. */
function DealsHero() {
  const { loading, error, handleSearchResults } = useDealsContext();
  if (loading || error) return null;

  return (
    <>
      <div className="mb-6 text-center max-w-4xl mx-auto px-4">
        <h1 className="md:text-3xl font-extrabold text-brand-900 dark:text-brand-100 mb-6 leading-tight">
          Unlock Exclusive Student Discounts & Deals
        </h1>
      </div>
      <HeroSearchSection
        onSearchResults={handleSearchResults}
        placeholder="Search for deals, stores, or categories…"
      />
    </>
  );
}

/** Confirmation header after a search. */
function DealsSearchResults() {
  const { loading, error, hasSearched, isSearching, searchResults } = useDealsContext();
  if (loading || error || !hasSearched) return null;

  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100">
        {isSearching ? 'Searching…' : `Found ${searchResults.length} deals`}
      </h2>
    </div>
  );
}

/** Sort controls and result count. */
function DealsFiltersSection() {
  const {
    loading,
    error,
    hasSearched,
    deals,
    filteredDeals,
    selectedCategory,
    selectedStore,
    searchTerm,
    activeSort,
    setActiveSort,
  } = useDealsContext();
  if (loading || error || hasSearched) return null;

  return (
    <DealsFiltersBar
      sortOptions={sortOptions}
      activeSort={activeSort}
      onSortChange={setActiveSort}
      totalDeals={deals.length}
      filteredDeals={filteredDeals.length}
      selectedCategory={selectedCategory}
      selectedStore={selectedStore}
      searchTerm={searchTerm}
    />
  );
}

/** Grid, skeleton, empty and error states. */
function DealsGridSection() {
  const { loading, error, refetch, isSearching, displayedDeals, emptyMessage } = useDealsContext();

  if (loading) return <DealSkeleton count={8} />;

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-700 dark:text-brand-300 font-medium mb-4">{error}</p>
        <Button
          onClick={refetch}
          className="bg-brand-900 hover:bg-brand-700 dark:bg-brand-100 dark:text-brand-900 dark:hover:bg-brand-300"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <DealsGrid
      deals={displayedDeals}
      loading={isSearching}
      emptyMessage={emptyMessage}
    />
  );
}

/** Pagination control, hidden while searching. */
function DealsLoadMoreSection() {
  const {
    loading,
    error,
    hasSearched,
    hasMore,
    isLoadingMore,
    loadMore,
    filteredDeals,
  } = useDealsContext();
  if (loading || error || hasSearched) return null;

  return (
    <DealsLoadMore
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={loadMore}
      totalDeals={filteredDeals.length}
    />
  );
}

export const Deals = Object.assign(DealsRoot, {
  Status: DealsStatus,
  Hero: DealsHero,
  SearchResults: DealsSearchResults,
  Filters: DealsFiltersSection,
  Grid: DealsGridSection,
  LoadMore: DealsLoadMoreSection,
});
