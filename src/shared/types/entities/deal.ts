/**
 * Deal entity used throughout the UI.
 * Shape mirrors DealResponse from the backend.
 */
import type { RedeemType } from '@/shared/types/api/requests';

export type { RedeemType };

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  promo?: string;
  logoUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  isUniversitySpecific: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string;
  universityImageUrl?: string;
  createdAt?: string;
}

export type {
  CreateDealRequest,
  UpdateDealRequest,
  CursorPaginationRequest,
} from '@/shared/types/api/requests';

export type {
  DealResponse,
  CursorPaginatedDealsResponse,
} from '@/shared/types/api/responses';
