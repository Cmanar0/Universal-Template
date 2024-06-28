<template>
  <div>
    <div class="overflow-x-auto">
      <div class="min-w-full divide-y divide-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lang</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lang }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  :class="{
                    'bg-green-100 text-green-800': user.isActive,
                    'bg-yellow-100 text-yellow-900': !user.isActive
                  }"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ user.isActive ? 'Active' : 'Deactivated' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(user.registeredAt).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(user.updatedAt).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon icon="mdi-dots-vertical" v-bind="props"></v-icon>
                  </template>
                  <v-list>
                    <v-list-item @click="openEditModal(user)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openDeactivateModal(user)">
                      <v-list-item-title>{{ user.isActive ? 'Deactivate' : 'Activate' }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openDeleteModal(user)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EditUserModal :user="selectedUser" @close="closeModal" @update="updateUser" />

    <!-- Confirmation Modals -->
    <ModalTwoBtns
      v-if="isDeactivateModalOpen"
      :header="`Confirm ${deactivateUser.isActive ? 'Deactivation' : 'Activation'}`"
      :content="`Are you sure you want to ${deactivateUser.isActive ? 'deactivate' : 'activate'} this user?`"
      btnText="Confirm"
      :btnColor="deactivateUser.isActive ? 'bg-red-500' : 'bg-green-500'"
      @confirm="confirmDeactivate"
      @close="closeModal"
    />
    <ModalTwoBtns
      v-if="isDeleteModalOpen"
      header="Confirm Deletion"
      content="Are you sure you want to delete this user?"
      btnText="Delete"
      btnColor="bg-red-500"
      @confirm="confirmDelete"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import apiService from '../services/api-request' // Update the path as necessary
import EditUserModal from './specific-modals/EditUserModal.vue'
import ModalTwoBtns from './reusable/ModalTwoBtns.vue'
import { addNotification } from '../stores/notificationStore' // Import addNotification

const users = ref([])

const dropdownOpen = ref(null)
const isDeactivateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedUser = ref(null)
const deactivateUser = reactive({
  id: ''
})

const deleteUser = reactive({
  id: ''
})

const fetchUsers = async () => {
  try {
    const response = await apiService.get('/api/users')
    users.value = response.data.data // Adjusted to access the correct data structure
    console.log('response :>> ', response)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const openEditModal = user => {
  console.log('user :>> ', user)
  selectedUser.value = user
  dropdownOpen.value = null
}

const openDeactivateModal = user => {
  Object.assign(deactivateUser, user)
  isDeactivateModalOpen.value = true
  dropdownOpen.value = null
}

const openDeleteModal = user => {
  Object.assign(deleteUser, user)
  isDeleteModalOpen.value = true
  dropdownOpen.value = null
}

const closeModal = () => {
  isDeactivateModalOpen.value = false
  isDeleteModalOpen.value = false
}

const updateUser = async updatedUser => {
  await fetchUsers()
  closeModal()
}

const confirmDeactivate = async () => {
  await apiService.patch(`/api/users/${deactivateUser.id}`, { isActive: !deactivateUser.isActive })
  await fetchUsers()
  closeModal()
}

const confirmDelete = async () => {
  await apiService.delete(`/api/users/${deleteUser.id}`)
  await fetchUsers()
  closeModal()
}

onMounted(() => {
  fetchUsers()
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
