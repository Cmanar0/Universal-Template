// Define the payload interface for creating or updating a revenue product
export interface RevenueProductPayload {
  name: string
  description?: string
  productionCost?: number
  sellingPrice?: number
  projectId: string
  typeId?: string
  subscriptionFrequencyId?: string
}

// Define the general revenue product interface
export interface RevenueProduct {
  id: string
  name: string
  description?: string
  productionCost?: number
  sellingPrice?: number
  projectId: string
  typeId?: string
  subscriptionFrequencyId?: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single revenue product
export interface RevenueProductResponse {
  data: RevenueProduct
  message: string
  status: number
}

// Define the response interface for getting multiple revenue products
export interface RevenueProductsResponse {
  data: RevenueProduct[]
  message: string
  status: number
}
