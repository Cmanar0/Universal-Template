<template>
  <div class="mb-6">
    <h2 class="text-xl pb-4">Expenses Per Product</h2>
    <v-btn color="success" size="large" @click="openDialog" class="mb-6">Add New Product Expense</v-btn>
    <v-data-table :headers="headers" :items="expenses" :loading="loading" class="mb-6" hide-default-footer>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="refForm" v-model="isFormValid">
            <v-text-field v-model="editedItem.name" :rules="[rules.required]" label="Product Name" color="#1697F6" variant="outlined" dense class="pt-2"></v-text-field>
            <v-text-field
              v-model="editedItem.expense"
              :rules="[rules.required, rules.numeric]"
              label="Expense"
              type="number"
              color="#1697F6"
              variant="outlined"
              dense
              class="pt-2"
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="submitExpense">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="600px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { VBtn, VDataTable, VDialog, VCard, VCardTitle, VCardText, VCardActions, VTextField, VForm, VSpacer, VIcon, VSkeletonLoader } from 'vuetify/components'

// Refs and initial data setup
const dialog = ref(false)
const dialogDelete = ref(false)
const isFormValid = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: '',
  expense: null
})
const newExpense = ref({
  name: '',
  expense: null
})
const expenses = ref([])
const refForm = ref(null) // Define the ref for the form

// Headers definition
const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Expense', value: 'expense' },
  { text: 'Actions', value: 'actions', sortable: false }
]

// Form validation rules
const rules = {
  required: value => !!value || 'Required.',
  numeric: value => (!isNaN(parseFloat(value)) && isFinite(value)) || 'Must be a number.'
}

// Computed property for form title
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Add New Product Expense' : 'Edit Product Expense'
})

// Loading state
const loading = ref(false)

// Function to fetch expenses from API
const fetchExpenses = () => {
  loading.value = true
  console.log('Fetching data...')
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 'EP1', name: 'Smartphone Case', expense: 5 },
        { id: 'EP2', name: 'Screen Protector', expense: 3 }
      ])
    }, 1000)
  }).then(data => {
    console.log('Data fetched:', data)
    expenses.value = data
    loading.value = false
  })
}

// Function to open the dialog for adding a new expense
const openDialog = () => {
  editedIndex.value = -1
  editedItem.value = { ...newExpense.value }
  dialog.value = true
}

// Function to submit an expense (create or edit)
const submitExpense = async () => {
  const form = refForm.value
  const valid = await form.validate()
  if (!isFormValid.value) {
    console.error('Validation failed. Please check the form fields.')
    return
  }
  if (valid) {
    if (editedIndex.value > -1) {
      // Edit existing expense
      updateExpense(editedItem.value).then(() => {
        Object.assign(expenses.value[editedIndex.value], editedItem.value)
        close()
      })
    } else {
      // Create new expense
      createExpense(editedItem.value).then(newExpense => {
        expenses.value.push(newExpense)
        close()
      })
    }
  } else {
    console.error('Validation failed. Please check the form fields.')
  }
}

// Function to create an expense via API
const createExpense = expense => {
  console.log('Creating expense...', expense)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Expense created successfully:', expense)
      resolve({ ...expense, id: `EP${expenses.value.length + 1}` })
    }, 500)
  })
}

// Function to update an expense via API
const updateExpense = expense => {
  loading.value = true

  console.log('Updating expense...', expense)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Expense updated successfully:', expense)
      resolve(expense)
    }, 500)
  }).then(updatedExpense => {
    loading.value = false
  })
}

// Function to delete an expense via API
const deleteExpense = expenseId => {
  console.log('Deleting expense...', expenseId)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Expense deleted successfully:', expenseId)
      resolve(true)
    }, 500)
  })
}

// Function to handle item edit
const editItem = item => {
  editedIndex.value = expenses.value.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

// Function to handle item delete
const deleteItem = item => {
  editedIndex.value = expenses.value.indexOf(item)
  editedItem.value = { ...item }
  dialogDelete.value = true
}

// Function to confirm item delete
const deleteItemConfirm = () => {
  deleteExpense(editedItem.value.id).then(() => {
    expenses.value.splice(editedIndex.value, 1)
    closeDelete()
  })
}

// Function to close the dialog
const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = { ...newExpense.value }
    editedIndex.value = -1
  })
}

// Function to close the delete dialog
const closeDelete = () => {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = { ...newExpense.value }
    editedIndex.value = -1
  })
}

// Fetch expenses on component mount
onMounted(() => {
  fetchExpenses()
})
</script>

<style scoped></style>
