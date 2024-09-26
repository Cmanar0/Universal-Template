// api/stage-expenses.api.ts

import { apiService } from '../services/api-request'
import type { StageExpensePayload, StageExpenseResponse, StageExpensesResponse } from '../types/api/stage-expenses.types'

export const StageExpensesApiClient = {
  // Get all stage expenses
  getStageExpenses() {
    return apiService.get<StageExpensesResponse>('/api/stage-expenses')
  },

  // Get a single stage expense by ID
  getStageExpense(id: string) {
    return apiService.get<StageExpenseResponse>(`/api/stage-expenses/${id}`)
  },

  // Create a new stage expense
  createStageExpense(expenseData: StageExpensePayload) {
    return apiService.post<StageExpenseResponse>('/api/stage-expenses', expenseData)
  },

  // Update an existing stage expense by ID
  updateStageExpense(id: string, expenseData: Partial<StageExpensePayload>) {
    return apiService.patch<StageExpenseResponse>(`/api/stage-expenses/${id}`, expenseData)
  },

  // Delete a stage expense by ID
  deleteStageExpense(id: string) {
    return apiService.delete<void>(`/api/stage-expenses/${id}`)
  }
}
