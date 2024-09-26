import { apiService } from '../services/api-request'
import type { ProjectPayload, ProjectResponse, ProjectsResponse } from '../types/api/projects.types'

// API client for the project entity
export const ProjectsApiClient = {
  // Get all projects
  getProjects() {
    return apiService.get<ProjectsResponse>('/api/projects')
  },

  // Get a single project by ID
  getProject(id: string) {
    return apiService.get<ProjectResponse>(`/api/projects/${id}`)
  },

  // Create a new project
  createProject(projectData: ProjectPayload) {
    return apiService.post<ProjectResponse>('/api/projects', projectData)
  },

  // Update an existing project by ID
  updateProject(id: string, projectData: Partial<ProjectPayload>) {
    return apiService.patch<ProjectResponse>(`/api/projects/${id}`, projectData)
  },

  // Delete a project by ID
  deleteProject(id: string) {
    return apiService.delete<void>(`/api/projects/${id}`)
  }
}
