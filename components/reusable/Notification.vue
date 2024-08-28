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
        class="notification p-4 rounded-lg shadow-md flex items-start gap-10 justify-between"
        :style="{ backgroundColor: notification.background }"
      >
        <div>
          <h3
            class="text-lg font-bold mb-2"
            :style="{ color: getTextColorForBackground(notification.background) }"
          >
            {{ notification.title }}
          </h3>
          <p :style="{ color: getTextColorForBackground(notification.background) }">
            {{ notification.message }}
          </p>
        </div>
          <button class="h-full"
            @click="removeNotification(notification.id)"
            :style="{ color: getTextColorForBackground(notification.background) }"
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
import { computed } from 'vue';
import state, { removeNotification } from '@/stores/notificationStore';

const notifications = computed(() => state.notifications.value);

// Utility function to determine text color based on background luminance
function getTextColorForBackground(backgroundColor) {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
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
