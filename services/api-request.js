import axios from 'axios'
import Cookies from 'js-cookie'
import { addError } from '../stores/errorsStore'
import mittBus from '../utils/mitt.js'

// Get the base URL from the environment variables
const BASE_API_URL = import.meta.env.BASE_API_URL || 'https://next-backend-six.vercel.app'
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
  response => response,
  error => {
    mittBus.emit('loader-off')
    let errorMessage = 'An unknown error occurred. Please try again.'

    if (error.response) {
      const { status, data } = error.response
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
    } else {
      errorMessage = error.message
    }

    console.error('API request failed:', errorMessage)
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    throw error
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

    if (error.response && error.response.status === 401) {
      return {
        success: false,
        status: 401,
        message: 'Unauthorized access. Redirecting to login.',
        data: []
      }
    }

    if (error.response && error.response.status >= 500) {
      return {
        success: false,
        status: error.response.status,
        message: 'Server error. Please try again later.',
        data: []
      }
    }

    return {
      success: false,
      status: error.response ? error.response.status : 500,
      message: errorMessage,
      data: []
    }
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
