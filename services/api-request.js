// api-request.js
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRuntimeConfig } from '#imports'

// Create an Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

// Setup interceptors
api.interceptors.request.use(
  config => {
    const {
      public: { baseApiUrl }
    } = useRuntimeConfig()
    config.baseURL = baseApiUrl
    const token = Cookies.get('bv_jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API request failed:', error)
    throw error // Propagate error
  }
)

// API functions
export const apiService = {
  async request(method, url, data = {}, params = {}) {
    try {
      const response = await api({
        method,
        url,
        data,
        params
      })
      return response.data
    } catch (error) {
      throw error // This will be caught by the calling function
    }
  },

  async get(url, params = {}) {
    return this.request('get', url, {}, params)
  },

  async post(url, data, params = {}) {
    return this.request('post', url, data, params)
  },

  async patch(url, data, params = {}) {
    return this.request('patch', url, data, params)
  },

  async delete(url, params = {}) {
    return this.request('delete', url, {}, params)
  }
}

export default apiService
