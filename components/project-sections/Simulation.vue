<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <!-- Products Information -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 class="text-lg font-bold mb-4">Products Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="product in products" :key="product.name" class="bg-gray-50 p-4 rounded-lg shadow">
          <h3 class="font-semibold">{{ product.name }}</h3>
          <p>Expense per Unit: {{ product.expensePerUnit }} USD</p>
          <p>Selling Price: {{ product.sellingPrice }} USD</p>
          <p>Sales per Month: {{ product.salesPerMonth }}</p>
        </div>
      </div>
    </div>
    <!-- Range Area Chart -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <client-only>
        <apexchart ref="apexChart" type="rangeArea" height="350" :options="chartOptions" :series="series"></apexchart>
      </client-only>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import mittBus from '../utils/mitt.js'

// Lazy load Vue-ApexCharts
const ApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

// Timeline (categories)
const timeline = ref([
  '2022-01-01',
  '2022-02-01',
  '2022-03-01',
  '2022-04-01',
  '2022-05-01',
  '2022-06-01',
  '2022-07-01',
  '2022-08-01',
  '2022-09-01',
  '2022-10-01',
  '2022-11-01',
  '2022-12-01',
  '2023-01-01',
  '2023-02-01',
  '2023-03-01',
  '2023-04-01',
  '2023-05-01',
  '2023-06-01',
  '2023-07-01',
  '2023-08-01',
  '2023-09-01',
  '2023-10-01',
  '2023-11-01',
  '2023-12-01'
])

// Chart options
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'rangeArea'
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Business Expenses and Profits'
  },
  markers: {
    hover: {
      sizeOffset: 5
    }
  },
  dataLabels: {
    enabled: false
  },
  yaxis: {
    labels: {
      formatter: val => {
        return val + ' USD'
      }
    }
  },
  xaxis: {
    type: 'category',
    categories: timeline.value
  }
})

// Function to add x values to the data
const addXValues = (data, timeline) => {
  return data.map((y, index) => ({ x: timeline[index], y }))
}

// Product Information
const products = ref([
  { name: 'Product 1', expensePerUnit: 30, sellingPrice: 35, salesPerMonth: 10 },
  { name: 'Product 2', expensePerUnit: 20, sellingPrice: 25, salesPerMonth: 10 }
])

// One-time expenses (constant): lower value = 0, higher value = constant number
const oneTimeExpenses = [
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000],
  [0, 1000]
]

// Recurring expenses (compounded monthly): lower value = higher value of One-Time Expenses, higher value = compounded value
const monthlyExpense = 200
const recurringExpenses = []
let currentExpense = 1000 + monthlyExpense // Start with the higher value of One-Time Expenses
for (let i = 0; i < timeline.value.length; i++) {
  recurringExpenses.push([1000, currentExpense])
  currentExpense += monthlyExpense
}

// Sales dependent expenses and profits
const salesDependentExpenses = []
const profits = []
let cumulativeProfit = 0

for (let i = 0; i < timeline.value.length; i++) {
  const totalSalesExpense = products.value.reduce((sum, product) => sum + product.expensePerUnit * product.salesPerMonth, 0)
  const totalRevenue = products.value.reduce((sum, product) => sum + product.sellingPrice * product.salesPerMonth, 0)
  const totalExpenses = recurringExpenses[i][1] + totalSalesExpense
  salesDependentExpenses.push([recurringExpenses[i][1], totalExpenses])
  cumulativeProfit += totalRevenue
  profits.push([0, cumulativeProfit])
}

// Add x values to the series data
const series = ref([
  {
    name: 'Profits',
    data: addXValues(profits, timeline.value)
  },
  {
    name: 'One-Time Expenses',
    data: addXValues(oneTimeExpenses, timeline.value)
  },
  {
    name: 'Recurring Expenses',
    data: addXValues(recurringExpenses, timeline.value)
  },
  {
    name: 'Sales Dependent Expenses',
    data: addXValues(salesDependentExpenses, timeline.value)
  }
])

const apexChart = ref(null)

onMounted(() => {
  const updateCharts = () => {
    if (apexChart.value && apexChart.value.updateOptions) {
      apexChart.value.updateOptions(apexChart.value.options)
    }
  }

  mittBus.on('update-charts', updateCharts)

  console.log('series :>> ', series.value)

  return () => {
    mittBus.off('update-charts', updateCharts)
  }
})
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}
</style>
