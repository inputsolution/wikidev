import type { Environment, ProjectMember } from '@/features/projects/types'

export type IncidentSeverity = 'Crítica' | 'Alta' | 'Media' | 'Baja'

export type IncidentStatus =
  | 'Abierta'
  | 'En investigación'
  | 'Workaround'
  | 'Resuelta'

export interface IncidentSolutionStep {
  order: number
  text: string
}

export interface Incident {
  id: string
  code: string
  title: string
  description: string
  rootCause: string
  severity: IncidentSeverity
  status: IncidentStatus
  projectId: string
  environment: Environment
  reportedBy: ProjectMember
  reportedAt: string
  resolvedAt?: string
  tags: string[]
  solutionSummary: string
  solutionSteps: IncidentSolutionStep[]
  linkedHuKeys: string[]
  linkedPrKeys: string[]
  notes?: string
}
