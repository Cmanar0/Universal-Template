import { apiService } from '../services/api-request'
import type { BusinessType, CreateBusinessType, UpdateBusinessType } from '../types/api/business-type.types'

export const BusinessTypeApiClient = {
  // Fetch the list of business types
  getBusinessTypes() {
    return apiService.get<BusinessType[]>('/api/business-type')
  },

  // Create a new business type
  createBusinessType(businessTypeData: CreateBusinessType) {
    return apiService.post<BusinessType>('/api/business-type', businessTypeData)
  },

  // Update an existing business type by ID
  updateBusinessType(businessTypeId: string, businessTypeData: UpdateBusinessType) {
    return apiService.patch<BusinessType>(`/api/business-type/${businessTypeId}`, businessTypeData)
  },

  // Delete a business type by ID
  deleteBusinessType(businessTypeId: string) {
    return apiService.delete<void>(`/api/business-type/${businessTypeId}`)
  },

  // Fetch a single business type by ID
  getBusinessTypeById(businessTypeId: string) {
    return apiService.get<BusinessType>(`/api/business-type/${businessTypeId}`)
  }
}

export default BusinessTypeApiClient
