/**
 * storeService – delegates to storesApi.
 *
 * FIX: import was `import apiClient, { publicApiClient }` (default + named)
 * but apiClient only has named exports – now fixed via storesApi.
 * PUT returns 204 → void.
 */
import { storesApi } from '@/shared/services/api/storesApi';
import type { StoreResponse, CreateStoreResponse } from '@/shared/types/api/responses';
import type { CreateStoreRequest, UpdateStoreRequest } from '@/shared/types/api/requests';

export type { StoreResponse as Store, CreateStoreRequest, UpdateStoreRequest, CreateStoreResponse };

export const storeService = {
  async getStores(): Promise<StoreResponse[]> {
    try {
      const data = await storesApi.getAll();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async getStore(id: string): Promise<StoreResponse> {
    return storesApi.getById(id);
  },

  async createStore(data: CreateStoreRequest): Promise<CreateStoreResponse> {
    return storesApi.create(data);
  },

  async updateStore(id: string, data: UpdateStoreRequest): Promise<void> {
    return storesApi.update(id, data);
  },

  async deleteStore(id: string): Promise<void> {
    return storesApi.remove(id);
  },
};

export const fetchStores = storeService.getStores.bind(storeService);
