<template>
  <div v-if="notifications.length" class="fixed top-4 right-4 z-50">
    <transition-group
      name="notification"
      tag="div"
      class="flex flex-col space-y-4"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification p-4 rounded-lg shadow-md flex items-center justify-between',
          `bg-${notification.color}-100`
        ]"
      >
        <div>
          <h3 :class="`text-lg font-bold text-${notification.color}-700 mb-2`">
            {{ notification.title }}
          </h3>
          <p :class="`text-${notification.color}-600`">
            {{ notification.message }}
          </p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          :class="`text-${notification.color}-700`"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6.293 5.293a1 1 0 011.414 0L10 7.586l2.293-2.293a1 1 0 011.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414 1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import state, { removeNotification } from '@/stores/notificationStore'

const notifications = computed(() => state.notifications.value)
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.2s;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
