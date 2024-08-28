<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
    <div class="mt-6 bg-white p-4 rounded-md">
      <h3 class="text-xl font-semibold mb-4">Personal Information</h3>
      <v-form @submit.prevent="updateAccount">
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <div v-if="!isEditing" class="mt-1">
            <span>{{ form.firstName || 'N/A' }}</span>
          </div>
          <div v-else class="mt-1">
            <v-text-field variant="outlined" v-model="form.firstName" hide-details></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <div v-if="!isEditing" class="mt-1">
            <span>{{ form.lastName || 'N/A' }}</span>
          </div>
          <div v-else class="mt-1">
            <v-text-field variant="outlined" v-model="form.lastName" hide-details></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <div v-if="!isEditing" class="mt-1">
            <span>{{ form.email || 'N/A' }}</span>
          </div>
          <div v-else class="mt-1">
            <v-text-field variant="outlined" v-model="form.email" hide-details type="email"></v-text-field>
          </div>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div v-if="!isEditing" class="mt-1">
            <span>••••••••</span>
          </div>
          <div v-else class="mt-1">
            <v-text-field variant="outlined" v-model="form.password" hide-details type="password"></v-text-field>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <v-btn v-if="isEditing" color="primary" type="submit" :disabled="!hasChanges">Update All</v-btn>
          <v-btn color="primary" @click="toggleEditing">
            {{ isEditing ? 'Close' : 'Edit' }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Cookies from 'js-cookie'
import apiService from '../../services/api-request' // Update the path as necessary

const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('bv_user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const originalForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const isEditing = ref(false)

const fetchAccountData = async () => {
  try {
    console.log('Fetching user data for ID:', user.value.id)
    const response = await apiService.get(`/api/users/${user.value.id}`)
    const userData = response.data.data
    form.value = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
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
    await apiService.patch(`/api/users/${user.value.id}`, data)
    // Update local storage
    const updatedUser = { ...user.value, ...data }
    localStorage.setItem('bv_user', JSON.stringify(updatedUser))
    user.value = updatedUser
    originalForm.value = { ...form.value }
    isEditing.value = false
    window.location.reload()
  } catch (error) {
    console.error('Failed to update account:', error)
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
  newVal => {
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
