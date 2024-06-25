<template>
  <v-container class="py-6">
    <h1 class="text-2xl pb-6 font-bold">Products</h1>
    <v-btn color="primary" @click="dialog = true" class="mb-6">Add New Product/Service</v-btn>

    <v-data-table :headers="headers" :items="products" class="mb-6">
      <template v-slot:item.subscription_price="{ item }">
        <span v-if="item.type === 'subscription_sales'">{{ item.subscription_price }}</span>
      </template>
      <template v-slot:item.subscription_frequency="{ item }">
        <span v-if="item.type === 'subscription_sales'">{{ item.subscription_frequency }}</span>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add New Product/Service</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid" @submit.prevent="submitProduct">
            <v-text-field v-model="newProduct.name" :rules="[rules.required]" label="Product Name" dense></v-text-field>
            <v-textarea v-model="newProduct.description" :rules="[rules.required]" label="Product Description" dense></v-textarea>
            <v-text-field v-model="newProduct.production_cost" :rules="[rules.required]" label="Production Cost" type="number" dense></v-text-field>
            <v-text-field
              v-if="newProduct.type === 'one_time_sales'"
              v-model="newProduct.selling_price"
              :rules="[rules.required]"
              label="Selling Price"
              type="number"
              dense
            ></v-text-field>
            <v-text-field
              v-if="newProduct.type === 'subscription_sales'"
              v-model="newProduct.subscription_price"
              :rules="[rules.required]"
              label="Subscription Price"
              type="number"
              dense
            ></v-text-field>
            <v-select
              v-if="newProduct.type === 'subscription_sales'"
              v-model="newProduct.subscription_frequency"
              :rules="[rules.required]"
              :items="subscriptionFrequencies"
              label="Subscription Frequency"
              dense
            ></v-select>
            <v-select v-model="newProduct.type" :rules="[rules.required]" :items="productTypes" label="Product Type" dense></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitProduct">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { VContainer, VBtn, VDataTable, VDialog, VCard, VCardTitle, VCardText, VCardActions, VTextField, VTextarea, VForm, VSelect, VSpacer } from 'vuetify/components'

const dialog = ref(false)
const isFormValid = ref(false)
const newProduct = ref({
  name: '',
  description: '',
  production_cost: null,
  selling_price: null,
  subscription_price: null,
  subscription_frequency: null,
  type: 'one_time_sales'
})
const products = ref([
  {
    id: 'PS1',
    type: 'one_time_sales',
    name: 'Smartphone Case',
    description: 'Durable and stylish smartphone cases.',
    production_cost: 5,
    selling_price: 10,
    subscription_frequency: null
  },
  {
    id: 'PS2',
    type: 'one_time_sales',
    name: 'Wireless Charger',
    description: 'Fast and efficient wireless chargers.',
    production_cost: 15,
    selling_price: 20,
    subscription_frequency: null
  },
  {
    id: 'PS3',
    type: 'subscription_sales',
    name: 'Software Licenses',
    description: 'Comprehensive software licenses.',
    production_cost: 500,
    subscription_price: 1000,
    subscription_frequency: 'biweekly'
  }
])

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Description', value: 'description' },
  { text: 'Production Cost', value: 'production_cost' },
  { text: 'Selling Price', value: 'selling_price' },
  { text: 'Subscription Price', value: 'subscription_price' },
  { text: 'Subscription Frequency', value: 'subscription_frequency' },
  { text: 'Type', value: 'type' }
]

const productTypes = ['one_time_sales', 'subscription_sales']
const subscriptionFrequencies = ['daily', 'weekly', 'monthly', 'annually']

const rules = {
  required: value => !!value || 'Required.'
}

const submitProduct = () => {
  if (!isFormValid.value) {
    console.error('Validation failed. Please check the form fields.')
    return
  }
  products.value.push({ ...newProduct.value, id: `PS${products.value.length + 1}` })
  dialog.value = false
  newProduct.value = {
    name: '',
    description: '',
    production_cost: null,
    selling_price: null,
    subscription_price: null,
    subscription_frequency: null,
    type: 'one_time_sales'
  }
}
</script>

<style scoped></style>
