// Define the payload interface for creating or updating a stage business model
export interface StageBusinessModelPayload {
  completed: boolean
  businessName: string
  businessDescription: string
  targetAudience: string
  projectId: string
  businessTypeId: string
  businessModelId: string
}

// Define the general stage business model interface
export interface StageBusinessModel {
  id: string
  completed: boolean
  businessName: string
  businessDescription: string
  targetAudience: string
  projectId: string
  businessTypeId: string
  businessModelId: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single stage business model
export interface StageBusinessModelResponse {
  data: StageBusinessModel
  message: string
  status: number
}

// Define the response interface for getting multiple stage business models
export interface StageBusinessModelsResponse {
  data: StageBusinessModel[]
  message: string
  status: number
}
