/** Category entity – aligns with CategoryResponse from the backend */
export interface Category {
  id: string;
  title: string;
}

export type { CreateCategoryRequest, UpdateCategoryRequest } from '@/shared/types/api/requests';
export type { CategoryResponse, CreateCategoryResponse } from '@/shared/types/api/responses';
