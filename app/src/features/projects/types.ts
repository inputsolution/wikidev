export type ChangeType = 'Mejora' | 'Bugfix' | 'Refactor' | 'Feature' | 'Docs'
export type Environment = 'DEV' | 'QA' | 'UAT' | 'PROD'
export type ProjectStatus = 'Activo' | 'En pausa' | 'Archivado'

export interface ProjectMember {
  id: string
  name: string
  initials: string
}

export interface Project {
  id: string
  code: string
  name: string
  description: string
  status: ProjectStatus
  owner: ProjectMember
  lastUpdate: string
  changesCount: number
  prCount: number
  docsCount: number
  tech: string[]
}

export interface JiraLink {
  id: string
  key: string
  title: string
}

export interface DevOpsLink {
  id: string
  prNumber: number
  title: string
}

export interface Attachment {
  id: string
  name: string
  size: string
  uploadedAt: string
}

export interface ChangeComment {
  author: ProjectMember
  text: string
}

export interface ProjectChange {
  id: string
  date: string
  type: ChangeType
  title: string
  description: string
  huRefs: string[]
  prRefs: string[]
  author: ProjectMember
  environment: Environment
  version: string
  comment?: ChangeComment
}
