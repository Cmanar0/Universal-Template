// Define the payload interface for creating or updating a stage expense
export interface StageExpensePayload {
  completed: boolean
  name: string
  projectId: string
}

// Define the general stage expense interface
export interface StageExpense {
  id: string
  completed: boolean
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single stage expense
export interface StageExpenseResponse {
  data: StageExpense
  message: string
  status: number
}

// Define the response interface for getting multiple stage expenses
export interface StageExpensesResponse {
  data: StageExpense[]
  message: string
  status: number
}
