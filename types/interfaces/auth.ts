// types/interfaces/auth.ts

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data?: {
    jwt: string
  }
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
}
