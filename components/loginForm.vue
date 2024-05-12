<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="w-full max-w-md px-10 py-8 space-y-6 bg-white shadow-lg rounded-xl"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h1 class="text-xl font-bold text-center">Welcome Back</h1>

        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            v-model="userInfo.email"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            class="w-full p-4 text-sm border-gray-300 rounded-md shadow-sm"
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
              class="custom w-full p-4 text-sm border-gray-300 rounded-md shadow-sm"
            />
            <span
              class="relative-icon inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              @click="toggleShowPassword"
            >
              <img v-if="showPassword" src="../assets/svg/eye.svg" alt="" />
              <img v-else src="../assets/svg/crossed_eye.svg" alt="" />
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              v-model="rememberMe"
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="rememberMe" class="block ml-2 text-sm text-gray-900"
              >Remember me</label
            >
          </div>
          <div class="text-sm">
            <a
              href="/forgot-password"
              class="font-medium text-blue-600 hover:underline"
              >Forgot password?</a
            >
          </div>
        </div>
        <button
          type="submit"
          class="w-full p-4 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <div class="text-center">
        <p class="text-sm">
          Don't have an account?
          <a href="/signup" class="font-medium text-blue-600 hover:underline"
            >SignUp</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiService from '../services/api-request'
import Cookies from 'js-cookie'

const userInfo = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  try {
    // Send email and password for authentication
    const data = await apiService.post('auth', {
      email: userInfo.value.email,
      password: userInfo.value.password
    })
    console.log('Login successful:', data)
    // Store JWT in cookies for future requests
    Cookies.set('bv_jwt', data.token, {
      expires: 1,
      secure: true,
      sameSite: 'Strict'
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style>
.custom {
  min-width: calc(100%);
}
.relative-icon {
  position: relative;
  right: 40px;
}
</style>
