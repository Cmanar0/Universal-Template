import { apiService } from '../services/api-request'
import type { ExpenseFrequency, CreateExpenseFrequency, UpdateExpenseFrequency } from '../types/api/expense-frequency.types'

export const ExpenseFrequencyApiClient = {
  // Fetch the list of expense frequencies
  getExpenseFrequencies() {
    return apiService.get<ExpenseFrequency[]>('/api/expense-frequency')
  },

  // Create a new expense frequency
  createExpenseFrequency(expenseFrequencyData: CreateExpenseFrequency) {
    return apiService.post<ExpenseFrequency>('/api/expense-frequency', expenseFrequencyData)
  },

  // Update an existing expense frequency by ID
  updateExpenseFrequency(expenseFrequencyId: string, expenseFrequencyData: UpdateExpenseFrequency) {
    return apiService.patch<ExpenseFrequency>(`/api/expense-frequency/${expenseFrequencyId}`, expenseFrequencyData)
  },

  // Delete an expense frequency by ID
  deleteExpenseFrequency(expenseFrequencyId: string) {
    return apiService.delete<void>(`/api/expense-frequency/${expenseFrequencyId}`)
  },

  // Fetch a single expense frequency by ID
  getExpenseFrequencyById(expenseFrequencyId: string) {
    return apiService.get<ExpenseFrequency>(`/api/expense-frequency/${expenseFrequencyId}`)
  }
}

export default ExpenseFrequencyApiClient
