/**
 * submitDealApi – typed wrappers for the /api submit-deal endpoints.
 *
 * IMPORTANT: base path is /api (not /api/submit-deals).
 * 202 from POST /submit-deal is a success with a message body.
 * 204 from mutations → void.
 */

import type {
    MarkAsReadDealRequest,
    SubmitDealRequest
} from '@/shared/types/api/requests';
import type { SubmittedDealResponse } from '@/shared/types/api/responses';
import { apiClient, publicApiClient } from './apiClient';

export const submitDealApi = {
  /**
   * POST /api/submit-deal → 202 { message }
   * No auth required.
   */
  submit: (data: SubmitDealRequest) =>
    publicApiClient
      .post<{ message: string }>('/api/submit-deal', data)
      .then((r) => r.data),

  /** GET /api/get-submitted-deals (SuperAdminOnly) → 200 SubmittedDealResponse[] */
  getAll: () =>
    apiClient
      .get<SubmittedDealResponse[]>('/api/get-submitted-deals')
      .then((r) => {
        if (r.status === 204 || !r.data) return [];
        return Array.isArray(r.data) ? r.data : [];
      }),

  /** GET /api/get-submitted-deal-by-id/{id} (SuperAdminOnly) → 200 | 404 */
  getById: (id: string) =>
    apiClient
      .get<SubmittedDealResponse>(`/api/get-submitted-deal-by-id/${id}`)
      .then((r) => r.data),

  /** PUT /api/mark-as-read/{id} (SuperAdminOnly) → 204 */
  markAsRead: (id: string, data: MarkAsReadDealRequest): Promise<void> =>
    apiClient
      .put(`/api/mark-as-read/${id}`, data)
      .then(() => undefined),

  /** DELETE /api/delete-submitted-deal/{id} (SuperAdminOnly) → 204 */
  remove: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/delete-submitted-deal/${id}`)
      .then(() => undefined),
};

