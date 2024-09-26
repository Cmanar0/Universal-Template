<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 relative">
    <div class="w-full max-w-md px-10 py-8 space-y-6 bg-white shadow-lg rounded-xl">
      <h1 class="text-2xl font-bold text-center text-gray-700">Register</h1>

      <form @submit.prevent="handleRegistration" class="space-y-6">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            v-model="userInfo.email"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            class="w-full p-4 text-sm border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <div class="flex">
            <input
              v-model="userInfo.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              placeholder="Password"
              class="w-full p-4 text-sm border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            <span class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" @click="toggleShowPassword">
              <img class="icon-eye w-5 h-5" v-if="showPassword" src="/eye.svg" alt="Show Password" />
              <img class="icon-eye w-5 h-5" v-else src="/crossed_eye.svg" alt="Hide Password" />
            </span>
          </div>
        </div>

        <button
          type="submit"
          class="w-full p-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transition duration-200"
        >
          Register
        </button>
      </form>
      <div class="text-center">
        <p class="text-sm">
          Already have an account?
          <a href="/" class="font-medium text-blue-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===================== IMPORTS =====================
import { ref } from 'vue'
import { AuthApiClient } from '../../api/auth.api'
import { addMessage } from '../../stores/errorsStore.js'
import { useRouter } from 'vue-router'
import type { RegisterPayload } from '../../types/interfaces/auth'

// ===================== INSTANCES =====================
const router = useRouter()

// ===================== STATE =====================
const userInfo = ref<RegisterPayload>({
  email: '',
  password: ''
})

const showPassword = ref(false)

// ===================== METHODS =====================
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegistration = async () => {
  const payload: RegisterPayload = {
    email: userInfo.value.email,
    password: userInfo.value.password
  }

  // Call the register method from AuthApiClient, error handling is done in the service
  const response = await AuthApiClient.register(payload)

  // Check for status 201 to determine success
  if (response.status === 201) {
    const successMessage = 'Registration successful. We sent you an email for verification.'
    addMessage({
      header: 'Success',
      content: successMessage,
      btnText: 'Ok'
    })

    // Use router instance directly to navigate
    await router.push('/')
  }
}
</script>

<style scoped>
.custom {
  min-width: calc(100%);
}
.relative-icon {
  position: relative;
  right: 40px;
}
.icon-eye {
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.eye-span {
  opacity: 0.7;
  position: absolute;
  right: 15px;
  top: 15px;
}

input:focus {
  outline: none;
}

.icon-eye {
  cursor: pointer;
}

button {
  transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
