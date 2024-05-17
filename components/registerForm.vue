<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-100 relative"
  >
    <div
      class="w-full max-w-md px-10 py-8 space-y-6 bg-white shadow-lg rounded-xl"
    >
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
          <a href="/" class="font-medium text-blue-600 hover:underline"
            >Log In</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from '#imports' // Correct import for Nuxt 3
import { addError } from '../stores/errorsStore' // Update the path as necessary
import mittBus from '../utils/mitt.js'

const router = useRouter()

const userInfo = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegistration = async () => {
  mittBus.emit('loader-on')
  try {
    // Define the API endpoint
    const url = 'https://next-backend-six.vercel.app/api/register'
    const payload = {
      email: userInfo.value.email,
      password: userInfo.value.password
    }

    // Send email and password for registration using Axios
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
        let errorMessage = 'Registration failed. Please try again.'

        // Check if data.message is an array and contains error messages
        if (Array.isArray(data.message)) {
          errorMessage = data.message.map(msg => `${msg.message}`).join(' ')
        }

        addError({
          header: 'Error',
          content: errorMessage,
          btnText: 'Ok'
        })
        console.error('Registration failed:', data.message)
      } else {
        console.log('Registration successful:', data)
        // Redirect to login page upon successful registration
        router.push('/')
      }
    } else if (response.status >= 300) {
      // Handle 3xx, 4xx, and 5xx responses
      const errorMessage = `Registration failed with status code: ${response.status}. ${response.statusText}`
      addError({
        header: 'Error',
        content: errorMessage,
        btnText: 'Ok'
      })
      console.error('Registration failed:', response.data)
    }
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.'

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
  } finally {
    mittBus.emit('loader-off')
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
