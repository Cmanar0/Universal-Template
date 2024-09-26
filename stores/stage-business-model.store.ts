import { defineStore } from 'pinia'
import { StageBusinessModelsApiClient } from '../api/stage-business-model.api'
import type { StageBusinessModel, StageBusinessModelPayload } from '../types/api/stage-business-model.types'

export const useStageBusinessModelsStore = defineStore('stageBusinessModels', {
  state: () => ({
    stageBusinessModels: [] as StageBusinessModel[], // List of stage business models
    selectedBusinessModel: null as StageBusinessModel | null // Selected stage business model for detail view/edit
  }),

  actions: {
    // Fetch all stage business models
    async loadStageBusinessModels() {
      const response = await StageBusinessModelsApiClient.getStageBusinessModels()
      this.stageBusinessModels = response.data.data
    },

    // Fetch a single stage business model by ID
    async loadStageBusinessModel(id: string) {
      const response = await StageBusinessModelsApiClient.getStageBusinessModel(id)
      this.selectedBusinessModel = response.data.data
    },

    // Create a new stage business model
    async createStageBusinessModel(businessModelData: StageBusinessModelPayload) {
      const response = await StageBusinessModelsApiClient.createStageBusinessModel(businessModelData)
      this.stageBusinessModels.push(response.data.data)
    },

    // Update an existing stage business model by ID
    async updateStageBusinessModel(id: string, businessModelData: Partial<StageBusinessModelPayload>) {
      const response = await StageBusinessModelsApiClient.updateStageBusinessModel(id, businessModelData)
      const index = this.stageBusinessModels.findIndex(businessModel => businessModel.id === id)
      if (index !== -1) {
        this.stageBusinessModels[index] = response.data.data
      }
    },

    // Delete a stage business model by ID
    async deleteStageBusinessModel(id: string) {
      await StageBusinessModelsApiClient.deleteStageBusinessModel(id)
      this.stageBusinessModels = this.stageBusinessModels.filter(businessModel => businessModel.id !== id)
    }
  }
})
