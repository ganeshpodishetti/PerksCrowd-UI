import { RedeemType } from '@/shared/types/entities/deal';

export interface FormData {
  title: string;
  discount: string;
  promo?: string;
  isActive: boolean;
  isFeatured: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
  universityName?: string;
  isUniversitySpecific?: boolean;
}