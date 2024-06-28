<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit User</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateUser">
          <v-text-field label="First Name" v-model="form.firstName"></v-text-field>
          <v-text-field label="Last Name" v-model="form.lastName"></v-text-field>
          <v-text-field label="Email" v-model="form.email" required type="email"></v-text-field>
          <v-text-field label="Password" v-model="form.password" type="password"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="closeModal">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="updateUser">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue'
import apiService from '../services/api-request' // Update the path as necessary

const props = defineProps({
  user: Object
})

const emits = defineEmits(['close', 'update'])

const dialog = ref(false)
const initialForm = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const form = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

watch(
  () => props.user,
  newUser => {
    if (newUser) {
      Object.assign(initialForm, newUser)
      Object.assign(form, newUser)
      form.password = ''
      dialog.value = true
    }
  },
  { immediate: true }
)

const closeModal = () => {
  dialog.value = false
  emits('close')
}

const updateUser = async () => {
  const updatedFields = Object.keys(form).reduce((acc, key) => {
    if (form[key] !== initialForm[key] && form[key] !== '') {
      acc[key] = form[key]
    }
    return acc
  }, {})
  console.log('props.user.id :>> ', props.user.id)
  try {
    await apiService.patch(`/api/users/${props.user.id}`, updatedFields)
    emits('update', updatedFields)
    closeModal()
  } catch (error) {
    console.error('Failed to update user:', error)
    addNotification({
      type: 'error',
      message: 'Failed to update user. Please try again.'
    })
  }
}
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}
.icon {
  width: 20px;
  height: 20px;
}
</style>
