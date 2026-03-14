/**
 * dealService – delegates to dealsApi.
 *
 * FIX: old code used `import apiClient, { publicApiClient }` which is wrong
 * (there is no default export).  Now imports through typed dealsApi module.
 *
 * Update/Delete return void (204 No Content from backend).
 * Search with empty query short-circuits to [] client-side.
 */
import { dealsApi } from '@/shared/services/api/dealsApi';
import type { CreateDealRequest, UpdateDealRequest, CursorPaginationRequest } from '@/shared/types/api/requests';
import type { CursorPaginatedDealsResponse, DealResponse } from '@/shared/types/api/responses';

// Keep the Deal type alias so existing consumers don't break
export type { DealResponse as Deal };
export type { CreateDealRequest, UpdateDealRequest };

export interface GetDealsParams extends CursorPaginationRequest {}

export const dealService = {
  async getDeals(params?: GetDealsParams): Promise<CursorPaginatedDealsResponse> {
    return dealsApi.getAll(params);
  },

  async getDeal(id: string): Promise<DealResponse> {
    return dealsApi.getById(id);
  },

  async getDealsByCategory(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByCategory(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      throw err;
    }
  },

  async getDealsByStore(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByStore(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      throw err;
    }
  },

  async getDealsByUniversity(name: string): Promise<DealResponse[]> {
    try {
      return await dealsApi.getByUniversity(name);
    } catch (err: any) {
      if (err?.response?.status === 404) return [];
      throw err;
    }
  },

  async getUserDeals(): Promise<DealResponse[]> {
    return dealsApi.getForUser();
  },

  async createDeal(data: CreateDealRequest): Promise<DealResponse> {
    return dealsApi.create(data);
  },

  /** PUT returns 204 → void */
  async updateDeal(id: string, data: UpdateDealRequest): Promise<void> {
    return dealsApi.update(id, data);
  },

  async deleteDeal(id: string): Promise<void> {
    return dealsApi.remove(id);
  },

  /**
   * GET /api/deals/search?query=
   * Returns [] for empty query (204 is not an error).
   */
  async searchDeals({ query = '' }: { query?: string }): Promise<DealResponse[]> {
    return dealsApi.search(query);
  },
};

export const fetchDeals = dealService.getDeals.bind(dealService);
