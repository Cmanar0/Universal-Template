<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md px-10 py-8 space-y-6 bg-white shadow-lg rounded-xl">
      <h1 class="text-2xl font-bold text-center text-gray-700">Welcome Back</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
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
              <img class="icon-eye w-5 h-5" v-if="showPassword" src="/eye.svg" alt="Show Password" data-testid="show-password-icon" id="show-password-icon" />
              <img class="icon-eye w-5 h-5" v-else src="/crossed_eye.svg" alt="Hide Password" data-testid="hide-password-icon" id="hide-password-icon" />
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="text-sm">
            <a href="/forgot-password" class="font-medium text-blue-600 hover:underline">Forgot password?</a>
          </div>
        </div>
        <button
          type="submit"
          class="w-full p-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transition duration-200"
        >
          Submit
        </button>
      </form>
      <div class="text-center">
        <p class="text-sm">
          Don't have an account?
          <a href="/register" class="font-medium text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===================== IMPORTS =====================
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { AuthApiClient } from '../../api/auth.api'
import { getJwtClaims } from '../../utils/jwtUtils'
import type { LoginPayload } from '../../types/api/auth.types'
import { useRouter } from 'vue-router'

// ===================== INSTANCES =====================
const router = useRouter()

// ===================== STATE =====================
const userInfo = ref<LoginPayload>({
  email: '',
  password: ''
})
const showPassword = ref(false)

// ===================== METHODS =====================
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  const payload: LoginPayload = {
    email: userInfo.value.email,
    password: userInfo.value.password
  }

  // Make the login request using the AuthApiClient
  const response = await AuthApiClient.login(payload)

  // Check if the response data contains the jwt token
  if (response.data?.data?.jwt) {
    const jwt = response.data.data.jwt
    Cookies.set('bv_jwt', jwt, {
      expires: 7,
      secure: true,
      sameSite: 'Strict'
    })

    // Use the utility function to decode the token
    const decodedToken = getJwtClaims(jwt)
    localStorage.setItem('bv_user', JSON.stringify(decodedToken))

    // Use router instance directly to navigate
    await router.push('/dashboard')
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
