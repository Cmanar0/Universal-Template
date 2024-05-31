<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 overflow-y-auto flex items-center justify-center z-50"
  >
    <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
    <div
      ref="modalContent"
      class="relative bg-white rounded-lg shadow-lg w-96 p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ header }}</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <div>
        <p>{{ content }}</p>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          @click="confirmAction"
          :class="`px-4 py-2 ${btnColor} text-white rounded-md hover:bg-opacity-75 focus:outline-none`"
        >
          {{ btnText }}
        </button>
        <button
          @click="closeModal"
          class="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  header: String,
  content: String,
  btnText: String,
  btnColor: String
})

const emits = defineEmits(['confirm', 'close'])

const isVisible = ref(true)

const closeModal = () => {
  isVisible.value = false
  emits('close')
}

const confirmAction = () => {
  emits('confirm')
  closeModal()
}
</script>

<style scoped>
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.overflow-y-auto {
  overflow-y: auto;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.z-50 {
  z-index: 50;
}

.bg-black {
  background-color: black;
}

.opacity-50 {
  opacity: 0.5;
}

.relative {
  position: relative;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-96 {
  width: 24rem;
}

.p-6 {
  padding: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-500 {
  color: #6b7280;
}

.hover\:text-gray-700:hover {
  color: #374151;
}

.focus\:outline-none:focus {
  outline: none;
}

.h-5 {
  height: 1.25rem;
}

.w-5 {
  width: 1.25rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-white {
  color: white;
}

.rounded-md {
  border-radius: 0.375rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.bg-gray-500 {
  background-color: #6b7280;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-green-500 {
  background-color: #10b981;
}

.hover\:bg-gray-600:hover {
  background-color: #4b5563;
}
</style>
