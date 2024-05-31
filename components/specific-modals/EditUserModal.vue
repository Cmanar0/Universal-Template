<template>
  <div
    v-if="isVisible"
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
      >
        <div>
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            id="modal-title"
          >
            Edit User
          </h3>
          <div class="mt-2">
            <form @submit.prevent="updateUser">
              <div class="mb-4">
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700"
                  >First Name</label
                >
                <input
                  type="text"
                  id="firstName"
                  v-model="form.firstName"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
              <div class="mb-4">
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700"
                  >Last Name</label
                >
                <input
                  type="text"
                  id="lastName"
                  v-model="form.lastName"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
              <div class="mb-4">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
              <div class="mb-4">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { User } from '../../types/user' // Update the path as necessary

const props = defineProps({
  user: Object as () => User,
  isVisible: Boolean
})

const emits = defineEmits(['close', 'update'])

const form = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

watch(
  () => props.user,
  newUser => {
    Object.assign(form, newUser)
    form.password = ''
  },
  { immediate: true }
)

const closeModal = () => {
  emits('close')
}

const updateUser = () => {
  emits('update', { ...form })
}
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
