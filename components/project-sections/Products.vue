<template>
  <div class="max-w-6xl mx-auto bg-white shadow-md rounded-md">
    <div class="p-6 rounded-md shadow-inner">
      <h1 class="text-2xl pb-6 font-bold">CREATE TASK</h1>
      <form @submit.prevent="submitTask">
        <div class="mb-4 flex items-center">
          <label for="taskName" class="block text-gray-700 font-medium w-1/4">Task Name</label>
          <input v-model="taskName" type="text" id="taskName" class="w-3/4 border border-gray-300 rounded-md p-2" placeholder="Enter Task Name.." />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Create Task</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const taskName = ref('')

const submitTask = () => {
  console.log('Task Name:', taskName.value)
}
</script>

<style scoped>
/* Add any additional styling if necessary */
</style>
