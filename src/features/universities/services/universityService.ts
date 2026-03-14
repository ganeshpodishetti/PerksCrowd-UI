/**
 * universityService – delegates to universitiesApi.
 *
 * FIX: old code used the wrong default import from apiClient.
 * Multipart/form-data construction is now handled centrally by
 * universitiesApi + buildFormData.
 * PUT returns void (204).
 */
import { universitiesApi } from '@/shared/services/api/universitiesApi';
import type { CreateUniversityRequest, UpdateUniversityRequest } from '@/shared/types/api/requests';
import type { CreateUniversityResponse } from '@/shared/types/api/responses';
import type { University } from '@/shared/types/entities/university';

// Re-export types for convenience
export type { University, CreateUniversityRequest, UpdateUniversityRequest, CreateUniversityResponse };

type UniversityDto = Awaited<ReturnType<typeof universitiesApi.getById>> & {
  title: string;
};

const normalizeUniversity = (university: UniversityDto): University => ({
  id: university.id,
  name: university.title,
  code: university.code,
  country: university.country,
  state: university.state,
  city: university.city,
  imageUrl: university.imageUrl,
  isActive: university.isActive,
});

export const universityService = {
  // Public endpoints - no authentication required
  async getUniversities(): Promise<University[]> {
    try {
      const data = await universitiesApi.getAll();
      const universityData = data as UniversityDto[];
      return Array.isArray(universityData) ? universityData.map(normalizeUniversity) : [];
    } catch {
      return [];
    }
  },

  async getUniversity(id: string): Promise<University> {
    const data = await universitiesApi.getById(id);
    return normalizeUniversity(data as UniversityDto);
  },

  // Admin endpoints - authentication required
  async createUniversity(data: CreateUniversityRequest): Promise<CreateUniversityResponse> {
    return universitiesApi.create(data);
  },

  /** PUT returns 204 → void */
  async updateUniversity(id: string, data: UpdateUniversityRequest): Promise<void> {
    return universitiesApi.update(id, data);
  },

  async deleteUniversity(id: string): Promise<void> {
    return universitiesApi.remove(id);
  },
};

// Legacy function for backward compatibility
export const fetchUniversities = universityService.getUniversities.bind(universityService);
