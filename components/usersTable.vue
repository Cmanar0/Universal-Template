<template>
  <div class="table-container">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Email
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            First Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Last Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Lang
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Is Active
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Registered At
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Updated At
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ user.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.firstName }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.lastName }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.lang }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.isActive }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ new Date(user.registeredAt).toLocaleString() }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ new Date(user.updatedAt).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import apiService from '../services/api-request' // Update the path as necessary
import { User } from '../types/user' // Update the path as necessary

const users = ref<User[]>([])
const config = useRuntimeConfig()

onMounted(async () => {
  try {
    const response = await apiService.get(
      '/users',
      {},
      {},
      config.public.baseApiUrl
    )
    users.value = response.users
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}
</style>
