/**
 * Request DTOs – mirror the ASP.NET backend request models exactly.
 * Keep these in sync with the backend contract; do NOT add fields that
 * the backend does not accept.
 */

// ─── Shared enum ──────────────────────────────────────────────────────────────

/** Must match backend RedeemType enum names exactly */
export type RedeemType = 'Online' | 'InStore' | 'Both' | 'Unknown';

/** Must match backend interaction event enum names exactly */
export type FeedInteractionEventType = 'View' | 'Click' | 'Save' | 'Redeem';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

/** POST /api/auth/reset-password?token=... */
export interface ResetPasswordRequest {
  newPassword: string;
  confirmNewPassword: string;
}

/** POST /api/auth/change-password (auth required) */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** POST /api/auth/send-confirmation-email */
export interface SendConfirmationEmailRequest {
  email: string;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface CreateCategoryRequest {
  title: string;
}

export interface UpdateCategoryRequest {
  title: string;
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export interface CreateStoreRequest {
  title: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateStoreRequest {
  title: string;
  website?: string;
  logoUrl?: string;
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export interface CreateDealRequest {
  title: string;
  discount: string;
  promo?: string;
  isActive: boolean;
  isFeatured: boolean;
  url?: string;
  /** enum name: Online | InStore | Both | Unknown */
  redeemType: string;
  howToRedeem?: string;
  endDate?: string;
  categoryName: string;
  universityName?: string;
  storeName?: string;
  isUniversitySpecific?: boolean;
}

export interface UpdateDealRequest {
  title: string;
  discount: string;
  promo?: string;
  isActive: boolean;
  isFeatured: boolean;
  url?: string;
  redeemType: string;
  howToRedeem?: string;
  endDate?: string;
  isUniversitySpecific?: boolean;
  categoryName: string;
  storeName?: string;
  universityName?: string;
}

// ─── Universities (multipart/form-data) ──────────────────────────────────────

export interface CreateUniversityRequest {
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  image?: File;
}

export interface UpdateUniversityRequest {
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  /** Sent as the string "true" or "false" in multipart/form-data */
  isActive: boolean;
  image?: File;
}

// ─── Submit Deal ──────────────────────────────────────────────────────────────

export interface SubmitDealRequest {
  title: string;
  url: string;
  promoCode: string;
}

export interface MarkAsReadDealRequest {
  markedAsRead: boolean;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface CursorPaginationRequest {
  cursor?: string | null;
  pageSize?: number;
}