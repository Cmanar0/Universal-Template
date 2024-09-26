import { apiService } from '../services/api-request'
import type {
  AuthPayload,
  RefreshTokenPayload,
  RegisterPayload,
  LostPasswordPayload,
  ResetPasswordPayload,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse
} from '../types/api/auth.types'

export const AuthApiClient = {
  // User login (No token required)
  login(authData: AuthPayload) {
    return apiService.post<LoginResponse>('/api/auth', authData, {}, { requiresAuth: false })
  },

  // Refresh token (Requires token)
  refreshToken(tokenData: RefreshTokenPayload) {
    return apiService.post<RefreshTokenResponse>('/api/auth/refresh-token', tokenData)
  },

  // User registration (No token required)
  register(registerData: RegisterPayload) {
    return apiService.post<RegisterResponse>('/api/register', registerData, {}, { requiresAuth: false })
  },

  // Lost password (No token required)
  lostPassword(lostPasswordData: LostPasswordPayload) {
    return apiService.post<void>('/api/lost-password', lostPasswordData, {}, { requiresAuth: false })
  },

  // Reset password (No token required)
  resetPassword(resetPasswordData: ResetPasswordPayload) {
    return apiService.post<void>('/api/reset-password', resetPasswordData, {}, { requiresAuth: false })
  }
}
