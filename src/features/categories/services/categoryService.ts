/**
 * categoryService – delegates to categoriesApi.
 *
 * FIX: create/update now send JSON (not FormData); the backend
 * expects { title: string }, not multipart/form-data.
 */
import { categoriesApi } from '@/shared/services/api/categoriesApi';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/shared/types/api/requests';
import type { CategoryResponse, CreateCategoryResponse } from '@/shared/types/api/responses';

// Re-export types for consumers importing from this module
export type { CategoryResponse as Category, CreateCategoryRequest, UpdateCategoryRequest, CreateCategoryResponse };

export const categoryService = {
  async getCategories(): Promise<CategoryResponse[]> {
    try {
      const data = await categoriesApi.getAll();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async getCategory(id: string): Promise<CategoryResponse> {
    return categoriesApi.getById(id);
  },

  async createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    return categoriesApi.create(data);
  },

  /** PUT returns 204 → void; callers should invalidate their query cache */
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<void> {
    return categoriesApi.update(id, data);
  },

  async deleteCategory(id: string): Promise<void> {
    return categoriesApi.remove(id);
  },
};

export const fetchCategories = categoryService.getCategories.bind(categoryService);
