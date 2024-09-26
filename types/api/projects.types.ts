// Define the payload interface for creating or updating a project
export interface ProjectPayload {
  title: string
  ownerId: string
  value?: number
}

// Define the general project interface
export interface Project {
  id: string
  title: string
  ownerId: string
  value?: number
  createdAt: string
  updatedAt: string
}

// Define the response interface for getting a single project
export interface ProjectResponse {
  data: Project
  message: string
  status: number
}

// Define the response interface for getting multiple projects
export interface ProjectsResponse {
  data: Project[]
  message: string
  status: number
}
