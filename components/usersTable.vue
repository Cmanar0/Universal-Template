<template>
  <div>
    <div class="overflow-x-auto">
      <div class="min-w-full divide-y divide-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
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
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
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
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative"
              >
                <img
                  class="icon cursor-pointer"
                  @click="toggleDropdown(user.id)"
                  src="../assets/svg/dots.svg"
                  alt="dots-for-editing"
                />
                <div
                  v-if="dropdownOpen === user.id"
                  class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                >
                  <a
                    href="#"
                    @click.prevent="openEditModal(user)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Edit</a
                  >
                  <a
                    href="#"
                    @click.prevent="openDeactivateModal(user)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >{{ user.isActive ? 'Deactivate' : 'Activate' }}</a
                  >
                  <a
                    href="#"
                    @click.prevent="openDeleteModal(user)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Delete</a
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EditUserModal
      :user="form"
      :isVisible="isEditModalOpen"
      @close="closeModal"
      @update="updateUser"
    />

    <!-- Confirmation Modals -->
    <ModalTwoBtns
      v-if="isDeactivateModalOpen"
      :header="`Confirm ${
        deactivateUser.isActive ? 'Deactivation' : 'Activation'
      }`"
      :content="`Are you sure you want to ${
        deactivateUser.isActive ? 'deactivate' : 'activate'
      } this user?`"
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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import apiService from '../services/api-request' // Update the path as necessary
// import { User } from '../types/user' // Update the path as necessary
import EditUserModal from './specific-modals/EditUserModal.vue'
import ModalTwoBtns from './reusable/ModalTwoBtns.vue'
import { addNotification } from '../stores/notificationStore' // Import addNotification

interface User {
  id: string
  email?: string
  firstName?: string | null
  lastName?: string | null
  lang?: string
  isActive?: boolean
  registeredAt?: string
  updatedAt?: string
}

const users = ref<User[]>([])
const baseApiUrl = 'https://next-backend-six.vercel.app/api/' // Get base API URL from environment variables

const dropdownOpen = ref<string | null>(null)
const isEditModalOpen = ref(false)
const isDeactivateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const form = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const deactivateUser = reactive<User>({
  id: ''
})

const deleteUser = reactive<User>({
  id: ''
})

const fetchUsers = async () => {
  try {
    const response = await apiService.get('/users', {}, {}, baseApiUrl)
    console.log('fetchUsers response :>> ', response)
    users.value = response.users
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const toggleDropdown = (userId: string) => {
  dropdownOpen.value = dropdownOpen.value === userId ? null : userId
}

const openEditModal = (user: User) => {
  Object.assign(form, user)
  form.password = ''
  isEditModalOpen.value = true
  dropdownOpen.value = null
}

const openDeactivateModal = (user: User) => {
  Object.assign(deactivateUser, user)
  isDeactivateModalOpen.value = true
  dropdownOpen.value = null
}

const openDeleteModal = (user: User) => {
  Object.assign(deleteUser, user)
  isDeleteModalOpen.value = true
  dropdownOpen.value = null
}

const closeModal = () => {
  isEditModalOpen.value = false
  isDeactivateModalOpen.value = false
  isDeleteModalOpen.value = false
}

const updateUser = async (updatedUser: User) => {
  try {
    await apiService.patch(
      `/users/${updatedUser.id}`,
      updatedUser,
      {},
      {},
      baseApiUrl
    )
    await fetchUsers()
    closeModal()
    addNotification({
      title: 'Success',
      message: 'User updated successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to update user:', error)
    addNotification({
      title: 'Error',
      message: 'Failed to update user',
      color: 'red'
    })
  }
}

const confirmDeactivate = async () => {
  try {
    await apiService.patch(
      `/users/${deactivateUser.id}`,
      { isActive: !deactivateUser.isActive },
      {},
      {},
      baseApiUrl
    )
    await fetchUsers()
    closeModal()
    addNotification({
      title: 'Success',
      message: `User ${
        deactivateUser.isActive ? 'deactivated' : 'activated'
      } successfully`,
      color: 'green'
    })
  } catch (error) {
    console.error(
      `Failed to ${deactivateUser.isActive ? 'deactivate' : 'activate'} user:`,
      error
    )
    addNotification({
      title: 'Error',
      message: `Failed to ${
        deactivateUser.isActive ? 'deactivate' : 'activate'
      } user`,
      color: 'red'
    })
  }
}

const confirmDelete = async () => {
  try {
    await apiService.delete(`/users/${deleteUser.id}`, {}, {}, baseApiUrl)
    await fetchUsers()
    closeModal()
    addNotification({
      title: 'Success',
      message: 'User deleted successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to delete user:', error)
    addNotification({
      title: 'Error',
      message: 'Failed to delete user',
      color: 'red'
    })
  }
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
