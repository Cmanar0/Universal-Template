// Define the payload interface for creating or updating a product type
export interface ProductTypePayload {
  name: string
}

// Define the general product type interface
export interface ProductType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single product type
export interface ProductTypeResponse {
  data: ProductType
  message: string
  status: number
}

// Define the response interface for getting multiple product types
export interface ProductTypesResponse {
  data: ProductType[]
  message: string
  status: number
}
