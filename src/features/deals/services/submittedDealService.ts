/**
 * submittedDealService – delegates to submitDealApi.
 *
 * FIX 1: markAsRead now returns void (backend returns 204, not { message }).
 * FIX 2: deleteSubmittedDeal now returns void (204).
 * NEW:   getSubmittedDealById added.
 * FIX 3: POST /submit-deal returns 202 { message } – handled correctly.
 */
import { submitDealApi } from '@/shared/services/api/submitDealApi';
import type { MarkAsReadDealRequest, SubmitDealRequest } from '@/shared/types/api/requests';
import type { SubmittedDealResponse } from '@/shared/types/api/responses';

export type { SubmittedDealResponse as SubmittedDeal, SubmitDealRequest, MarkAsReadDealRequest };

export const submittedDealService = {
  /** POST /api/submit-deal → 202 { message } */
  async submitDeal(data: SubmitDealRequest): Promise<{ message: string }> {
    return submitDealApi.submit(data);
  },

  /** GET /api/get-submitted-deals (SuperAdminOnly) */
  async getSubmittedDeals(): Promise<SubmittedDealResponse[]> {
    return submitDealApi.getAll();
  },

  /** GET /api/get-submitted-deal-by-id/{id} (SuperAdminOnly) */
  async getSubmittedDealById(id: string): Promise<SubmittedDealResponse> {
    return submitDealApi.getById(id);
  },

  /**
   * PUT /api/mark-as-read/{id} → 204
   * FIX: was returning { message } but backend returns no body.
   */
  async markAsRead(id: string, markedAsRead: boolean): Promise<void> {
    return submitDealApi.markAsRead(id, { markedAsRead } as MarkAsReadDealRequest);
  },

  /**
   * DELETE /api/delete-submitted-deal/{id} → 204
   * FIX: was returning { message } but backend returns no body.
   */
  async deleteSubmittedDeal(id: string): Promise<void> {
    return submitDealApi.remove(id);
  },
};
