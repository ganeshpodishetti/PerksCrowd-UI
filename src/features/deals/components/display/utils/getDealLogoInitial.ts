import type { Deal } from '@/shared/types';

export const getDealLogoInitial = (deal: Pick<Deal, 'storeName' | 'title'>): string => {
  const candidate = deal.storeName?.trim() || deal.title?.trim() || '?';
  return candidate.charAt(0).toUpperCase();
};

