// types/api/auth.ts

// Define the payload interface for user login
export interface AuthPayload {
  email: string
  password: string
}

// Define the payload interface for refresh token
export interface RefreshTokenPayload {
  token: string
}

// Define the payload interface for registration
export interface RegisterPayload {
  email: string
  password: string
}

// Define the payload interface for lost password
export interface LostPasswordPayload {
  email: string
}

// Define the payload interface for reset password
export interface ResetPasswordPayload {
  newPassword: string
  lostPasswordToken: string
}

// Define the response interface for login
export interface LoginResponseData {
  jwt: string
  user?: {
    id: string
    email: string
    // additional user properties
  }
}

export interface LoginResponse {
  data: {
    data: LoginResponseData
  }
  message: string
  status: number
}

// Define the response interface for refresh token
export interface RefreshTokenResponseData {
  jwt: string
}

export interface RefreshTokenResponse {
  data: {
    data: RefreshTokenResponseData
  }
  message: string
  status: number
}

// Define the response interface for registration
export interface RegisterResponse {
  data: null // Assuming no data is returned, adjust if needed
  message: string
  status: number
}

export type LoginPayload = AuthPayload
