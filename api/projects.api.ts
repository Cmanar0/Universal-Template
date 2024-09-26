import { apiService } from '../services/api-request'
import type { Project, CreateProject, UpdateProject } from '../types/api/projects.types'

export const ProjectApiClient = {
  // Fetch the list of projects
  getProjects() {
    return apiService.get<Project[]>('/api/projects')
  },

  // Create a new project
  createProject(projectData: CreateProject) {
    return apiService.post<Project>('/api/projects', projectData)
  },

  // Update an existing project
  updateProject(projectId: string, projectData: UpdateProject) {
    return apiService.patch<Project>(`/api/projects/${projectId}`, projectData)
  },

  // Delete a project
  deleteProject(projectId: string) {
    return apiService.delete<void>(`/api/projects/${projectId}`)
  },

  // Fetch a single project by ID (if needed)
  getProjectById(projectId: string) {
    return apiService.get<Project>(`/api/projects/${projectId}`)
  }
}

export default ProjectApiClient
