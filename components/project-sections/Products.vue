<template>
  <div class="tab-card shadow-md mx-1">
    <h1 class="text-2xl pb-6 font-bold">Types of Products</h1>
    <p>
      Please define all types of products and services for your business. We differentiate between subscription based (for example a monthly subscription for a membership) and
      "sales per unit" type of produtcs/services (physical goods for ecomers or stores, meals for restaurants or event packages for agencies etc.).
    </p>
  </div>
  <div class="mt-6">
    <v-card class="p-6 m-1">
      <div class="flex flex-col md:flex-row gap-10 justify-between">
        <span>
          <h1 class="text-2xl pb-6 font-bold">PRODUCTS</h1>
        </span>
        <v-btn color="success" size="large" @click="openDialog" class="mb-6">Add New Product/Service</v-btn>
      </div>
      <v-data-table :headers="headers" :items="products" :loading="loading" class="mb-6">
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:item.subscription_price="{ item }">
          <span v-if="item.type === 'subscription_sales'">{{ item.subscription_price }}</span>
        </template>
        <template v-slot:item.subscription_frequency="{ item }">
          <span v-if="item.type === 'subscription_sales'">{{ item.subscription_frequency }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
          </div>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="refForm" v-model="isFormValid">
              <v-text-field v-model="editedItem.name" :rules="[rules.required]" label="Product Name" color="#1697F6" variant="outlined" dense class="pt-2"></v-text-field>
              <v-textarea v-model="editedItem.description" :rules="[rules.required]" label="Product Description" color="#1697F6" variant="outlined" dense class="pt-2"></v-textarea>

              <v-text-field
                v-if="editedItem.type === 'sales_per_unit'"
                v-model="editedItem.selling_price"
                :rules="[rules.required, rules.numeric]"
                label="Selling Price"
                type="number"
                color="#1697F6"
                variant="outlined"
                dense
                class="pt-2"
              ></v-text-field>
              <v-text-field
                v-if="editedItem.type === 'subscription_sales'"
                v-model="editedItem.subscription_price"
                :rules="[rules.required, rules.numeric]"
                label="Subscription Price"
                type="number"
                color="#1697F6"
                variant="outlined"
                dense
                class="pt-2"
              ></v-text-field>

              <v-select
                v-model="editedItem.type"
                :rules="[rules.required]"
                :items="productTypes"
                label="Product Type"
                color="#1697F6"
                variant="outlined"
                dense
                class="pt-2"
              ></v-select>
              <v-select
                v-if="editedItem.type === 'subscription_sales'"
                v-model="editedItem.subscription_frequency"
                :rules="[rules.required]"
                :items="subscriptionFrequencies"
                label="Subscription Frequency"
                color="#1697F6"
                variant="outlined"
                dense
                class="pt-2"
              ></v-select>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="submitProduct">Save</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { VBtn, VDataTable, VDialog, VCard, VCardTitle, VCardText, VCardActions, VTextField, VTextarea, VForm, VSelect, VSpacer, VIcon, VSkeletonLoader } from 'vuetify/components'

// Refs and initial data setup
const dialog = ref(false)
const dialogDelete = ref(false)
const isFormValid = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: '',
  description: '',
  selling_price: null,
  subscription_price: null,
  subscription_frequency: null,
  type: 'sales_per_unit'
})
const newProduct = ref({
  name: '',
  description: '',
  selling_price: null,
  subscription_price: null,
  subscription_frequency: null,
  type: 'sales_per_unit'
})
const products = ref([])
const refForm = ref(null) // Define the ref for the form

// Headers definition
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Selling Price', key: 'selling_price' },
  { title: 'Subscription Price', key: 'subscription_price' },
  { title: 'Subscription Frequency', key: 'subscription_frequency' },
  { title: 'Type', key: 'type' },
  { text: 'Actions', key: 'actions', sortable: false }
]

// Options for product types and subscription frequencies
const productTypes = ['sales_per_unit', 'subscription_sales']
const subscriptionFrequencies = ['daily', 'weekly', 'monthly', 'annually']

// Form validation rules
const rules = {
  required: value => !!value || 'Required.',
  numeric: value => (!isNaN(parseFloat(value)) && isFinite(value)) || 'Must be a number.'
}

// Computed property for form title
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Add New Product/Service' : 'Edit Product/Service'
})

// Loading state
const loading = ref(false)

// Function to fetch products from API
const fetchProducts = () => {
  loading.value = true
  console.log('Fetching data...')
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 'PS1',
          type: 'sales_per_unit',
          name: 'Smartphone Case',
          description: 'Durable and stylish smartphone cases.',
          selling_price: 10,
          subscription_frequency: null
        },
        {
          id: 'PS2',
          type: 'sales_per_unit',
          name: 'Screen Protector',
          description: 'High-quality screen protectors.',
          selling_price: 7,
          subscription_frequency: null
        }
      ])
    }, 1000)
  }).then(data => {
    console.log('Data fetched:', data)
    products.value = data
    loading.value = false
  })
}

// Function to open the dialog for adding a new product
const openDialog = () => {
  editedIndex.value = -1
  editedItem.value = { ...newProduct.value }
  dialog.value = true
}

// Function to submit a product (create or edit)
const submitProduct = async () => {
  const form = refForm.value
  const valid = await form.validate()
  if (!isFormValid.value) {
    console.error('Validation failed. Please check the form fields.')
    return
  }
  if (valid) {
    if (editedIndex.value > -1) {
      // Edit existing product
      updateProduct(editedItem.value).then(() => {
        Object.assign(products.value[editedIndex.value], editedItem.value)
        close()
      })
    } else {
      // Create new product
      createProduct(editedItem.value).then(newProduct => {
        products.value.push(newProduct)
        close()
      })
    }
  } else {
    console.error('Validation failed. Please check the form fields.')
  }
}

// Function to create a product via API
const createProduct = product => {
  console.log('Creating product...', product)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Product created successfully:', product)
      resolve({ ...product, id: `PS${products.value.length + 1}` })
    }, 500)
  })
}

// Function to update a product via API
const updateProduct = product => {
  loading.value = true

  console.log('Updating product...', product)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Product updated successfully:', product)
      resolve(product)
    }, 500)
  }).then(updatedProduct => {
    loading.value = false
  })
}

// Function to delete a product via API
const deleteProduct = productId => {
  console.log('Deleting product...', productId)
  // Simulate API call with promise
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Product deleted successfully:', productId)
      resolve(true)
    }, 500)
  })
}

// Function to handle item edit
const editItem = item => {
  editedIndex.value = products.value.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

// Function to handle item delete
const deleteItem = item => {
  editedIndex.value = products.value.indexOf(item)
  editedItem.value = { ...item }
  dialogDelete.value = true
}

// Function to confirm item delete
const deleteItemConfirm = () => {
  deleteProduct(editedItem.value.id).then(() => {
    products.value.splice(editedIndex.value, 1)
    closeDelete()
  })
}

// Function to close the dialog
const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = { ...newProduct.value }
    editedIndex.value = -1
  })
}

// Function to close the delete dialog
const closeDelete = () => {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = { ...newProduct.value }
    editedIndex.value = -1
  })
}

// Fetch products on component mount
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
#products {
  font-weight: bold !important;
}
</style>
