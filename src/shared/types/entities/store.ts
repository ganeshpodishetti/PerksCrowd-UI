/** Store entity – aligns with StoreResponse from the backend */
export interface Store {
  id: string;
  title: string;
  website?: string;
  logoUrl?: string;
}

export type { CreateStoreRequest, UpdateStoreRequest } from '@/shared/types/api/requests';
export type { StoreResponse, CreateStoreResponse } from '@/shared/types/api/responses';
