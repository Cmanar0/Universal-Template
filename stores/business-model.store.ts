import { defineStore } from 'pinia'
import { BusinessModelApiClient } from '../api/business-model.api'
import type { BusinessModel } from '../types/api/business-model.types'

export const useBusinessModelStore = defineStore('businessModelStore', {
  state: () => ({
    businessModels: [] as BusinessModel[],
    businessModel: null as BusinessModel | null
  }),

  actions: {
    async fetchAllBusinessModels() {
      const response = await BusinessModelApiClient.getBusinessModels()
      this.businessModels = response.data.data
    },

    async fetchBusinessModel(id: string) {
      const response = await BusinessModelApiClient.getBusinessModel(id)
      this.businessModel = response.data.data
    },

    async createBusinessModel(modelData: BusinessModel) {
      const response = await BusinessModelApiClient.createBusinessModel(modelData)
      this.businessModels.push(response.data.data)
    },

    async updateBusinessModel(id: string, modelData: Partial<BusinessModel>) {
      const response = await BusinessModelApiClient.updateBusinessModel(id, modelData)
      const index = this.businessModels.findIndex(model => model.id === id)
      if (index !== -1) {
        this.businessModels[index] = response.data.data
      }
    },

    async deleteBusinessModel(id: string) {
      await BusinessModelApiClient.deleteBusinessModel(id)
      this.businessModels = this.businessModels.filter(model => model.id !== id)
    }
  }
})
