// api/stage-business-model.api.ts

import { apiService } from '../services/api-request'
import type { StageBusinessModelPayload, StageBusinessModelResponse, StageBusinessModelsResponse } from '../types/api/stage-business-model.types'

export const StageBusinessModelsApiClient = {
  // Get all stage business models
  getStageBusinessModels() {
    return apiService.get<StageBusinessModelsResponse>('/api/stage-business-model')
  },

  // Get a single stage business model by ID
  getStageBusinessModel(id: string) {
    return apiService.get<StageBusinessModelResponse>(`/api/stage-business-model/${id}`)
  },

  // Create a new stage business model
  createStageBusinessModel(businessModelData: StageBusinessModelPayload) {
    return apiService.post<StageBusinessModelResponse>('/api/stage-business-model', businessModelData)
  },

  // Update an existing stage business model by ID
  updateStageBusinessModel(id: string, businessModelData: Partial<StageBusinessModelPayload>) {
    return apiService.patch<StageBusinessModelResponse>(`/api/stage-business-model/${id}`, businessModelData)
  },

  // Delete a stage business model by ID
  deleteStageBusinessModel(id: string) {
    return apiService.delete<void>(`/api/stage-business-model/${id}`)
  }
}
