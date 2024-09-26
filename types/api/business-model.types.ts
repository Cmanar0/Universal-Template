// Define the payload interface for creating or updating a business model
export interface BusinessModelPayload {
  name: string
}

// Define the general business model interface
export interface BusinessModel {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single business model
export interface BusinessModelResponse {
  data: BusinessModel
  message: string
  status: number
}

// Define the response interface for getting multiple business models
export interface BusinessModelsResponse {
  data: BusinessModel[]
  message: string
  status: number
}
