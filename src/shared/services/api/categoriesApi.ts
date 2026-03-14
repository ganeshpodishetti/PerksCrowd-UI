/**
 * categoriesApi – typed wrappers for every /api/categories endpoint.
 *
 * Create/Update use JSON (not FormData).  204 responses return void.
 */

import { apiClient, publicApiClient } from './apiClient';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/shared/types/api/requests';
import type {
  CategoryResponse,
  CreateCategoryResponse,
} from '@/shared/types/api/responses';

export const categoriesApi = {
  /** GET /api/categories → 200 CategoryResponse[] */
  getAll: () =>
    publicApiClient
      .get<CategoryResponse[]>('/api/categories')
      .then((r) => r.data),

  /** GET /api/categories/{id} → 200 CategoryResponse | 404 */
  getById: (id: string) =>
    publicApiClient
      .get<CategoryResponse>(`/api/categories/${id}`)
      .then((r) => r.data),

  /** POST /api/categories (auth) → 201 CreateCategoryResponse */
  create: (data: CreateCategoryRequest) =>
    apiClient
      .post<CreateCategoryResponse>('/api/categories', data)
      .then((r) => r.data),

  /** PUT /api/categories/{id} (SuperAdminOnly) → 204 */
  update: (id: string, data: UpdateCategoryRequest): Promise<void> =>
    apiClient
      .put(`/api/categories/${id}`, data)
      .then(() => undefined),

  /** DELETE /api/categories/{id} (SuperAdminOnly) → 204 */
  remove: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/categories/${id}`)
      .then(() => undefined),
};

