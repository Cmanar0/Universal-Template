import { defineStore } from 'pinia'
import { RevenueProductApiClient } from '../api/revenue-product.api'
import type { RevenueProduct } from '../types/api/revenue-product.types'

export const useRevenueProductStore = defineStore('revenueProductStore', {
  state: () => ({
    revenueProducts: [] as RevenueProduct[],
    revenueProduct: null as RevenueProduct | null
  }),

  actions: {
    async fetchAllRevenueProducts() {
      const response = await RevenueProductApiClient.getRevenueProducts()
      this.revenueProducts = response.data.data
    },

    async fetchRevenueProduct(id: string) {
      const response = await RevenueProductApiClient.getRevenueProduct(id)
      this.revenueProduct = response.data.data
    },

    async createRevenueProduct(productData: RevenueProduct) {
      const response = await RevenueProductApiClient.createRevenueProduct(productData)
      this.revenueProducts.push(response.data.data)
    },

    async updateRevenueProduct(id: string, productData: Partial<RevenueProduct>) {
      const response = await RevenueProductApiClient.updateRevenueProduct(id, productData)
      const index = this.revenueProducts.findIndex(product => product.id === id)
      if (index !== -1) {
        this.revenueProducts[index] = response.data.data
      }
    },

    async deleteRevenueProduct(id: string) {
      await RevenueProductApiClient.deleteRevenueProduct(id)
      this.revenueProducts = this.revenueProducts.filter(product => product.id !== id)
    }
  }
})
