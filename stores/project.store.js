// stores/project.store.js
import { defineStore } from 'pinia'
import { ProjectApiClient } from '../api/projects.api'

export const useProjectStore = defineStore('projectStore', {
  // State
  state: () => ({
    projects: []
  }),

  // Actions
  actions: {
    // Function to load all projects
    async loadProjects() {
      try {
        const res = await ProjectApiClient.getProjects()
        if (res.success && res.data.data) {
          this.projects = res.data.data // Assign the response data to the projects array
        } else {
          console.error('Failed to load projects:', res.message)
        }
      } catch (err) {
        console.error('Error loading projects:', err)
      }
    },

    // Function to create a new project
    async createProject(projectData) {
      try {
        const res = await ProjectApiClient.createProject(projectData)
        if (res.success && res.data) {
          this.projects.push(res.data) // Push the new project data into the projects array
        } else {
          console.error('Failed to create project:', res.message)
        }
      } catch (err) {
        console.error('Error creating project:', err)
      }
    },

    // Function to update an existing project
    async updateProject(projectId, projectData) {
      try {
        const res = await ProjectApiClient.updateProject(projectId, projectData)
        if (res.success && res.data) {
          const index = this.projects.findIndex(project => project.id === projectId)
          if (index !== -1) {
            this.projects[index] = res.data // Update the project data in the projects array
          }
        } else {
          console.error('Failed to update project:', res.message)
        }
      } catch (err) {
        console.error('Error updating project:', err)
      }
    },

    // Function to delete a project
    async deleteProject(projectId) {
      try {
        const res = await ProjectApiClient.deleteProject(projectId)
        if (res.success) {
          this.projects = this.projects.filter(project => project.id !== projectId) // Filter out the deleted project
        } else {
          console.error('Failed to delete project:', res.message)
        }
      } catch (err) {
        console.error('Error deleting project:', err)
      }
    }
  }
})
