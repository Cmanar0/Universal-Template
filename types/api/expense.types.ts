export interface Expense {
  id: string
  name: string
  amount: number
  description: string
  frequencyId: string
  projectId: string
}

export interface CreateExpense {
  name: string
  amount: number
  description: string
  frequencyId: string
  projectId: string
}

export interface UpdateExpense {
  name?: string
  amount?: number
  description?: string
  frequencyId?: string
  projectId?: string
}
