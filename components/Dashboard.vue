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

    <!-- Projects Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="card"
        :class="{
          'border-green-500':
            project.isProfitable && project.isSimulationGenerated,
          'border-red-500':
            !project.isProfitable && project.isSimulationGenerated,
          'border-gray-300': !project.isSimulationGenerated
        }"
        v-for="project in projects"
        :key="project.title"
      >
        <div class="card-body border-b border-gray-300">
          <div class="flex flex-col justify-between w-full">
            <div class="flex-shrink-0 font-medium">
              <p class="text-lg font-bold text-gray-800">{{ project.title }}</p>
              <h4
                v-if="project.isSimulationGenerated"
                class="text-[19px] leading-5 mt-3"
                :class="{
                  'text-green-500': project.value >= 0,
                  'text-red-500': project.value < 0
                }"
              >
                {{ project.value >= 0 ? '+' : '' }}{{ project.value }}
                <span class="text-gray-500">CZK / year</span>
              </h4>
              <h4 v-else class="text-[19px] leading-5 mt-3 opacity-0">
                Placeholder
                <span class="text-gray-500">CZK / year</span>
              </h4>
            </div>

            <div class="flex items-center justify-center w-full min-h-[150px]">
              <client-only>
                <apexchart
                  v-if="project.isSimulationGenerated"
                  ref="apexChartsRef"
                  :options="project.chartOptions"
                  :series="project.chartData"
                  type="area"
                  height="150"
                  class="chart-placeholder"
                ></apexchart>
                <p v-else class="text-red-500 text-center p-8">
                  Simulation data will be available after you complete section
                  "simulation".
                </p>
              </client-only>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mb-6">
          <a
            :href="'/edit-project/' + project.title"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 mr-4 ml-4 w-auto block rounded"
          >
            {{
              isProjectCompleted(project.stages)
                ? 'Edit Project'
                : 'Continue Editing'
            }}
          </a>
        </div>
        <div
          v-if="project.isSimulationGenerated && !project.isProfitable"
          class="text-center text-red-500 mt-4"
        >
          The project needs adjustments to be profitable.
        </div>
        <div class="card-body !py-4">
          <ul class="timeline pl-4">
            <li
              v-for="(completed, stage) in project.stages"
              :key="stage"
              :class="{ completed: completed }"
            >
              <span
                :class="{
                  'text-gray-800': completed,
                  'text-gray-500': !completed
                }"
                >{{ stage }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const projects = ref([
  {
    title: 'Project A',
    value: 1452,
    change: '+0.2%',
    isSimulationGenerated: true,
    isProfitable: true,
    stages: {
      businessModel: true,
      productService: true,
      expenses: true,
      margins: true,
      simulation: true,
      businessPlan: true
    },
    chartOptions: {
      colors: ['#78d7b4', '#FF6969'], // Green and Red colors
      chart: {
        id: 'project_a_chart',
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
        data: [30, 40, 35, 50, 49, 60, 70]
      },
      {
        name: 'Expenses',
        data: [20, 30, 25, 40, 39, 50, 60]
      }
    ]
  },
  {
    title: 'Project B',
    value: -200,
    change: '+1.5%',
    isSimulationGenerated: false,
    isProfitable: false,
    stages: {
      businessModel: true,
      productService: false,
      expenses: false,
      margins: false,
      simulation: false,
      businessPlan: false
    },
    chartOptions: {
      colors: ['#78d7b4', '#FF6969'], // Green and Red colors
      chart: {
        id: 'project_b_chart',
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
        data: [10, 20, 30, 40, 50, 60, 70]
      },
      {
        name: 'Expenses',
        data: [20, 30, 40, 50, 60, 70, 80]
      }
    ]
  },
  {
    title: 'Project C',
    value: -500,
    change: '+3.0%',
    isSimulationGenerated: true,
    isProfitable: false,
    stages: {
      businessModel: true,
      productService: true,
      expenses: true,
      margins: true,
      simulation: true,
      businessPlan: true
    },
    chartOptions: {
      colors: ['#78d7b4', '#FF6969'], // Green and Red colors
      chart: {
        id: 'project_c_chart',
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
        data: [20, 30, 40, 50, 60, 70, 80]
      },
      {
        name: 'Expenses',
        data: [30, 40, 50, 60, 70, 80, 90]
      }
    ]
  },
  {
    title: 'Project D',
    value: 500,
    change: '+4.5%',
    isSimulationGenerated: true,
    isProfitable: true,
    stages: {
      businessModel: true,
      productService: true,
      expenses: true,
      margins: true,
      simulation: true,
      businessPlan: true
    },
    chartOptions: {
      colors: ['#78d7b4', '#FF6969'], // Green and Red colors
      chart: {
        id: 'project_d_chart',
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
        data: [40, 50, 60, 70, 80, 90, 100]
      },
      {
        name: 'Expenses',
        data: [20, 25, 30, 35, 40, 45, 50]
      }
    ]
  }
])

const isProjectCompleted = stages => {
  return Object.values(stages).every(stage => stage)
}

onMounted(() => {
  mittBus.on('update-charts', updateCharts) // Listen for the custom event
  setTimeout(() => {
    updateCharts() // Update the charts after a delay
  }, 500)
})

onUnmounted(() => {
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
  border: 2px solid transparent;
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
.timeline {
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: relative;
  padding-left: 1.5rem;
}
.timeline li {
  padding: 0.5rem 0;
  position: relative;
  display: flex;
  align-items: center;
}
.timeline li:before {
  content: '';
  position: absolute;
  left: -15px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #ccc;
}
.timeline li.completed:before {
  background-color: #78d7b4;
}
.timeline li span {
  margin-left: 20px;
}
.stage {
  margin-bottom: 0.5rem;
}
</style>
