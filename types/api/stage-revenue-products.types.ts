// Define the payload interface for creating or updating a stage revenue product
export interface StageRevenueProductPayload {
  completed: boolean
  projectId: string
}

// Define the general stage revenue product interface
export interface StageRevenueProduct {
  id: string
  completed: boolean
  projectId: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single stage revenue product
export interface StageRevenueProductResponse {
  data: StageRevenueProduct
  message: string
  status: number
}

// Define the response interface for getting multiple stage revenue products
export interface StageRevenueProductsResponse {
  data: StageRevenueProduct[]
  message: string
  status: number
}
