import { apiService } from '../services/api-request'
import type { BusinessModelPayload, BusinessModelResponse, BusinessModelsResponse } from '../types/api/business-model.types'

// API client for the business model entity
export const BusinessModelApiClient = {
  // Get all business models
  getBusinessModels() {
    return apiService.get<BusinessModelsResponse>('/api/business-model')
  },

  // Get a single business model by ID
  getBusinessModel(id: string) {
    return apiService.get<BusinessModelResponse>(`/api/business-model/${id}`)
  },

  // Create a new business model
  createBusinessModel(modelData: BusinessModelPayload) {
    return apiService.post<BusinessModelResponse>('/api/business-model', modelData)
  },

  // Update an existing business model by ID
  updateBusinessModel(id: string, modelData: Partial<BusinessModelPayload>) {
    return apiService.patch<BusinessModelResponse>(`/api/business-model/${id}`, modelData)
  },

  // Delete a business model by ID
  deleteBusinessModel(id: string) {
    return apiService.delete<void>(`/api/business-model/${id}`)
  }
}
