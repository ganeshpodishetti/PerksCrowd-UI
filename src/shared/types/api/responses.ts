/**
 * Response DTOs – mirror the ASP.NET backend response models exactly.
 * Every field here should map 1:1 to a property the backend actually returns.
 */

import type { RedeemType } from './requests';

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /api/auth/login – cookies set server-side; body may be empty or carry a message */
export interface LoginResponse {
  message?: string;
}

/** POST /api/auth/register */
export interface RegisterResponse {
  message?: string;
}

/** POST /api/auth/refresh-token */
export interface RefreshTokenResponse {
  message?: string;
}

/** POST /api/auth/change-password */
export interface ChangePasswordResponse {
  message?: string;
}

/** POST /api/auth/forgot-password */
export interface ForgotPasswordResponse {
  message: string;
}

/** POST /api/auth/reset-password?token=... */
export interface ResetPasswordResponse {
  message: string;
}

/** GET /api/auth/me */
export interface CurrentUserResponse {
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface CategoryResponse {
  id: string;
  title: string;
}

export interface CreateCategoryResponse {
  id: string;
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export interface StoreResponse {
  id: string;
  title: string;
  website?: string;
  logoUrl?: string;
}

export interface CreateStoreResponse {
  id: string;
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export interface DealResponse {
  id: string;
  title: string;
  discount: string;
  promo?: string | null;
  /** Transitional casing from backend responses. */
  LogoUrl?: string;
  logoUrl?: string | null;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  url: string;
  /** enum name: Online | InStore | Both | Unknown */
  redeemType: RedeemType;
  howToRedeem?: string | null;
  endDate?: string | null;
  isUniversitySpecific: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string | null;
  universityImageUrl?: string;
  createdAt?: string;
}

export type FeedType = 'latest' | 'featured' | 'popular' | 'trending';

/** GET /api/feeds/{feedType} */
export type FeedDealsResponse = DealResponse[];

/** GET /api/deals?cursor=&pageSize= */
export interface CursorPaginatedDealsResponse {
  items: DealResponse[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Universities ─────────────────────────────────────────────────────────────

/** Raw backend DTO for GET /api/universities* */
export interface UniversityResponse {
  id: string;
  title: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateUniversityResponse {
  id: string;
  imageUrl?: string;
}

// ─── Submit Deal ──────────────────────────────────────────────────────────────

export interface SubmittedDealResponse {
  id: string;
  /** Backend stores the title submitted as `name` on the response */
  name: string;
  url: string;
  promoCode?: string;
  markedAsRead: boolean;
  sentAt: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface GetUserResponse {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

// ─── Generic error shapes (for documentation only – use normalizeApiError) ───

/** ASP.NET Core ValidationProblem */
export interface ValidationProblemDetails {
  type?: string;
  title: string;
  status: number;
  traceId?: string;
  errors: Record<string, string[]>;
}

/** ASP.NET Core ProblemDetails */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errorCode?: string;
}