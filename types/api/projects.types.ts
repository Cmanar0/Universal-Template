// Define the project interface
export interface Project {
  id: string
  title: string
  value: number
  ownerId: string
}

// Define the payload interface for creating a new project
export interface CreateProject {
  title: string
  ownerId: string // Replace value with ownerId as per the curl request
}

// Define the payload interface for updating a project
export interface UpdateProject {
  title?: string
  value?: number
}
