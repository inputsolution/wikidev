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
  technicalDescription?: string
  impactedComponents?: string[]
  huRefs: string[]
  prRefs: string[]
  author: ProjectMember
  environment: Environment
  version: string
  attachments?: Attachment[]
  comment?: ChangeComment
}

export interface NewChangeDraft {
  type: ChangeType | null
  title: string
  description: string
  technicalDescription: string
  environment: Environment | null
  version: string
  impactedComponents: string[]
  hasHu: boolean
  huRefs: string[]
  hasPr: boolean
  prRefs: string[]
  hasAttachments: boolean
  attachments: Array<{ name: string; size: string }>
  hasComment: boolean
  comment: string
}

export const emptyNewChangeDraft: NewChangeDraft = {
  type: null,
  title: '',
  description: '',
  technicalDescription: '',
  environment: null,
  version: '',
  impactedComponents: [],
  hasHu: false,
  huRefs: [],
  hasPr: false,
  prRefs: [],
  hasAttachments: false,
  attachments: [],
  hasComment: false,
  comment: '',
}
