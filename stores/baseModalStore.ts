// stores/baseModal.ts
import { defineStore } from 'pinia'

export const useBaseModalStore = defineStore({
  id: 'baseModal',
  state: () => ({
    // Initial state
    modalSettings: {
      action: '',
      title: 'Add New User',
      content: 'This is the content of the modal',
      leftBtn: {
        text: 'Cancel',
        action: null
      },
      rightBtn: {
        text: 'Save',
        action: null
      }
    },
    isModalOpen: false
  }),
  actions: {
    setModalSettings({
      action,
      title,
      content,
      leftBtnText,
      leftBtnAction,
      rightBtnText,
      rightBtnAction
    }: {
      action?: string
      title?: string
      content?: string
      leftBtnText: string
      leftBtnAction: any
      rightBtnText: string
      rightBtnAction: any
    }) {
      this.modalSettings.action = action ?? this.modalSettings.action
      this.modalSettings.title = title ?? this.modalSettings.title
      this.modalSettings.content = content ?? this.modalSettings.content
      this.modalSettings.leftBtn.text = leftBtnText
      this.modalSettings.leftBtn.action = leftBtnAction
      this.modalSettings.rightBtn.text = rightBtnText
      this.modalSettings.rightBtn.action = rightBtnAction
    },
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    leftBtnAction() {
      if (typeof this.modalSettings.leftBtn.action === 'function') {
        ;(this.modalSettings.leftBtn.action as Function)()
      }
    },
    rightBtnAction() {
      if (typeof this.modalSettings.rightBtn.action === 'function') {
        ;(this.modalSettings.rightBtn.action as Function)()
      }
    }
  },
  getters: {
    getModalSettings(): any {
      return this.modalSettings
    }
  }
})
