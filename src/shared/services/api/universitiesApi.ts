/**
 * universitiesApi – typed wrappers for every /api/universities endpoint.
 *
 * Create/Update use multipart/form-data (file upload support).
 * isActive is serialised as the string "true" / "false" per backend contract.
 * 204 responses return void.
 */

import type {
    CreateUniversityRequest,
    UpdateUniversityRequest
} from '@/shared/types/api/requests';
import type {
    CreateUniversityResponse,
    UniversityResponse
} from '@/shared/types/api/responses';
import { apiClient, buildFormData, publicApiClient } from './apiClient';

export const universitiesApi = {
  /** GET /api/universities → 200 UniversityResponse[] */
  getAll: () =>
    publicApiClient
      .get<UniversityResponse[]>('/api/universities')
      .then((r) => r.data),

  /** GET /api/universities/{id} → 200 UniversityResponse | 404 */
  getById: (id: string) =>
    publicApiClient
      .get<UniversityResponse>(`/api/universities/${id}`)
      .then((r) => r.data),

  /**
   * POST /api/universities (auth) → 201 CreateUniversityResponse
   * Sent as multipart/form-data.
   */
  create: (data: CreateUniversityRequest) => {
    const fd = buildFormData(data as unknown as Record<string, unknown>);
    return apiClient
      .post<CreateUniversityResponse>('/api/universities', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  /**
   * PUT /api/universities/{id} (SuperAdminOnly) → 204
   * Sent as multipart/form-data; isActive is "true" / "false".
   */
  update: (id: string, data: UpdateUniversityRequest): Promise<void> => {
    const fd = buildFormData(data as unknown as Record<string, unknown>);
    return apiClient
      .put(`/api/universities/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => undefined);
  },

  /** DELETE /api/universities/{id} (SuperAdminOnly) → 204 */
  remove: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/universities/${id}`)
      .then(() => undefined),
};

