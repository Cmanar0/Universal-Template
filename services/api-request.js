// api-request.js
import axios from 'axios'
import Cookies from 'js-cookie'
import { addError } from '../stores/errorsStore' // Update the path as necessary

// Create an Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

// Setup interceptors to add the Authorization header from cookies
api.interceptors.request.use(
  config => {
    const token = Cookies.get('bv_jwt')
    if (token) {
      config.headers['x-auth-token'] = token // Assuming the token should be sent as 'x-auth-token'
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'An unknown error occurred. Please try again.'

    if (error.response) {
      // Server responded with a status code out of the range of 2xx
      const { status, data } = error.response
      if (status >= 300 && status < 400) {
        errorMessage = 'Redirection error. Please try again.'
      } else if (status >= 400 && status < 500) {
        errorMessage =
          data.message ||
          'Client error. Please check your request and try again.'
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else {
        errorMessage = `Unexpected status code: ${status}`
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage =
        'No response received from the server. Please check your internet connection.'
    } else {
      // Something happened in setting up the request
      errorMessage = error.message
    }

    // Log the error
    console.error('API request failed:', errorMessage)

    // Add the error to the global store
    addError({
      header: 'Error',
      content: errorMessage,
      btnText: 'Ok'
    })

    // Throw the error to propagate it to the calling function
    throw error
  }
)

// API functions
export const apiService = {
  async request(
    method,
    url,
    data = {},
    params = {},
    headers = {},
    baseURL = ''
  ) {
    try {
      const response = await api({
        method,
        url,
        data,
        params,
        headers,
        baseURL
      })
      return response.data
    } catch (error) {
      throw error // This will be caught by the calling function
    }
  },

  async get(url, params = {}, headers = {}, baseURL = '') {
    return this.request('get', url, {}, params, headers, baseURL)
  },

  async post(url, data, params = {}, headers = {}, baseURL = '') {
    return this.request('post', url, data, params, headers, baseURL)
  },

  async patch(url, data, params = {}, headers = {}, baseURL = '') {
    return this.request('patch', url, data, params, headers, baseURL)
  },

  async delete(url, params = {}, headers = {}, baseURL = '') {
    return this.request('delete', url, {}, params, headers, baseURL)
  }
}

export default apiService
