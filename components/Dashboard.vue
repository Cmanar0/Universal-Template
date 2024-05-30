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
        class="card dark:bg-zink-700"
        v-for="metric in metrics"
        :key="metric.title"
      >
        <div class="card-body border-b border-gray-300 dark:border-zink-50">
          <div class="flex justify-between w-full">
            <div class="flex-shrink-0 font-medium dark:text-white">
              <p class="text-13 text-gray-600 dark:text-zink-200">
                {{ metric.title }}
              </p>
              <h4 class="text-[19px] leading-5 mt-3">{{ metric.value }}</h4>
            </div>
            <div>
              <client-only>
                <apexchart
                  ref="apexChartsRef"
                  :options="metric.chartOptions"
                  :series="metric.chartData"
                  type="area"
                  height="150"
                  class="chart-placeholder"
                ></apexchart>
              </client-only>
            </div>
          </div>
        </div>
        <div class="card-body !py-4">
          <p class="text-13 dark:text-zink-200">
            <span
              class="inline bg-green-100 mr-2 text-[9px] text-green-500 px-1 py-[2px] rounded font-medium dark:bg-green-500/20"
            >
              <i class="bx bx-trending-up align-center me-1"></i
              >{{ metric.change }}
            </span>
            From previous period
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { defineAsyncComponent } from 'vue'
import mittBus from '../utils/mitt.js'

const ApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

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
    colors: ['#78d7b4', '#f0a'],
    chartOptions: {
      chart: {
        id: 'orders_chart',
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      }
    },
    chartData: [
      {
        name: 'Orders',
        data: [30, 40, 35, 50, 49, 60, 70]
      },
      {
        name: 'Pending Orders',
        data: [20, 30, 25, 40, 39, 50, 60]
      }
    ]
  },
  {
    title: 'Revenue',
    value: '$28,452',
    change: '+0.2%',
    colors: ['#78d7b4', '#f0a'],
    chartOptions: {
      chart: {
        id: 'revenue_chart',
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      }
    },
    chartData: [
      {
        name: 'Revenue',
        data: [50, 60, 70, 80, 90, 100, 110]
      },
      {
        name: 'Projected Revenue',
        data: [40, 50, 60, 70, 80, 90, 100]
      }
    ]
  },
  {
    title: 'Average Price',
    value: '$16.2',
    change: '+0.0%',
    colors: ['#78d7b4', '#f0a'],
    chartOptions: {
      chart: {
        id: 'average_price_chart',
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      }
    },
    chartData: [
      {
        name: 'Average Price',
        data: [10, 20, 15, 25, 22, 30, 28]
      },
      {
        name: 'Projected Price',
        data: [8, 18, 13, 23, 20, 28, 26]
      }
    ]
  }
])

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
  // window.addEventListener('resize', updateCharts)
  mittBus.on('update-charts', updateCharts) // Listen for the custom event
})

onUnmounted(() => {
  // window.removeEventListener('resize', updateCharts)
  mittBus.off('update-charts', updateCharts) // Clean up the event listener
})

const apexChartsRef = ref([])

const updateCharts = () => {
  apexChartsRef.value.forEach(chartComponent => {
    if (chartComponent && chartComponent.updateOptions) {
      chartComponent.updateOptions(chartComponent.options)
    }
  })
}
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.card-body {
  padding: 1rem;
}
.dark .card {
  background-color: #1a1a1a;
}
.text-13 {
  font-size: 13px;
}
.chart-placeholder {
  width: 100%;
  height: 150px;
}
</style>
