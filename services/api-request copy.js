import axios from 'axios'
import Cookies from 'js-cookie'
import { addError } from '../stores/errorsStore'
import mittBus from '../utils/mitt.js'

// Get the base URL from the environment variables
const BASE_API_URL = import.meta.env.NUXT_PUBLIC_BASE_API_URL
// Create an Axios instance
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Setup interceptors to add the Authorization header from cookies
api.interceptors.request.use(
  config => {
    const token = Cookies.get('bv_jwt')
    if (token) {
      config.headers['x-auth-token'] = token
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => {
    // Check for backend-specific validation errors even with status code 200
    if (response.data.errors) {
      const validationErrors = response.data.errors.map(error => error.message).join(', ')
      addError({
        header: 'Validation Error',
        content: validationErrors,
        btnText: 'Ok'
      })
      return Promise.reject(new Error(validationErrors))
    }
    return response
  },
  error => {
    mittBus.emit('loader-off')
    let errorMessage = 'An unknown error occurred. Please try again.'

    console.log('error.request :>> ', error.request)
    console.log('error :>> ', error)
    console.log('error.response :>> ', error.response)
    console.log('error.message :>> ', error.message)
    console.log('error.response.status :>> ', error.response.status)
    console.log('error.response.data :>> ', error.response.data)

    if (error.response) {
      const { status, data } = error.response
      console.log('Error response data:', data)
      if (status >= 300 && status < 400) {
        errorMessage = 'Redirection error. Please try again.'
      } else if (status >= 400 && status < 500) {
        errorMessage = data.message || 'Client error. Please check your request and try again.'
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else {
        errorMessage = `Unexpected status code: ${status}`
      }
    } else if (error.request) {
      errorMessage = 'No response received from the server. Please check your internet connection.'
      console.log('No response received:', error.request)
    } else {
      errorMessage = error.message
      console.log('Error message:', error.message)
    }

    console.error('API request failed:', errorMessage)
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    return Promise.reject(error) // Ensure the error is returned to the calling function
  }
)

async function processRequest(method, url, data = {}, params = {}, headers = {}) {
  try {
    let response
    const config = {
      url,
      method,
      data,
      params,
      headers
    }

    mittBus.emit('loader-on')

    switch (method) {
      case 'get':
        response = await api.get(url, { params, headers })
        break
      case 'post':
        response = await api.post(url, data, { params, headers })
        break
      case 'patch':
        response = await api.patch(url, data, { params, headers })
        break
      case 'delete':
        response = await api.delete(url, { params, headers })
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }

    mittBus.emit('loader-off')

    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers
    }
  } catch (error) {
    mittBus.emit('loader-off')
    let errorMessage = 'An error occurred while processing the request.'

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage
    }

    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    return Promise.reject({
      success: false,
      status: error.response ? error.response.status : 500,
      message: errorMessage,
      data: error.response ? error.response.data : {}
    })
  }
}

export const apiService = {
  async make(method, url, data = {}, params = {}, headers = {}) {
    return await processRequest(method, url, data, params, headers)
  },

  async get(url, params = {}, headers = {}) {
    return this.make('get', url, {}, params, headers)
  },

  async post(url, data, params = {}, headers = {}) {
    return this.make('post', url, data, params, headers)
  },

  async patch(url, data, params = {}, headers = {}) {
    return this.make('patch', url, data, params, headers)
  },

  async delete(url, params = {}, headers = {}) {
    return this.make('delete', url, {}, params, headers)
  }
}

export default apiService
