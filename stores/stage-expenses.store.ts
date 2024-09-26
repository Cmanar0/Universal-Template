// stores/stageExpenses.store.js

import { defineStore } from 'pinia'
import { StageExpensesApiClient } from '../api/stage-expenses.api'
import type { StageExpense, StageExpensePayload } from '../types/api/stage-expenses.types'

export const useStageExpensesStore = defineStore('stageExpenses', {
  state: () => ({
    stageExpenses: [] as StageExpense[], // List of stage expenses
    selectedExpense: null as StageExpense | null // Selected stage expense for detail view/edit
  }),

  actions: {
    // Fetch all stage expenses
    async loadStageExpenses() {
      const response = await StageExpensesApiClient.getStageExpenses()
      this.stageExpenses = response.data.data
    },

    // Fetch a single stage expense by ID
    async loadStageExpense(id: string) {
      const response = await StageExpensesApiClient.getStageExpense(id)
      this.selectedExpense = response.data.data
    },

    // Create a new stage expense
    async createStageExpense(expenseData: StageExpensePayload) {
      const response = await StageExpensesApiClient.createStageExpense(expenseData)
      this.stageExpenses.push(response.data.data)
    },

    // Update an existing stage expense by ID
    async updateStageExpense(id: string, expenseData: Partial<StageExpensePayload>) {
      const response = await StageExpensesApiClient.updateStageExpense(id, expenseData)
      const index = this.stageExpenses.findIndex(expense => expense.id === id)
      if (index !== -1) {
        this.stageExpenses[index] = response.data.data
      }
    },

    // Delete a stage expense by ID
    async deleteStageExpense(id: string) {
      await StageExpensesApiClient.deleteStageExpense(id)
      this.stageExpenses = this.stageExpenses.filter(expense => expense.id !== id)
    }
  }
})
