import { apiService } from '../services/api-request'
import type { Expense, CreateExpense, UpdateExpense } from '../types/api/expense.types'

export const ExpenseApiClient = {
  // Fetch the list of expenses
  getExpenses() {
    return apiService.get<Expense[]>('/api/expense')
  },

  // Create a new expense
  createExpense(expenseData: CreateExpense) {
    return apiService.post<Expense>('/api/expense', expenseData)
  },

  // Update an existing expense by ID
  updateExpense(expenseId: string, expenseData: UpdateExpense) {
    return apiService.patch<Expense>(`/api/expense/${expenseId}`, expenseData)
  },

  // Delete an expense by ID
  deleteExpense(expenseId: string) {
    return apiService.delete<void>(`/api/expense/${expenseId}`)
  },

  // Fetch a single expense by ID
  getExpenseById(expenseId: string) {
    return apiService.get<Expense>(`/api/expense/${expenseId}`)
  }
}

export default ExpenseApiClient
