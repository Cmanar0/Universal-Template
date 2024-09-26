import { apiService } from '../services/api-request'
import type { ProductTypePayload, ProductTypeResponse, ProductTypesResponse } from '../types/api/product-type.types'

export const ProductTypeApiClient = {
  // Get all product types
  getProductTypes() {
    return apiService.get<ProductTypesResponse>('/api/product-type')
  },

  // Get a single product type by ID
  getProductType(id: string) {
    return apiService.get<ProductTypeResponse>(`/api/product-type/${id}`)
  },

  // Create a new product type
  createProductType(productTypeData: ProductTypePayload) {
    return apiService.post<ProductTypeResponse>('/api/product-type', productTypeData)
  },

  // Update an existing product type by ID
  updateProductType(id: string, productTypeData: Partial<ProductTypePayload>) {
    return apiService.patch<ProductTypeResponse>(`/api/product-type/${id}`, productTypeData)
  },

  // Delete a product type by ID
  deleteProductType(id: string) {
    return apiService.delete<void>(`/api/product-type/${id}`)
  }
}
