import { apiService } from '../services/api-request'
import type { SubscriptionFrequencyPayload, SubscriptionFrequencyResponse, SubscriptionFrequenciesResponse } from '../types/api/subscription-frequency.types'

export const SubscriptionFrequencyApiClient = {
  // Get all subscription frequencies
  getSubscriptionFrequencies() {
    return apiService.get<SubscriptionFrequenciesResponse>('/api/subscription-frequency')
  },

  // Get a single subscription frequency by ID
  getSubscriptionFrequency(id: string) {
    return apiService.get<SubscriptionFrequencyResponse>(`/api/subscription-frequency/${id}`)
  },

  // Create a new subscription frequency
  createSubscriptionFrequency(frequencyData: SubscriptionFrequencyPayload) {
    return apiService.post<SubscriptionFrequencyResponse>('/api/subscription-frequency', frequencyData)
  },

  // Update an existing subscription frequency by ID
  updateSubscriptionFrequency(id: string, frequencyData: Partial<SubscriptionFrequencyPayload>) {
    return apiService.patch<SubscriptionFrequencyResponse>(`/api/subscription-frequency/${id}`, frequencyData)
  },

  // Delete a subscription frequency by ID
  deleteSubscriptionFrequency(id: string) {
    return apiService.delete<void>(`/api/subscription-frequency/${id}`)
  }
}
