// Define the payload interface for creating a user
export interface CreateUserPayload {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

// Define the payload interface for updating a user
export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
}

// Define the general user interface
export interface UserPayload {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

// Define the response interface for user data
export interface UserResponse {
  data: UserPayload
  message: string
  status: number
}
