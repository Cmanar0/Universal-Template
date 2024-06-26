<template>
  <v-container>
    <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
      <v-text-field v-model="textField" :rules="[rules.required]" label="Text Field" color="#1697F6" variant="outlined" dense class="mb-4"></v-text-field>

      <v-select v-model="firstSelect" :rules="[rules.required]" :items="firstSelectItems" label="First Select" color="#1697F6" variant="outlined" dense class="mb-4"></v-select>

      <v-select
        v-if="firstSelect === 'option2'"
        v-model="secondSelect"
        :rules="[rules.required]"
        :items="secondSelectItems"
        label="Second Select"
        color="#1697F6"
        variant="outlined"
        dense
        class="mb-4"
      ></v-select>

      <v-btn type="submit" color="success" size="large">Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { VContainer, VForm, VTextField, VSelect, VBtn } from 'vuetify/components'

// Define reactive variables
const textField = ref('')
const firstSelect = ref('')
const secondSelect = ref('')
const isFormValid = ref(false)

// Define select items
const firstSelectItems = ['option1', 'option2']
const secondSelectItems = ['secondOption1', 'secondOption2']

// Define validation rules
const rules = {
  required: value => !!value || 'Required.'
}

// Form submission handler
const submitForm = () => {
  if (!isFormValid.value) {
    console.error('Validation failed. Please check the form fields.')
    return
  }

  const formData = {
    textField: textField.value,
    firstSelect: firstSelect.value,
    secondSelect: firstSelect.value === 'option2' ? secondSelect.value : null
  }

  console.log('Form Data:', formData)
  // Perform API call or further processing with formData
}
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
