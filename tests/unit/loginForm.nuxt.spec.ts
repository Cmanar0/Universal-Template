import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../../components/LoginForm.vue'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('LoginForm', () => {
  it('renders the form correctly', () => {
    console.log('Starting test: renders the form correctly')
    const wrapper = mount(LoginForm)
    expect(wrapper.get('input[placeholder="Email"]')).toBeTruthy()
    expect(wrapper.get('input[placeholder="Password"]')).toBeTruthy()
    expect(wrapper.get('button[type="submit"]')).toBeTruthy()
    console.log('Finished test: renders the form correctly')
  })

  it('initializes with empty fields', () => {
    console.log('Starting test: initializes with empty fields')
    const wrapper = mount(LoginForm)
    const emailInput = wrapper.get('input[placeholder="Email"]')
    const passwordInput = wrapper.get('input[placeholder="Password"]')

    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('')
    console.log('Finished test: initializes with empty fields')
  })

  it('toggles password visibility', async () => {
    console.log('Starting test: toggles password visibility')
    const wrapper = mount(LoginForm)
    const passwordInput = wrapper.get('input[placeholder="Password"]')

    // Check initial state
    expect(passwordInput.attributes('type')).toBe('password')
    console.log('Initial state: password field type is password')

    // Toggle visibility to 'text'
    const showPasswordButton = wrapper.get('#hide-password-icon')
    await showPasswordButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
    console.log('After first toggle: password field type is text')

    // Toggle visibility back to 'password'
    const hidePasswordButton = wrapper.get('#show-password-icon')
    await hidePasswordButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
    console.log('After second toggle: password field type is password')
    console.log('Finished test: toggles password visibility')
  })

  it('submits the form and calls API', async () => {
    console.log('Starting test: submits the form and calls API')
    const wrapper = mount(LoginForm)
    const emailInput = wrapper.get('input[placeholder="Email"]')
    const passwordInput = wrapper.get('input[placeholder="Password"]')
    const submitButton = wrapper.get('button[type="submit"]')

    // Mock API response
    const mockResponse = { data: { jwt: 'fake-jwt', status: 200 } }
    axios.post.mockResolvedValueOnce(mockResponse)

    // Fill in the form
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    // Submit the form
    await submitButton.trigger('submit.prevent')

    // Verify the API call
    expect(axios.post).toHaveBeenCalledWith(
      'https://next-backend-six.vercel.app/api/auth',
      {
        email: 'test@example.com',
        password: 'password123'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(
      'API called with email: test@example.com and password: password123'
    )
    console.log('Finished test: submits the form and calls API')
  })

  it('handles API error correctly', async () => {
    console.log('Starting test: handles API error correctly')
    const wrapper = mount(LoginForm)
    const emailInput = wrapper.get('input[placeholder="Email"]')
    const passwordInput = wrapper.get('input[placeholder="Password"]')
    const submitButton = wrapper.get('button[type="submit"]')

    // Mock API error response
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Invalid credentials' }
      }
    }
    axios.post.mockRejectedValueOnce(mockError)

    // Fill in the form
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrongpassword')

    // Submit the form
    await submitButton.trigger('submit.prevent')

    // Verify the API call
    expect(axios.post).toHaveBeenCalledWith(
      'https://next-backend-six.vercel.app/api/auth',
      {
        email: 'test@example.com',
        password: 'wrongpassword'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(
      'API called with email: test@example.com and password: wrongpassword'
    )
    console.log('Finished test: handles API error correctly')
  })
})
