<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
    <div class="flex items-center bg-purple-100 p-4 rounded-t-md">
      <img class="w-20 h-20 rounded-full mr-4" src="https://via.placeholder.com/100" alt="Profile Picture" />
      <div>
        <h2 class="text-xl font-bold">{{ form.firstName }} {{ form.lastName }}</h2>
        <p class="text-gray-600">UI/UX Designer</p>
      </div>
    </div>
    <div class="flex justify-between items-center mt-4 p-4">
      <div class="text-center">
        <h3 class="text-2xl font-bold">125</h3>
        <p class="text-gray-600">Projects</p>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold">$1245</h3>
        <p class="text-gray-600">Review</p>
      </div>
      <v-btn color="primary">View Profile</v-btn>
    </div>

    <div class="mt-6 bg-white p-4 rounded-md">
      <h3 class="text-xl font-semibold mb-4">Personal Information</h3>
      <v-form @submit.prevent="updateAccount">
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <div v-if="!isEditing" class="flex items-center justify-between mt-1">
            <span>{{ form.firstName || 'N/A' }}</span>
          </div>
          <div v-else class="flex items-center justify-between mt-1">
            <v-text-field type="text" v-model="form.firstName" hide-details class="flex-1"></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <div v-if="!isEditing" class="flex items-center justify-between mt-1">
            <span>{{ form.lastName || 'N/A' }}</span>
          </div>
          <div v-else class="flex items-center justify-between mt-1">
            <v-text-field type="text" v-model="form.lastName" hide-details class="flex-1"></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div v-if="!isEditing" class="flex items-center justify-between mt-1">
            <span>{{ form.email || 'N/A' }}</span>
          </div>
          <div v-else class="flex items-center justify-between mt-1">
            <v-text-field type="email" v-model="form.email" hide-details class="flex-1"></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div v-if="!isEditing" class="flex items-center justify-between mt-1">
            <span>{{ form.password || 'N/A' }}</span>
          </div>
          <div v-else class="flex items-center justify-between mt-1">
            <v-text-field type="password" v-model="form.password" hide-details class="flex-1"></v-text-field>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <v-btn v-if="isEditing" color="primary" type="submit" :disabled="!hasChanges"> Update All </v-btn>
          <v-btn color="primary" @click="toggleEditing">
            {{ isEditing ? 'Close' : 'Edit' }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Cookies from 'js-cookie'
import apiService from '../services/api-request' // Update the path as necessary

interface User {
  id?: string
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

const originalForm = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const isEditing = ref(false)
const userId = '286e2d0a-5162-4261-8e70-11f9f15a54ed' // Extract this from the token if necessary

const fetchAccountData = async () => {
  try {
    console.log('Fetching user data for ID:', userId)
    const response = await apiService.get(`/api/users/${userId}`)
    console.log('response USER :>> ', response)
    form.value = {
      id: response.id,
      firstName: response.data.user.firstName ? response.data.user.firstName : '',
      lastName: response.data.user.lastName ? response.data.user.lastName : '',
      email: response.data.user.email ? response.data.user.email : '',
      password: '' // Do not fetch or display the password
    }
    originalForm.value = { ...form.value }
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
    console.log('Updating user data with:', data)
    const token = Cookies.get('bv_jwt')
    await apiService.patch(`/api/users/${userId}`, data)
    originalForm.value = { ...form.value }
    alert('Account updated successfully')
    isEditing.value = false
    console.log('Updated user data:', form.value)
  } catch (error) {
    console.error('Failed to update account:', error)
    alert('Error updating account')
  }
}

const toggleEditing = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    form.value = { ...originalForm.value }
  }
}

const hasChanges = ref(false)
watch(
  form,
  (newVal, oldVal) => {
    hasChanges.value = JSON.stringify(newVal) !== JSON.stringify(originalForm.value)
  },
  { deep: true }
)

onMounted(() => {
  fetchAccountData()
})
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}
.icon {
  width: 20px;
  height: 20px;
}
</style>
