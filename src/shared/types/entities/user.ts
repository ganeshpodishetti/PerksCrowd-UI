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
    ChangePasswordRequest, ForgotPasswordRequest, LoginRequest,
    RegisterRequest, ResetPasswordRequest, SendConfirmationEmailRequest
} from '@/shared/types/api/requests';
export type {
    ChangePasswordResponse, CurrentUserResponse, ForgotPasswordResponse, GetUserResponse, LoginResponse, RefreshTokenResponse, RegisterResponse, ResetPasswordResponse
} from '@/shared/types/api/responses';

