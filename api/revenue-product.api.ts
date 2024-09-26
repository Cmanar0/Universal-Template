import { apiService } from '../services/api-request'
import type { RevenueProductPayload, RevenueProductResponse, RevenueProductsResponse } from '../types/api/revenue-product.types'

// API client for the revenue product entity
export const RevenueProductApiClient = {
  // Get all revenue products
  getRevenueProducts() {
    return apiService.get<RevenueProductsResponse>('/api/revenue-product')
  },

  // Get a single revenue product by ID
  getRevenueProduct(id: string) {
    return apiService.get<RevenueProductResponse>(`/api/revenue-product/${id}`)
  },

  // Create a new revenue product
  createRevenueProduct(productData: RevenueProductPayload) {
    return apiService.post<RevenueProductResponse>('/api/revenue-product', productData)
  },

  // Update an existing revenue product by ID
  updateRevenueProduct(id: string, productData: Partial<RevenueProductPayload>) {
    return apiService.patch<RevenueProductResponse>(`/api/revenue-product/${id}`, productData)
  },

  // Delete a revenue product by ID
  deleteRevenueProduct(id: string) {
    return apiService.delete<void>(`/api/revenue-product/${id}`)
  }
}
