<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="w-full max-w-md px-10 py-8 space-y-6 bg-white shadow-lg rounded-xl"
    >
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
            <span
              class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              @click="toggleShowPassword"
            >
              <img
                class="icon-eye w-5 h-5"
                v-if="showPassword"
                src="../assets/svg/eye.svg"
                alt="Show Password"
              />
              <img
                class="icon-eye w-5 h-5"
                v-else
                src="../assets/svg/crossed_eye.svg"
                alt="Hide Password"
              />
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center">
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
          class="w-full p-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transition duration-200"
        >
          Submit
        </button>
      </form>
      <div class="text-center">
        <p class="text-sm">
          Don't have an account?
          <a href="/register" class="font-medium text-blue-600 hover:underline"
            >Sign Up</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useRouter } from '#imports' // Correct import for Nuxt 3
import { addError } from '../stores/errorsStore' // Update the path as necessary

const router = useRouter()

const userInfo = ref({
  email: '',
  password: ''
})

// const rememberMe = ref(false)
const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}
const handleSubmit = async () => {
  try {
    // Define the API endpoint
    const url = 'https://next-backend-six.vercel.app/api/auth'
    const payload = {
      email: userInfo.value.email,
      password: userInfo.value.password
    }

    // Send email and password for authentication using Axios
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Check the HTTP response status code
    if (response.status >= 200 && response.status < 300) {
      const data = response.data

      // Check if the response data contains an error status
      if (data.status && data.status !== 200) {
        let errorMessage = 'Login failed. Please try again.'

        // Check if data.message is an array and contains error messages
        if (Array.isArray(data.message)) {
          errorMessage = data.message.map(msg => `${msg.message}`).join(' ')
        }

        addError({
          header: 'Error',
          content: errorMessage,
          btnText: 'Ok'
        })
        console.error('Login failed:', data.message)
      } else {
        console.log('Login successful:', data)

        // Store JWT in cookies for future requests
        if (data.jwt) {
          console.log('submit data.jwt :>> ', data.jwt)
          Cookies.set('bv_jwt', data.jwt, {
            expires: 7,
            secure: true,
            sameSite: 'Strict'
          })

          // Redirect to dashboard upon successful login
          router.push('/dashboard')
        } else {
          console.log('JWT not provided in response')
          addError({
            header: 'Error',
            content: 'JWT not provided in response.',
            btnText: 'Ok'
          })
        }
      }
    } else if (response.status >= 300) {
      // Handle 3xx, 4xx, and 5xx responses
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

    // Handle Axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data)
      errorMessage =
        error.response.data && error.response.data.message
          ? Array.isArray(error.response.data.message)
            ? error.response.data.message.map(msg => `${msg.message}`).join(' ')
            : error.response.data.message
          : `Error: ${error.response.status}`
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request)
      errorMessage =
        'No response received from the server. Please check your internet connection.'
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message)
      errorMessage = error.message
    }

    // Add the error to the global store
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })
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
