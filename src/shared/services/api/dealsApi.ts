/**
 * dealsApi – typed wrappers for every /api/deals endpoint.
 *
 * Search with empty query returns 204 → treated as an empty list, not an error.
 * 204 mutations return void.
 */

import { apiClient, publicApiClient } from './apiClient';
import type {
  CreateDealRequest,
  CursorPaginationRequest,
  UpdateDealRequest,
} from '@/shared/types/api/requests';
import type {
  CursorPaginatedDealsResponse,
  DealResponse,
} from '@/shared/types/api/responses';

const DEFAULT_PAGE_SIZE = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE ?? '10', 10);

export const dealsApi = {
  /**
   * GET /api/deals?cursor=&pageSize=
   * Returns cursor-paginated list.
   */
  getAll: ({ cursor, pageSize = DEFAULT_PAGE_SIZE }: CursorPaginationRequest = {}) => {
    const params = new URLSearchParams({ pageSize: String(pageSize) });
    if (cursor) params.set('cursor', cursor);
    return publicApiClient
      .get<CursorPaginatedDealsResponse>(`/api/deals?${params}`)
      .then((r) => {
        if (r.status === 204 || !r.data) {
          return { items: [], nextCursor: null, hasMore: false } as CursorPaginatedDealsResponse;
        }
        if (Array.isArray(r.data)) {
          return { items: r.data, nextCursor: null, hasMore: false } as CursorPaginatedDealsResponse;
        }
        return {
          items: Array.isArray(r.data.items) ? r.data.items : [],
          nextCursor: r.data.nextCursor ?? null,
          hasMore: r.data.hasMore === true || (r.data.hasMore as unknown) === 'true',
        } as CursorPaginatedDealsResponse;
      });
  },

  /** GET /api/deals/{id} → 200 DealResponse | 404 | 400 */
  getById: (id: string) =>
    publicApiClient
      .get<DealResponse>(`/api/deals/${id}`)
      .then((r) => r.data),

  /**
   * GET /api/deals/search?query=
   * 204 when query is empty – return empty array (not an error).
   */
  search: (query: string): Promise<DealResponse[]> => {
    if (!query.trim()) return Promise.resolve([]);
    return publicApiClient
      .get<DealResponse[]>(`/api/deals/search?query=${encodeURIComponent(query.trim())}`)
      .then((r) => {
        if (r.status === 204 || !r.data) return [];
        return Array.isArray(r.data) ? r.data : [];
      });
  },

  /** GET /api/deals/category?name= → 200 DealResponse[] | 400 */
  getByCategory: (name: string) =>
    publicApiClient
      .get<DealResponse[]>(`/api/deals/category?name=${encodeURIComponent(name)}`)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  /** GET /api/deals/store?name= → 200 DealResponse[] | 400 */
  getByStore: (name: string) =>
    publicApiClient
      .get<DealResponse[]>(`/api/deals/store?name=${encodeURIComponent(name)}`)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  /** GET /api/deals/university?name= → 200 DealResponse[] | 400 */
  getByUniversity: (name: string) =>
    publicApiClient
      .get<DealResponse[]>(`/api/deals/university?name=${encodeURIComponent(name)}`)
      .then((r) => (Array.isArray(r.data) ? r.data : [])),

  /** GET /api/deals/user (auth required) → 200 DealResponse[] | 401 */
  getForUser: () =>
    apiClient
      .get<DealResponse[]>('/api/deals/user')
      .then((r) => {
        if (r.status === 204 || !r.data) return [];
        return Array.isArray(r.data) ? r.data : [];
      }),

  /** POST /api/deals (auth) → 201 DealResponse */
  create: (data: CreateDealRequest) =>
    apiClient
      .post<DealResponse>('/api/deals', data)
      .then((r) => r.data),

  /** PUT /api/deals/{id} (SuperAdminOnly) → 204 */
  update: (id: string, data: UpdateDealRequest): Promise<void> =>
    apiClient
      .put(`/api/deals/${id}`, data)
      .then(() => undefined),

  /** DELETE /api/deals/{id} (SuperAdminOnly) → 204 */
  remove: (id: string): Promise<void> =>
    apiClient
      .delete(`/api/deals/${id}`)
      .then(() => undefined),
};

