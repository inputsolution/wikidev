import { useMemo } from 'react'
import { mockProjects, mockChanges } from '@/features/projects/mockData'
import type { Project, ProjectChange } from '@/features/projects/types'
import { mockDocSections } from '@/features/documentation/mockData'
import type { DocSection } from '@/features/documentation/types'

export interface ProjectResult {
  kind: 'project'
  project: Project
  matchedIn: 'name' | 'code' | 'tech' | 'description'
}

export interface ChangeResult {
  kind: 'change'
  change: ProjectChange
  projectId: string
  matchedIn: 'title' | 'description' | 'hu' | 'pr' | 'technical'
}

export interface DocResult {
  kind: 'doc'
  section: DocSection
  snippet: string
  matchedIn: 'title' | 'content'
}

export interface GlobalSearchResult {
  projects: ProjectResult[]
  changes: ChangeResult[]
  docs: DocResult[]
  total: number
}

const EMPTY: GlobalSearchResult = {
  projects: [],
  changes: [],
  docs: [],
  total: 0,
}

function normalize(s: string): string {
  return s.toLowerCase().trim()
}

function snippetAround(text: string, query: string, radius = 60): string {
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text.slice(0, 120) + (text.length > 120 ? '…' : '')
  const start = Math.max(0, i - radius)
  const end = Math.min(text.length, i + query.length + radius)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  return (prefix + text.slice(start, end) + suffix).replace(/\s+/g, ' ')
}

export function useGlobalSearch(
  query: string,
  limit = 6,
): GlobalSearchResult {
  return useMemo(() => {
    const q = normalize(query)
    if (q.length < 2) return EMPTY

    const projects: ProjectResult[] = []
    for (const p of mockProjects) {
      if (normalize(p.name).includes(q)) {
        projects.push({ kind: 'project', project: p, matchedIn: 'name' })
        continue
      }
      if (normalize(p.code).includes(q)) {
        projects.push({ kind: 'project', project: p, matchedIn: 'code' })
        continue
      }
      if (p.tech.some((t) => normalize(t).includes(q))) {
        projects.push({ kind: 'project', project: p, matchedIn: 'tech' })
        continue
      }
      if (normalize(p.description).includes(q)) {
        projects.push({ kind: 'project', project: p, matchedIn: 'description' })
      }
    }

    const changes: ChangeResult[] = []
    for (const [projectId, list] of Object.entries(mockChanges)) {
      for (const c of list) {
        if (normalize(c.title).includes(q)) {
          changes.push({ kind: 'change', change: c, projectId, matchedIn: 'title' })
          continue
        }
        if (normalize(c.description).includes(q)) {
          changes.push({
            kind: 'change',
            change: c,
            projectId,
            matchedIn: 'description',
          })
          continue
        }
        if (c.huRefs.some((h) => normalize(h).includes(q))) {
          changes.push({ kind: 'change', change: c, projectId, matchedIn: 'hu' })
          continue
        }
        if (c.prRefs.some((p) => normalize(p).includes(q))) {
          changes.push({ kind: 'change', change: c, projectId, matchedIn: 'pr' })
          continue
        }
        if (c.technicalDescription && normalize(c.technicalDescription).includes(q)) {
          changes.push({
            kind: 'change',
            change: c,
            projectId,
            matchedIn: 'technical',
          })
        }
      }
    }

    const docs: DocResult[] = []
    for (const s of mockDocSections) {
      if (normalize(s.title).includes(q)) {
        const last = s.versions[s.versions.length - 1]
        docs.push({
          kind: 'doc',
          section: s,
          snippet: snippetAround(last?.content ?? '', q),
          matchedIn: 'title',
        })
        continue
      }
      const last = s.versions[s.versions.length - 1]
      if (last && normalize(last.content).includes(q)) {
        docs.push({
          kind: 'doc',
          section: s,
          snippet: snippetAround(last.content, q),
          matchedIn: 'content',
        })
      }
    }

    const limited: GlobalSearchResult = {
      projects: projects.slice(0, limit),
      changes: changes.slice(0, limit),
      docs: docs.slice(0, limit),
      total: projects.length + changes.length + docs.length,
    }
    return limited
  }, [query, limit])
}
