/**
 * Zod validation schemas that mirror backend validators exactly.
 *
 * Rules are sourced from the backend contract and kept in sync so that
 * the same error messages appear on both sides wherever possible.
 */

import { z } from 'zod';

// ─── Shared patterns ─────────────────────────────────────────────────────────

/** Matches http:// or https:// absolute URLs */
const ABSOLUTE_URL = /^https?:\/\/.+/;

/**
 * Password complexity: at least one lowercase, one uppercase, one digit.
 * Mirrors the ASP.NET IdentityOptions.Password regex used in the backend.
 */
const PASSWORD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const REDEEM_TYPES = ['Online', 'InStore', 'Both', 'Unknown'] as const;
export type RedeemTypeValue = (typeof REDEEM_TYPES)[number];

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(10, 'Username must be at most 10 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
});

/** Re-use for /send-confirmation-email */
export const resendConfirmationSchema = forgotPasswordSchema;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        PASSWORD_COMPLEXITY,
        'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
      ),
    confirmNewPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_COMPLEXITY,
      'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    ),
});

// ─── Category ─────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const storeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  website: z
    .string()
    .optional()
    .refine(
      (v) => !v || ABSOLUTE_URL.test(v),
      'Website must be a valid absolute URL (starting with http:// or https://)',
    ),
  logoUrl: z.string().optional(),
});

// ─── Deal ─────────────────────────────────────────────────────────────────────

export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .max(1024, 'Description must be at most 1024 characters')
    .default(''),
  discount: z.string().min(1, 'Discount is required'),
  promo: z.string().optional(),
  isActive: z.boolean().default(true),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(ABSOLUTE_URL, 'URL must be a valid absolute URL (starting with http:// or https://)'),
  redeemType: z.enum(REDEEM_TYPES, {
    error: 'Redeem type must be one of: Online, InStore, Both, Unknown',
  }),
  howToRedeem: z
    .string()
    .max(1024, 'How to redeem must be at most 1024 characters')
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categoryName: z.string().min(1, 'Category is required'),
  storeName: z.string().optional(),
  universityName: z.string().optional(),
  isUniversitySpecific: z.boolean().optional(),
});

// ─── University ───────────────────────────────────────────────────────────────

export const universitySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(250, 'Name must be at most 250 characters'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(10, 'Code must be at most 10 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be at most 100 characters'),
  state: z.string().optional(),
  city: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z
    .custom<File>((v) => typeof File === 'undefined' || v instanceof File, {
      message: 'Must be a valid file',
    })
    .optional(),
});

// ─── Submit Deal (public) ─────────────────────────────────────────────────────

export const submitDealSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(250, 'Title must be at most 250 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(ABSOLUTE_URL, 'URL must be a valid http/https URL'),
  promoCode: z
    .string()
    .min(1, 'Promo code is required')
    .max(100, 'Promo code must be at most 100 characters'),
});

// ─── Inferred TypeScript types ────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResendConfirmationFormData = z.infer<typeof resendConfirmationSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type StoreFormData = z.infer<typeof storeSchema>;
export type DealFormData = z.infer<typeof dealSchema>;
export type UniversityFormData = z.infer<typeof universitySchema>;
export type SubmitDealFormData = z.infer<typeof submitDealSchema>;



