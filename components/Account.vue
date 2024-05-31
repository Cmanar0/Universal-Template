<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold mb-6">Account Information</h2>
    <form @submit.prevent="updateAccount">
      <div v-for="field in fields" :key="field.key" class="mb-4">
        <label
          :for="field.key"
          class="block text-sm font-medium text-gray-700"
          >{{ field.label }}</label
        >
        <div
          v-if="!field.isEditing"
          class="flex items-center justify-between mt-1"
        >
          <span>{{ form[field.key] || 'N/A' }}</span>
          <button
            type="button"
            @click="editField(field.key)"
            class="px-2 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Edit
          </button>
        </div>
        <div v-else class="flex items-center justify-between mt-1">
          <input
            :type="field.key === 'email' ? 'email' : 'text'"
            :id="field.key"
            v-model="form[field.key]"
            class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
          <button
            type="button"
            @click="saveField(field.key)"
            class="px-2 py-1 ml-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
          >
            Save
          </button>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Update All
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '../services/api-request' // Update the path as necessary

interface User {
  firstName: string | null
  lastName: string | null
  email: string
  password?: string
}

const form = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const fields = ref([
  { key: 'firstName', label: 'First Name', isEditing: false },
  { key: 'lastName', label: 'Last Name', isEditing: false },
  { key: 'email', label: 'Email', isEditing: false },
  { key: 'password', label: 'Password', isEditing: false }
])

const fetchAccountData = async () => {
  try {
    const response = await apiService.get('/api/account') // Adjust the endpoint as necessary
    form.value = {
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      password: '' // Do not fetch or display the password
    }
  } catch (error) {
    console.error('Failed to fetch account data:', error)
  }
}

const updateAccount = async () => {
  try {
    const data = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email
    }
    if (form.value.password) {
      data['password'] = form.value.password
    }
    await apiService.patch('/api/account', data) // Adjust the endpoint as necessary
    alert('Account updated successfully')
  } catch (error) {
    console.error('Failed to update account:', error)
    alert('Error updating account')
  }
}

const editField = (key: string) => {
  const field = fields.value.find(field => field.key === key)
  if (field) {
    field.isEditing = true
  }
}

const saveField = (key: string) => {
  const field = fields.value.find(field => field.key === key)
  if (field) {
    field.isEditing = false
  }
}

onMounted(() => {
  fetchAccountData()
})
</script>

<style scoped>
/* Add any additional styling here */
</style>
