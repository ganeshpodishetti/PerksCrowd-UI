'use client'
import React from 'react';
import { Deals } from './DealList/Deals';

interface DealListProps {
  initialCategory?: string;
  initialStore?: string;
}

const DealList: React.FC<DealListProps> = ({ initialCategory, initialStore }) => {
  // The marketing hero only makes sense on the unfiltered catalogue.
  const showHero = !initialCategory && !initialStore;

  return (
    <Deals initialCategory={initialCategory} initialStore={initialStore}>
      <Deals.Status />
      {showHero && <Deals.Hero />}
      <Deals.SearchResults />
      <Deals.Filters />
      <Deals.Grid />
      <Deals.LoadMore />
    </Deals>
  );
};

export default DealList;
