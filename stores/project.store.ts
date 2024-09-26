import { defineStore } from 'pinia'
import { ProjectsApiClient } from '../api/projects.api'
import type { Project } from '../types/api/projects.types'

export const useProjectsStore = defineStore('projectsStore', {
  state: () => ({
    projects: [] as Project[],
    project: null as Project | null,
  }),
  
  actions: {
    async fetchAllProjects() {
      const response = await ProjectsApiClient.getProjects()
      this.projects = response.data.data
    },

    async fetchProject(id: string) {
      const response = await ProjectsApiClient.getProject(id)
      this.project = response.data.data
    },

    async createProject(projectData: Project) {
      const response = await ProjectsApiClient.createProject(projectData)
      this.projects.push(response.data.data)
    },

    async updateProject(id: string, projectData: Partial<Project>) {
      const response = await ProjectsApiClient.updateProject(id, projectData)
      const index = this.projects.findIndex((project) => project.id === id)
      if (index !== -1) {
        this.projects[index] = response.data.data
      }
    },

    async deleteProject(id: string) {
      await ProjectsApiClient.deleteProject(id)
      this.projects = this.projects.filter((project) => project.id !== id)
    }
  },
})
