import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../../components/LoginForm.vue'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('LoginForm', () => {
  it('renders the form correctly', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.get('input[placeholder="Email"]')).toBeTruthy()
    expect(wrapper.get('input[placeholder="Password"]')).toBeTruthy()
    expect(wrapper.get('button[type="submit"]')).toBeTruthy()
  })

  it('initializes with empty fields', () => {
    const wrapper = mount(LoginForm)
    const emailInput = wrapper.get('input[placeholder="Email"]')
    const passwordInput = wrapper.get('input[placeholder="Password"]')

    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('')
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(LoginForm)
    const passwordInput = wrapper.get('input[placeholder="Password"]')

    // Check initial state
    expect(passwordInput.attributes('type')).toBe('password')

    // Toggle visibility to 'text'
    const showPasswordButton = wrapper.get('#hide-password-icon')
    await showPasswordButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')

    // Toggle visibility back to 'password'
    const hidePasswordButton = wrapper.get('#show-password-icon')
    await hidePasswordButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('submits the form and calls API', async () => {
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
  })

  it('handles API error correctly', async () => {
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
  })
})
