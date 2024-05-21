import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../../components/LoginForm.vue'

describe('LoginForm', () => {
  it('renders the form correctly', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.get('input[placeholder="Email"]')).toBeTruthy()
    expect(wrapper.get('input[placeholder="Password"]')).toBeTruthy()
    expect(wrapper.get('button[type="submit"]')).toBeTruthy()
  })
})
