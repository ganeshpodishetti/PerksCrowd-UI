/**
 * SubmittedDeal entity.
 * NOTE: The backend response uses `name` (not `title`) for the deal title.
 * The request payload uses `title`.
 */
export interface SubmittedDeal {
  id: string;
  /** Backend returns the submitted title as `name` */
  name: string;
  url: string;
  promoCode?: string;
  markedAsRead: boolean;
  sentAt: string;
}

export type {
  SubmitDealRequest,
  MarkAsReadDealRequest,
} from '@/shared/types/api/requests';

export type { SubmittedDealResponse } from '@/shared/types/api/responses';
