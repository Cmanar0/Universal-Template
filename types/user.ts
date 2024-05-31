// src/types/user.ts
export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  lang: string
  isActive: boolean
  registeredAt: string
  updatedAt: string
}
