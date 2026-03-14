/** User entity – mirrors CurrentUserResponse / GetUserResponse from the backend */
export interface User {
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

/** Extended user item returned by GET /api/users (SuperAdmin only) */
export interface UserItem {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

export type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SendConfirmationEmailRequest,
} from '@/shared/types/api/requests';

export type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  CurrentUserResponse,
  GetUserResponse,
} from '@/shared/types/api/responses';
