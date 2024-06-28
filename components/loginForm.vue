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
              <img class="icon-eye w-5 h-5" v-if="showPassword" src="../assets/svg/eye.svg" alt="Show Password" data-testid="show-password-icon" id="show-password-icon" />
              <img class="icon-eye w-5 h-5" v-else src="../assets/svg/crossed_eye.svg" alt="Hide Password" data-testid="hide-password-icon" id="hide-password-icon" />
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
import { ref } from 'vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import { addError } from '../stores/errorsStore' // Update the path as necessary
import mittBus from '../utils/mitt.js'

const userInfo = ref({
  email: '',
  password: ''
})

function getJwtClaims(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = atob(base64)
    const decoded = JSON.parse(payload)
    return decoded // Return all claims to check iat and exp
  } catch (e) {
    console.error('Error decoding JWT:', e)
    return {}
  }
}

// const rememberMe = ref(false)
const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  mittBus.emit('loader-on')

  try {
    const url = 'https://next-backend-six.vercel.app/api/auth'
    const payload = {
      email: userInfo.value.email,
      password: userInfo.value.password
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      const data = response.data
      console.log('response :>> ', response)

      if (data.message === 'User authenticated' && data.data) {
        const jwt = data.data.jwt

        if (jwt) {
          console.log('submit data.jwt :>> ', jwt)
          Cookies.set('bv_jwt', jwt, {
            expires: 7,
            secure: true,
            sameSite: 'Strict'
          })

          const decodedToken = getJwtClaims(jwt)
          localStorage.setItem('bv_user', JSON.stringify(decodedToken))

          await navigateTo('/dashboard')
        } else {
          console.log('JWT not provided in response')
          addError({
            header: 'Error',
            content: 'JWT not provided in response.',
            btnText: 'Ok'
          })
        }
      } else {
        addError({
          header: 'Error',
          content: 'Unexpected response format.',
          btnText: 'Ok'
        })
        console.error('Unexpected response format:', data)
      }
    } else {
      const errorMessage = `Login failed with status code: ${response.status}. ${response.statusText}`
      addError({
        header: 'Error',
        content: errorMessage,
        btnText: 'Ok'
      })
      console.error('Login failed:', response.data)
    }
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.'

    if (error.response) {
      console.error('Error response:', error.response.data)

      errorMessage = error.response.data.errors ? error.response.data.errors.map(err => err.message).join(' ') : `Error: ${error.response.status}`
    } else if (error.request) {
      console.error('Error request:', error.request)
      errorMessage = 'No response received from the server. Please check your internet connection.'
    } else {
      console.error('Error message:', error.message)
      errorMessage = error.message
    }

    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })
  } finally {
    mittBus.emit('loader-off')
  }
}

const navigateTo = (url: string) => {
  window.location.href = url
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
