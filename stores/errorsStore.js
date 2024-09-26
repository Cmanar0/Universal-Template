import { reactive } from 'vue'

const state = reactive({
  errors: []
})

export const addError = error => {
  state.errors.push(error)
}

export const addMessage = error => {
  state.errors.push(error)
}

export const clearErrors = () => {
  state.errors = []
}

export default state
