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

export type UserStoryStatus =
  | 'Backlog'
  | 'En progreso'
  | 'En revisión'
  | 'QA'
  | 'Hecho'

export type UserStoryPriority = 'Alta' | 'Media' | 'Baja'

export interface UserStory {
  id: string
  projectId: string
  key: string
  title: string
  description: string
  status: UserStoryStatus
  priority: UserStoryPriority
  assignee: ProjectMember
  sprint: string
  storyPoints: number
  createdAt: string
  updatedAt: string
  linkedChangeIds: string[]
}

export type PullRequestStatus =
  | 'Open'
  | 'En revisión'
  | 'Cambios pedidos'
  | 'Aprobado'
  | 'Merged'
  | 'Cerrado'

export type CheckStatus = 'passed' | 'failed' | 'running'

export interface PullRequestCheck {
  name: string
  status: CheckStatus
}

export interface PullRequest {
  id: string
  projectId: string
  number: number
  title: string
  branch: string
  targetBranch: string
  status: PullRequestStatus
  author: ProjectMember
  reviewers: ProjectMember[]
  createdAt: string
  updatedAt: string
  additions: number
  deletions: number
  filesChanged: number
  commentsCount: number
  linkedHuKeys: string[]
  checks: PullRequestCheck[]
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

export interface NewProjectDraft {
  code: string
  name: string
  description: string
  tech: string[]
  ownerId: string | null
  memberIds: string[]
}

export const emptyNewProjectDraft: NewProjectDraft = {
  code: '',
  name: '',
  description: '',
  tech: [],
  ownerId: null,
  memberIds: [],
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
