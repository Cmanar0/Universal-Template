<template>
  <div>
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      @click.self="closeModal"
    >
      <!-- Modal content -->
      <div
        class="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-auto"
        @click.stop
      >
        <!-- Modal header slot -->
        <div class="modal-header flex justify-between items-start mb-4">
          <div class="flex-column">
            <slot name="header">
              <!-- Fallback content -->
              <h2 class="text-xl font-semibold">{{ modalSettings.title }}</h2>
            </slot>
            <div class="mt-5"></div>
          </div>
          <!-- Fallback content -->
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <span class="sr-only">Close</span>
            <CloseIcon />
          </button>
        </div>

        <!-- Modal body slot -->
        <div class="modal-body">
          <slot>
            <!-- Fallback content if no slot is provided -->
            {{ modalSettings.content }}
          </slot>
        </div>
        <!-- Modal footer slot -->
        <div class="modal-footer flex justify-end mt-4">
          <slot name="footer">
            <div class="mt-6">
              <!-- Fallback buttons if no footer slot is provided -->
              <button
                @click="modalSettings.leftBtn.action"
                class="text-gray-400 hover:text-gray-600"
              >
                {{ modalSettings.leftBtn.text }}
              </button>
              <button
                :class="{ disabled: !props.isFormValid }"
                :disabled="!props.isFormValid"
                @click="modalSettings.rightBtn.action"
                class="text-blue-500 hover:text-blue-700 ml-4"
              >
                {{ modalSettings.rightBtn.text }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseIcon from '../../assets/svg/close.vue'
import { useBaseModalStore } from '@/stores/baseModalStore'
import { defineProps } from 'vue'

const baseModal = useBaseModalStore()
const { modalSettings, isModalOpen } = storeToRefs(baseModal)
const { closeModal } = baseModal

const props = defineProps({
  isFormValid: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>

<style>
.disabled {
  cursor: not-allowed !important;
  opacity: 0.5 !important;
}
</style>
