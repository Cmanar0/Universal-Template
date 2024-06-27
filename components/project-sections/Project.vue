<template>
  <div class="tab-card shadow-md mx-1">
    <h1 class="text-2xl pb-6 font-bold">DESCRIPTION</h1>
  </div>
  <div class="mt-6">
    <v-card class="p-6 m-1">
      <v-form ref="form" v-model="isFormValid" @submit.prevent="submitTask">
        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="businessName" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Business Name</label>
          <v-text-field
            v-model="businessName"
            :rules="[rules.required]"
            label="Enter Business Name.."
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-text-field>
        </div>

        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="businessDescription" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Business Description</label>
          <v-textarea
            v-model="businessDescription"
            :rules="[rules.required]"
            label="Enter Business Description.."
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-textarea>
        </div>

        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="businessType" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Business Type</label>
          <v-select
            v-model="businessType"
            :rules="[rules.required]"
            :items="['B2B', 'B2C']"
            label="Select Business Type"
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-select>
        </div>

        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="targetAudience" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Target Audience</label>
          <v-text-field
            v-model="targetAudience"
            :rules="[rules.required]"
            label="Enter Target Audience.."
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-text-field>
        </div>

        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="targetLocation" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Target Location</label>
          <v-select
            v-model="targetLocation"
            :items="['Global', 'International', 'National', 'Local']"
            label="Select Target Location"
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
            @change="handleTargetLocationChange"
          ></v-select>
        </div>

        <div v-if="targetLocation === 'International'" class="mb-4 flex flex-col md:flex-row items-center">
          <label for="countries" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Countries</label>
          <v-select
            v-model="selectedCountries"
            :rules="[rules.required, rules.international]"
            :items="countryList"
            label="Select Countries"
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
            multiple
            persistent-hint
          ></v-select>
        </div>

        <div v-if="targetLocation === 'National'" class="mb-4 flex flex-col md:flex-row items-center">
          <label for="country" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">Country</label>
          <v-select
            v-model="selectedCountries"
            :rules="[rules.required, rules.national]"
            :items="countryList"
            label="Select Country"
            color="#1697F6"
            variant="outlined"
            @update:modelValue="handleCountryChange"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-select>
        </div>

        <div v-if="targetLocation === 'Local'" class="mb-4 flex flex-col md:flex-row items-center">
          <label for="city" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4">City</label>
          <v-text-field v-model="city" :rules="[rules.required]" label="Enter City.." color="#1697F6" variant="outlined" dense class="pt-5 w-full md:w-3/4"></v-text-field>
        </div>

        <div class="mb-4 flex flex-col md:flex-row items-center">
          <label for="businessModel" class="block text-gray-700 font-medium w-full md:w-1/4 text-left pr-4"
            >Business Model
            <v-tooltip text="Select the business model (do you measure sales per each item/service sold or as a subscription based business model).">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">mdi-information</v-icon>
              </template>
            </v-tooltip>
          </label>
          <v-select
            v-model="businessModelText"
            :rules="[rules.required]"
            :items="businessModelTexts"
            label="Select Business Model"
            color="#1697F6"
            variant="outlined"
            dense
            class="pt-5 w-full md:w-3/4"
          ></v-select>
        </div>

        <div class="flex justify-end">
          <v-btn type="submit" color="success" size="large" class="mx-2">Create Task</v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VTextField, VForm, VSelect, VBtn, VTooltip, VIcon } from 'vuetify/components'

const vuetify = createVuetify()

const businessName = ref('')
const businessDescription = ref('')
const businessType = ref('')
const targetAudience = ref('')
const targetLocation = ref('Global')
const selectedCountries = ref([])
const city = ref('')
const businessModel = ref('')

const countryList = ['United States', 'Canada', 'Germany']

const rules = {
  required: value => !!value || 'Required.',
  international: value => (Array.isArray(value) && value.length >= 2) || 'At least two countries required.',
  national: value => !Array.isArray(value) || 'Exactly one country requiredsssss'
}

const handleTargetLocationChange = () => {
  if (targetLocation.value === 'National') {
    selectedCountries.value = []
  }

  // Add required rule dynamically based on targetLocation
  if (targetLocation.value === 'International' || targetLocation.value === 'National' || targetLocation.value === 'Local') {
    rules.dynamicRequired = value => !!value || 'Required.'
  } else {
    delete rules.dynamicRequired
  }
}

const businessModelTexts = ['Sales Per Unit', 'Subscription Based Sales']
const businessModelMapping = {
  'Sales Per Unit': 'sales_per_unit',
  'Subscription Based Sales': 'subscription_sales'
}
const businessModelText = computed({
  get: () => Object.keys(businessModelMapping).find(key => businessModelMapping[key] === businessModel.value),
  set: newValue => {
    businessModel.value = businessModelMapping[newValue]
  }
})

const isFormValid = ref(false)
const handleCountryChange = value => {
  console.log('value :>> ', value)
}
const submitTask = () => {
  if (!isFormValid.value) {
    console.error('Validation failed. Please check the form fields.')
    return
  }

  const body = {
    business_name: businessName.value,
    business_description: businessDescription.value,
    business_type: businessType.value,
    target_audience: targetAudience.value,
    target_location: targetLocation.value,
    business_model: businessModel.value
  }

  if (targetLocation.value === 'International') {
    body.countries = selectedCountries.value
  } else if (targetLocation.value === 'National') {
    body.country = selectedCountries.value
  } else if (targetLocation.value === 'Local') {
    body.city = city.value
  }

  console.log('Submit body:', body)
  // Perform API call with `body`
}

watch(targetLocation, handleTargetLocationChange)
</script>

<style scoped></style>
