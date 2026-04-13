import type { ProjectMember } from '@/features/projects/types'

export type SectionKind = 'Arquitectura' | 'APIs' | 'Base de datos' | 'Flujo funcional' | 'Despliegue' | 'Custom'

export interface DocVersion {
  id: string
  number: number
  content: string
  author: ProjectMember
  createdAt: string
  note?: string
}

export interface DocSection {
  id: string
  projectId: string
  kind: SectionKind
  title: string
  versions: DocVersion[]
}

export interface NewSectionDraft {
  title: string
  kind: SectionKind
  initialContent: string
}

export const emptyNewSectionDraft: NewSectionDraft = {
  title: '',
  kind: 'Custom',
  initialContent: '',
}

export const DEFAULT_SECTION_KINDS: SectionKind[] = [
  'Arquitectura',
  'APIs',
  'Base de datos',
  'Flujo funcional',
  'Despliegue',
]
