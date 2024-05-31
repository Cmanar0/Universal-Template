// src/stores/notificationStore.js
import { ref } from 'vue'

const state = {
  notifications: ref([])
}

export const addNotification = notification => {
  const id = Date.now()
  state.notifications.value.push({ id, ...notification })
  setTimeout(() => removeNotification(id), 5000) // Auto-remove after 5 seconds
}

export const removeNotification = id => {
  state.notifications.value = state.notifications.value.filter(
    notification => notification.id !== id
  )
}

export default state
