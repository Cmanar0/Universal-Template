<template>
  <div
    class="card"
    :class="{
      'border-green-500': project.isProfitable && project.isSimulationGenerated,
      'border-red-500': !project.isProfitable && project.isSimulationGenerated,
      'border-gray-300': !project.isSimulationGenerated
    }"
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

        <div class="flex items-center justify-center w-full min-h-[150px] max-h-[150px]">
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
            <p v-else class="text-red-500 text-center p-8">Simulation data will be available after you complete section "simulation".</p>
          </client-only>
        </div>
      </div>
    </div>
    <div class="text-center mt-4 mb-6">
      <div class="w-full">
        <div class="text-center mt-4 mb-6">
          <div class="w-full text-center md:text-right px-4">
            <button @click="redirectToProject(project.id)" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 pa-4 w-full block rounded">
              {{ isProjectCompleted(project.stages) ? 'Edit Project' : 'Continue Editing' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="project.isSimulationGenerated && !project.isProfitable" class="text-center text-red-500 mt-4">The project needs adjustments to be profitable.</div>
    <div class="card-body !py-4">
      <ul class="timeline pl-4">
        <li v-for="(completed, stage) in project.stages" :key="stage" :class="{ completed: completed }">
          <span :class="{ 'text-gray-800': completed, 'text-gray-500': !completed }">
            {{ stage }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const apexChartsRef = ref({}) // Initialize as an empty object

function redirectToProject(id) {
  router.push({ path: '/project', query: { id } }) // Redirect with the query parameter
}

onMounted(() => {
  setTimeout(() => {
    forceResizeCharts()
  }, 300)
})
const forceResizeCharts = () => {
  if (apexChartsRef.value.chart && apexChartsRef.value.chart.windowResizeHandler) {
    // Call the resize handler directly to resize the chart
    apexChartsRef.value.chart.windowResizeHandler()
  } else if (apexChartsRef.value.chart && apexChartsRef.value.chart.parentResizeHandler) {
    // As an alternative, you can also trigger the parent resize handler
    apexChartsRef.value.chart.parentResizeHandler()
  } else if (apexChartsRef.value.chart && apexChartsRef.value.chart.resize) {
    // Or use the resize method if available
    apexChartsRef.value.chart.resize()
  }
}

const isProjectCompleted = stages => {
  return Object.values(stages).every(stage => stage)
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
