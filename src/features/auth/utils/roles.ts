import type { User } from '@/shared/types/entities/user';

/** Role checks are case-insensitive because the API casing has varied. */
export const hasRole = (user: User | null | undefined, role: string): boolean =>
  Boolean(user?.roles?.some((userRole) => userRole.toLowerCase() === role.toLowerCase()));

export const hasAnyRole = (
  user: User | null | undefined,
  roles: string[],
): boolean => roles.some((role) => hasRole(user, role));

/** Any account that may open the admin area. */
export const isAdmin = (user: User | null | undefined): boolean =>
  hasAnyRole(user, ['Admin', 'SuperAdmin']);

export const isSuperAdmin = (user: User | null | undefined): boolean =>
  hasRole(user, 'SuperAdmin');
