/**
 * storesApi – typed wrappers for every /api/stores endpoint.
 *
 * Create/Update use plain JSON.  204 responses return void.
 */

import type {
    CreateStoreRequest,
    UpdateStoreRequest
} from '@/shared/types/api/requests';
import type {
    CreateStoreResponse,
    StoreResponse
} from '@/shared/types/api/responses';
import { apiClient, publicApiClient } from './apiClient';

export const storesApi = {
  /** GET /api/stores → 200 StoreResponse[] */
  getAll: () =>
    publicApiClient
      .get<StoreResponse[]>('/api/stores')
      .then((r) => r.data),

  /** GET /api/stores/{id} → 200 StoreResponse | 404 */
  getById: (id: string) =>
    publicApiClient
      .get<StoreResponse>(`/api/stores/${id}`)
      .then((r) => r.data),

  /** POST /api/stores (auth) → 201 CreateStoreResponse */
  create: (data: CreateStoreRequest) =>
    apiClient
      .post<CreateStoreResponse>('/api/stores', data)
      .then((r) => r.data),

  /** PUT /api/stores/{id} (SuperAdminOnly) → 204 */
  update: (id: string, data: UpdateStoreRequest): Promise<void> =>
    apiClient
      .put(`/api/stores/${id}`, data)
      .then(() => undefined),

  /** DELETE /api/stores/{id} (SuperAdminOnly) → 204 */
  remove: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/stores/${id}`)
      .then(() => undefined),
};

