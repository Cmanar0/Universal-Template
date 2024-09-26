// Define the payload interface for creating or updating a subscription frequency
export interface SubscriptionFrequencyPayload {
  name: string
}

// Define the general subscription frequency interface
export interface SubscriptionFrequency {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single subscription frequency
export interface SubscriptionFrequencyResponse {
  data: SubscriptionFrequency
  message: string
  status: number
}

// Define the response interface for getting multiple subscription frequencies
export interface SubscriptionFrequenciesResponse {
  data: SubscriptionFrequency[]
  message: string
  status: number
}
