<template>
  <div>
    <BaseModal v-if="!hasModalCustomTemplate" />
    <BaseModal :isFormValid="isFormValid" v-else>
      <template #header>
        <h2>{{ baseModalStore.getModalSettings.title }}</h2>
      </template>
      <template #default>
        <div class="modal-body flex flex-col gap-4">
          <input
            v-model="userInfo.username"
            type="text"
            placeholder="Name"
            class="p-2 border border-gray-200 rounded w-full"
          />
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              v-model="userInfo.email"
              type="email"
              name="email"
              placeholder="Email"
              class="p-2 border border-gray-200 rounded w-full"
              :class="{ 'border-red-500': userInfo.email && !isValidEmail }"
              required
            />
            <p
              v-if="userInfo.email && !isValidEmail"
              class="mt-1 text-sm text-red-500"
            >
              Please enter a valid email address.
            </p>
          </div>
          <div>
            <label for="email" class="sr-only">Password</label>
            <input
              v-model="userInfo.password"
              type="password"
              name="password"
              placeholder="Password"
              class="p-2 border border-gray-200 rounded w-full"
              :class="{ 'border-red-500': userInfo.email && !isValidEmail }"
              required
            />
            <p
              v-if="userInfo.password && !isPassworGoodEnough"
              class="mt-1 text-sm text-red-500"
            >
              Password must be at least 6 characters long.
            </p>
          </div>
          <div>
            <label for="email" class="sr-only">Password</label>
            <input
              v-model="userInfo.passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              class="p-2 border border-gray-200 rounded w-full"
              :class="{
                'border-red-500':
                  userInfo.passwordConfirmation && !isPasswordMatch
              }"
              required
            />
            <p
              v-if="userInfo.passwordConfirmation && !isPasswordMatch"
              class="mt-1 text-sm text-red-500"
            >
              Password does not match.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          @click="baseModalStore.leftBtnAction"
          class="text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
        <button
          @click="baseModalStore.rightBtnAction"
          class="text-blue-500 hover:text-blue-700 ml-4"
          :class="{ disabled: !isFormValid }"
          :disabled="!isFormValid"
        >
          Save
        </button>
      </template>
    </BaseModal>
    <div class="main-header">
      <h1>List of users</h1>
      <button
        @click="addUserModalForm"
        class="btn-content mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <user-plus class="icon" /> Add User
      </button>
    </div>

    <div class="overflow-auto">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-200">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="bg-white border-b hover:bg-gray-50"
          >
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ user.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-5 py-2 text-right text-sm font-medium">
              <div class="actions">
                <span class="btn-content" @click="editUserModalForm(user.id)">
                  <edit class="icon" />
                  Edit
                </span>
                <span class="btn-content" @click="deleteUser(user.id)">
                  <user-minus class="icon" />
                  Delete
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" async setup>
import { computed, ref, reactive } from 'vue'
// ---------------------- Composables ----------------------
import { usersComposable } from '../composables/manageUsers/usersComposable'
const {
  users,
  addUserToStoreCOMP,
  editUserInStoreCOMP,
  deleteUserFromStoreCOMP
} = usersComposable()
// ---------------------- Stores ----------------------
import { useBaseModalStore } from '@/stores/baseModalStore'
const baseModalStore = useBaseModalStore()

import { manageUsers } from '../stores/store'
const usersStore = manageUsers()
// ---------------------- Components ----------------------
import userPlus from '../assets/svg/user-plus.vue'
import userMinus from '../assets/svg/user-minus.vue'
import edit from '../assets/svg/edit.vue'
import close from '../assets/svg/close.vue'
import BaseModal from './reusable/BaseModal.vue'

// ---------------------- REACTIVE START ------------------------
const userInfo = reactive({
  id: Math.floor(Math.random() * 901) + 100,
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})
const hasModalCustomTemplate = ref(false)
// ---------------------- REACTIVE END --------------------------
// -------------------- COMPUTED START-----------------------
const isValidEmail = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(userInfo.email)
})
const isPasswordMatch = computed(() => {
  return userInfo.password === userInfo.passwordConfirmation
})
const isPassworGoodEnough = computed(() => {
  const passwordPattern = /^.{6,}$/
  return passwordPattern.test(userInfo.password)
})
const isFormValid = computed(() => {
  return (
    isValidEmail.value && isPasswordMatch.value && isPassworGoodEnough.value
  )
})
// -------------------- COMPUTED END-------------------------
// -------------------- FUNCTIONS START ---------------------
function addUserModalForm() {
  hasModalCustomTemplate.value = true
  baseModalStore.setModalSettings({
    action: 'adduser',
    title: 'Add User',
    content: '',
    leftBtnText: 'Cancel',
    leftBtnAction: () => {
      baseModalStore.closeModal()
    },
    rightBtnText: 'Save',
    rightBtnAction: () => {
      addUser()
      baseModalStore.closeModal()
    }
  })
  baseModalStore.openModal()
}
function editUserModalForm(id: number) {
  const user = usersStore.getUserById(id)
  Object.assign(userInfo, user)
  userInfo.passwordConfirmation = userInfo.password
  hasModalCustomTemplate.value = true
  baseModalStore.setModalSettings({
    action: 'edit',
    title: 'Edit User',
    content: 'Are you sure you want to edit this user?',
    leftBtnText: 'Cancel',
    leftBtnAction: () => {
      resetUserInfo()
      baseModalStore.closeModal()
    },
    rightBtnText: 'Save',
    rightBtnAction: () => {
      editUser(id)
      baseModalStore.closeModal()
    }
  })
  baseModalStore.openModal()
}
function deleteUser(id: number) {
  hasModalCustomTemplate.value = false
  baseModalStore.setModalSettings({
    title: 'Delete User',
    content: 'Are you sure you want to delete this user?',
    leftBtnText: 'Cancel',
    leftBtnAction: () => {
      baseModalStore.closeModal()
    },
    rightBtnText: 'Confirm',
    rightBtnAction: () => {
      deleteUserFromStoreCOMP(id)
      baseModalStore.closeModal()
    }
  })
  baseModalStore.openModal()
}
function addUser() {
  addUserToStoreCOMP({ ...userInfo })
  resetUserInfo()
}
function editUser(id: number) {
  editUserInStoreCOMP(id, { ...userInfo })
  resetUserInfo()
}
function resetUserInfo() {
  userInfo.id = Math.floor(Math.random() * 901) + 100
  userInfo.username = ''
  userInfo.email = ''
  userInfo.password = ''
  userInfo.passwordConfirmation = ''
}
// -------------------- FUNCTIONS END ---------------------
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.actions span {
  display: flex;
  cursor: pointer;
  color: #777;
  align-items: center;
  background-color: #f9f9f9;
  padding: 0.4rem;
  border-radius: 0.25rem;
}
.actions span:hover {
  background-color: #e6e6e6;
  color: #555;
}
.actions span:active {
  background-color: #d9d9d9;
  color: #444;
}
.overflow-auto {
  overflow-x: auto;
  scrollbar-width: auto;
}

.overflow-auto::-webkit-scrollbar {
  height: 8px;
  background: #f1f1f1;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #888;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.disabled {
  cursor: not-allowed !important;
  opacity: 0.5 !important;
}
</style>
