// stores/stageRevenueProducts.store.js

import { defineStore } from 'pinia'
import { StageRevenueProductsApiClient } from '../api/stage-revenue-products.api'
import type { StageRevenueProduct, StageRevenueProductPayload } from '../types/api/stage-revenue-products.types'

export const useStageRevenueProductsStore = defineStore('stageRevenueProducts', {
  state: () => ({
    stageRevenueProducts: [] as StageRevenueProduct[], // List of stage revenue products
    selectedProduct: null as StageRevenueProduct | null // Selected stage revenue product for detail view/edit
  }),

  actions: {
    // Fetch all stage revenue products
    async loadStageRevenueProducts() {
      const response = await StageRevenueProductsApiClient.getStageRevenueProducts()
      this.stageRevenueProducts = response.data.data
    },

    // Fetch a single stage revenue product by ID
    async loadStageRevenueProduct(id: string) {
      const response = await StageRevenueProductsApiClient.getStageRevenueProduct(id)
      this.selectedProduct = response.data.data
    },

    // Create a new stage revenue product
    async createStageRevenueProduct(productData: StageRevenueProductPayload) {
      const response = await StageRevenueProductsApiClient.createStageRevenueProduct(productData)
      this.stageRevenueProducts.push(response.data.data)
    },

    // Update an existing stage revenue product by ID
    async updateStageRevenueProduct(id: string, productData: Partial<StageRevenueProductPayload>) {
      const response = await StageRevenueProductsApiClient.updateStageRevenueProduct(id, productData)
      const index = this.stageRevenueProducts.findIndex(product => product.id === id)
      if (index !== -1) {
        this.stageRevenueProducts[index] = response.data.data
      }
    },

    // Delete a stage revenue product by ID
    async deleteStageRevenueProduct(id: string) {
      await StageRevenueProductsApiClient.deleteStageRevenueProduct(id)
      this.stageRevenueProducts = this.stageRevenueProducts.filter(product => product.id !== id)
    }
  }
})
