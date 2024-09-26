import { defineStore } from 'pinia'
import { ProductTypeApiClient } from '../api/product-type.api'
import type { ProductType, ProductTypePayload } from '../types/api/product-type.types'

export const useProductTypeStore = defineStore('productType', {
  state: () => ({
    productTypes: [] as ProductType[]
  }),

  actions: {
    async loadProductTypes() {
      const response = await ProductTypeApiClient.getProductTypes()
      this.productTypes = response.data.data
    },

    async createProductType(productData: ProductTypePayload) {
      const response = await ProductTypeApiClient.createProductType(productData)
      this.productTypes.push(response.data.data) // Using the interface from types
    },

    async updateProductType(id: string, productData: Partial<ProductTypePayload>) {
      const response = await ProductTypeApiClient.updateProductType(id, productData)
      const index = this.productTypes.findIndex(product => product.id === id)
      if (index !== -1) {
        this.productTypes[index] = response.data.data // Update the product data in the state
      }
    },

    async deleteProductType(id: string) {
      await ProductTypeApiClient.deleteProductType(id)
      this.productTypes = this.productTypes.filter(product => product.id !== id)
    }
  },

  getters: {
    getAllProductTypes(state) {
      return state.productTypes
    },

    getProductTypeById: state => (id: string) => {
      return state.productTypes.find(product => product.id === id)
    }
  }
})
