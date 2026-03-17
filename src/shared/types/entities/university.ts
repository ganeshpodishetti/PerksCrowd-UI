/** University entity – normalized frontend shape for university data */
export interface University {
  id: string;
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type {
    CreateUniversityRequest,
    UpdateUniversityRequest
} from '@/shared/types/api/requests';
export type {
    CreateUniversityResponse
} from '@/shared/types/api/responses';

