import { apiService } from '../services/api-request'
import type { StageRevenueProductPayload, StageRevenueProductResponse, StageRevenueProductsResponse } from '../types/api/stage-revenue-products.types'

export const StageRevenueProductsApiClient = {
  // Get all stage revenue products
  getStageRevenueProducts() {
    return apiService.get<StageRevenueProductsResponse>('/api/stage-revenue-products')
  },

  // Get a single stage revenue product by ID
  getStageRevenueProduct(id: string) {
    return apiService.get<StageRevenueProductResponse>(`/api/stage-revenue-products/${id}`)
  },

  // Create a new stage revenue product
  createStageRevenueProduct(productData: StageRevenueProductPayload) {
    return apiService.post<StageRevenueProductResponse>('/api/stage-revenue-products', productData)
  },

  // Update an existing stage revenue product by ID
  updateStageRevenueProduct(id: string, productData: Partial<StageRevenueProductPayload>) {
    return apiService.patch<StageRevenueProductResponse>(`/api/stage-revenue-products/${id}`, productData)
  },

  // Delete a stage revenue product by ID
  deleteStageRevenueProduct(id: string) {
    return apiService.delete<void>(`/api/stage-revenue-products/${id}`)
  }
}
