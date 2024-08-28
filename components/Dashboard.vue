<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <!-- Top Section: User Info and Subscription -->
    <div class="bg-white p-4 gap-y-4 md:gap-y-0 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between mb-6">
      <div class="ml-4">
        <h3 class="text-2xl mb-4 font-semibold">All Projects</h3>
        <p class="text-gray-500">Edit existing or create a new project to find out if your business idea can be profitable.</p>
      </div>
      <div class="flex space-x-8 pa-5 w-full md:w-auto">
        <div class="w-full text-center md:text-right">
          <button @click="createNewProject" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 pa-4 w-full block rounded">New Project</button>
        </div>
      </div>
    </div>

    <!-- Projects Section -->
    <ProjectList :projects="projects" :is-project-completed="isProjectCompleted" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProjectList from './lists/ProjectList.vue'

const createNewProject = () => {
  console.log('createNewProject')
}
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
      colors: ['#34C28F', '#556EE5'], // red #F46969

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
      colors: ['#34C28F', '#556EE5'], //red #F46969
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
      colors: ['#34C28F', '#556EE5'], // Green and Red colors #F46969
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
      colors: ['#34C28F', '#556EE5'], // Green and Red colors #F46969
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
