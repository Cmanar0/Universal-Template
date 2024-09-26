import { defineStore } from 'pinia'
import { SubscriptionFrequencyApiClient } from '../api/subscription-frequency.api'
import type { SubscriptionFrequency, SubscriptionFrequencyPayload } from '../types/api/subscription-frequency.types'

export const useSubscriptionFrequencyStore = defineStore('subscriptionFrequencyStore', {
  state: () => ({
    frequencies: [] as SubscriptionFrequency[]
  }),

  actions: {
    async loadSubscriptionFrequencies() {
      try {
        const response = await SubscriptionFrequencyApiClient.getSubscriptionFrequencies()
        this.frequencies = response.data.data
      } catch (err) {
        console.error('Failed to load subscription frequencies:', err)
      }
    },

    async createSubscriptionFrequency(payload: SubscriptionFrequencyPayload) {
      try {
        const response = await SubscriptionFrequencyApiClient.createSubscriptionFrequency(payload)
        this.frequencies.push(response.data.data)
      } catch (err) {
        console.error('Failed to create subscription frequency:', err)
      }
    },

    async updateSubscriptionFrequency(id: string, payload: Partial<SubscriptionFrequencyPayload>) {
      try {
        const response = await SubscriptionFrequencyApiClient.updateSubscriptionFrequency(id, payload)
        const index = this.frequencies.findIndex(freq => freq.id === id)
        if (index !== -1) {
          this.frequencies[index] = response.data.data
        }
      } catch (err) {
        console.error('Failed to update subscription frequency:', err)
      }
    },

    async deleteSubscriptionFrequency(id: string) {
      try {
        await SubscriptionFrequencyApiClient.deleteSubscriptionFrequency(id)
        this.frequencies = this.frequencies.filter(freq => freq.id !== id)
      } catch (err) {
        console.error('Failed to delete subscription frequency:', err)
      }
    }
  }
})
