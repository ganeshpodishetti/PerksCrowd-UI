/**
 * usersApi – typed wrappers for every /api/users endpoint.
 *
 * DELETE / (self-delete, auth required) → 204 void.
 * DELETE /{id} (SuperAdminOnly) → 204 void.
 */

import type { GetUserResponse } from '@/shared/types/api/responses';
import { apiClient } from './apiClient';

export const usersApi = {
  /** GET /api/users (SuperAdminOnly) → 200 GetUserResponse[] */
  getAll: () =>
    apiClient
      .get<GetUserResponse[]>('/api/users')
      .then((r) => r.data),

  /** DELETE /api/users/{id} (SuperAdminOnly) → 204 */
  deleteById: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/users/${id}`)
      .then(() => undefined),

  /** DELETE /api/users (auth) – delete own account → 204 */
  deleteSelf: (): Promise<void> =>
    apiClient
      .delete('/api/users')
      .then(() => undefined),
};

