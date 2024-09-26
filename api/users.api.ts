import { apiService } from '../services/api-request'
import type { CreateUserPayload, UpdateUserPayload, UserResponse } from '../types/api/users'

export const UsersApiClient = {
  // Get a single user by ID
  getUser(id: string) {
    return apiService.get<UserResponse>(`/api/users/${id}`)
  },

  // Get all users
  getUsers() {
    return apiService.get<UserResponse[]>('/api/users')
  },

  // Create a new user (requires admin token)
  createUser(userData: CreateUserPayload) {
    return apiService.post<UserResponse>('/api/users', userData)
  },

  // Update an existing user by ID (requires admin token)
  updateUser(id: string, userData: UpdateUserPayload) {
    return apiService.patch<UserResponse>(`/api/users/${id}`, userData)
  },

  // Delete a user by ID (requires admin token)
  deleteUser(id: string) {
    return apiService.delete<void>(`/api/users/${id}`)
  }
}
