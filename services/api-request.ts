import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { addError } from '../stores/errorsStore.js'
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
    // Check if the request requires authentication (default is true)
    const requiresAuth = config.headers?.requiresAuth !== false

    if (requiresAuth) {
      const token = Cookies.get('bv_jwt')
      if (token) {
        config.headers['x-auth-token'] = token
      }
    }

    // Remove the custom requiresAuth header to avoid sending it in the request
    delete config.headers?.requiresAuth
    return config
  },
  (error: unknown) => Promise.reject(error) // Explicitly type 'error' as 'unknown'
)

api.interceptors.response.use(
  response => {
    // Check for non-200 status in the response data
    if ((response.status === 200 || response.status === 201) && response.data.status && response.data.status !== 200) {
      let errorMessages = response.data.message
      if (Array.isArray(errorMessages)) {
        errorMessages = errorMessages.map((error: any) => error.message).join(' ')
      }
      return Promise.reject({
        response: {
          status: response.data.status,
          data: {
            message: errorMessages
          }
        }
      })
    }
    return response
  },
  (error: unknown) => {
    mittBus.emit('loader-off')
    let errorMessage = 'An unknown error occurred. Please try again.'

    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response ?? {}
      if (status) {
        if (status >= 300 && status < 400) {
          errorMessage = 'Redirection error. Please try again.'
        } else if (status >= 400 && status < 500) {
          errorMessage = data?.errors ? data.errors.map((err: any) => err.message).join(' ') : 'Client error. Please check your request and try again.'
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = `Unexpected status code: ${status}`
        }
      } else if (error.request) {
        errorMessage = 'No response received from the server. Please check your internet connection.'
      }
    } else if (error instanceof Error) {
      // If the error is a standard JavaScript Error
      errorMessage = error.message
    }

    console.error('API request failed:', errorMessage)
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    return Promise.reject(error) // Re-throw the error after handling
  }
)

async function processRequest<T>(method: AxiosRequestConfig['method'], url: string, data = {}, params = {}, headers = {}): Promise<AxiosResponse<T>> {
  try {
    let response: AxiosResponse<T>
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers
    }

    mittBus.emit('loader-on')

    switch (method) {
      case 'get':
        response = await api.get<T>(url, { params, headers })
        break
      case 'post':
        response = await api.post<T>(url, data, { params, headers })
        break
      case 'patch':
        response = await api.patch<T>(url, data, { params, headers })
        break
      case 'delete':
        response = await api.delete<T>(url, { params, headers })
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }

    mittBus.emit('loader-off')

    return response
  } catch (error: unknown) {
    mittBus.emit('loader-off')
    let errorMessage = 'An error occurred while processing the request.'
    let status = 500

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage
        status = error.response.status
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    console.error('API request failed:', errorMessage)
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    // Return a structured error response
    return Promise.reject({
      success: false,
      status: status,
      message: errorMessage,
      data: []
    })
  }
}

export const apiService = {
  async make<T>(method: AxiosRequestConfig['method'], url: string, data = {}, params = {}, headers = {}) {
    return await processRequest<T>(method, url, data, params, headers)
  },

  async get<T>(url: string, params = {}, headers = {}) {
    return this.make<T>('get', url, {}, params, headers)
  },

  async post<T>(url: string, data: object, params = {}, headers = {}) {
    return this.make<T>('post', url, data, params, headers)
  },

  async patch<T>(url: string, data: object, params = {}, headers = {}) {
    return this.make<T>('patch', url, data, params, headers)
  },

  async delete<T>(url: string, params = {}, headers = {}) {
    return this.make<T>('delete', url, {}, params, headers)
  }
}

export default apiService
