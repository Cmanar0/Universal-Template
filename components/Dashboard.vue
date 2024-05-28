<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <!-- Top Section: User Info and Subscription -->
    <div
      class="bg-white p-4 gap-y-4 md:gap-y-0 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between mb-6"
    >
      <div class="flex items-center mb-4 md:mb-0">
        <img
          class="w-16 h-16 rounded-full mr-4"
          :src="user.profilePic"
          alt="User profile picture"
        />
        <div>
          <p class="text-gray-600">Welcome to Skote Dashboard</p>
          <h2 class="text-xl font-bold">{{ user.name }}</h2>
          <p class="text-gray-500">{{ user.role }}</p>
        </div>
      </div>
      <div class="flex space-x-8 pr-5 w-full md:w-auto">
        <div class="w-full text-center md:text-right">
          <p class="text-gray-500">Current Subscription</p>
          <h3 class="text-2xl font-semibold">{{ subscription.plan }}</h3>
          <a href="/plans" class="text-blue-700 underline">upgrade</a>
        </div>
      </div>
    </div>

    <!-- Welcome Back Section -->
    <div
      class="bg-blue-100 p-4 rounded-lg shadow-md mb-6 flex items-center min-h-[155px]"
    >
      <div>
        <h3 class="text-lg font-bold text-blue-700 mb-2">Welcome Back!</h3>
        <p class="text-blue-600">Skote Saas Dashboard</p>
        <ul class="text-blue-600 mt-2">
          <li>7+ Layouts</li>
          <li>Multiple apps</li>
        </ul>
      </div>
      <img
        class="ml-auto h-24"
        src="../assets/notification.png"
        alt="Illustration"
        style="margin-bottom: -55px"
      />
    </div>

    <!-- Key Metrics Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-white p-4 rounded-lg shadow-md text-center"
        v-for="metric in metrics"
        :key="metric.title"
      >
        <div class="flex items-center justify-center mb-4">
          <div class="bg-blue-100 p-2 rounded-full" v-html="metric.icon"></div>
        </div>
        <h4 class="text-lg font-semibold">{{ metric.title }}</h4>
        <p class="text-2xl font-bold">{{ metric.value }}</p>
        <p class="text-green-600 mt-1">
          {{ metric.change }} From previous period
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
  name: 'Henry Wells',
  role: 'UI / UX Designer',
  profilePic: 'https://via.placeholder.com/64'
})

const subscription = ref({
  plan: 'Premium Plan'
})

const metrics = ref([
  {
    title: 'Orders',
    value: 1452,
    change: '+0.2%',
    icon: '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>'
  },
  {
    title: 'Revenue',
    value: '$28,452',
    change: '+0.2%',
    icon: '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>'
  },
  {
    title: 'Average Price',
    value: '$16.2',
    change: '+0.0%',
    icon: '<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>'
  }
])
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
