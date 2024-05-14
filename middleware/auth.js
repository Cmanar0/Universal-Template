import { defineNuxtRouteMiddleware, useCookie, useNuxtApp } from '#app'
import Cookies from 'js-cookie'
import apiService from '../services/api-request' // Update the path as necessary

export default defineNuxtRouteMiddleware(async (to, from, next) => {
  console.log('Middleware is running')

  const app = useNuxtApp()
  let token
  if (process.server) {
    const cookie = useCookie('bv_jwt')
    token = cookie.value
  } else {
    token = Cookies.get('bv_jwt')
  }

  if (!token) {
    console.log('No token found, redirecting to login...')
    return navigateTo('/')
  }

  const { exp, iat } = getJwtClaims(token)
  if (!exp || !iat) {
    console.log('Failed to decode token, redirecting to login...')
    return navigateTo('/')
  }

  const currentTime = Date.now() / 1000
  if (exp < currentTime) {
    console.log('Token expired, redirecting to login...')
    return navigateTo('/')
  }

  if (currentTime - iat > 7200) {
    // Token is older than 2 hours
    console.log('Token is older than 2 hours, renewing token...')
    try {
      await renewToken(token, app)
    } catch (error) {
      console.error('Error renewing the token:', error)
      return navigateTo('/') // Fail safely by redirecting to login
    }
  }
})

function getJwtClaims(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = atob(base64)
    const decoded = JSON.parse(payload)
    console.log('Decoded JWT:', decoded)
    return decoded // Return all claims to check iat and exp
  } catch (e) {
    console.error('Error decoding JWT:', e)
    return {}
  }
}

async function renewToken(token, app) {
  const config = app.$config
  const baseUrl = config.public.baseApiUrl // Accessing the base URL from the environment variable

  try {
    const response = await apiService.post(
      `/refresh-token`, // Using the base URL from the config
      {},
      {
        headers: {
          'x-auth-token': token
        }
      }
    )
    console.log('response :>> ', response)

    // Assuming the new token is returned directly in the response body under 'jwt'
    if (process.server) {
      useCookie('bv_jwt').value = response.jwt // Update cookie on the server
    } else {
      Cookies.set('bv_jwt', response.jwt, {
        expires: 1, // Example: 1 day until expiration
        secure: true,
        sameSite: 'Strict'
      }) // Update cookie on the client
    }
    console.log('Token successfully renewed')
  } catch (error) {
    console.error('Error renewing the token:', error)
    // Optionally, redirect or handle the error as required
  }
}
