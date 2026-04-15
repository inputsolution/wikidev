import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Dropdown,
  Input,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  FolderOpen20Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockChanges, mockProjects } from '@/features/projects/mockData'
import type { ChangeType, ProjectChange } from '@/features/projects/types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

interface CommentEntry {
  id: string
  projectId: string
  projectName: string
  projectCode: string
  change: ProjectChange
  authorName: string
  authorInitials: string
  text: string
}

function changeBadgeColor(
  type: ChangeType,
): 'brand' | 'danger' | 'warning' | 'success' | 'informative' {
  switch (type) {
    case 'Bugfix':
      return 'danger'
    case 'Mejora':
      return 'brand'
    case 'Refactor':
      return 'warning'
    case 'Feature':
      return 'success'
    case 'Docs':
      return 'informative'
  }
}

const useStyles = makeStyles({
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '18px',
  },
  stat: {
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
  },
  statLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    marginTop: '4px',
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    maxWidth: '360px',
    minWidth: '220px',
  },
  filterDropdown: {
    minWidth: '180px',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderRadius: '12px',
    padding: '16px 18px',
    display: 'flex',
    gap: '14px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
      boxShadow: '0 3px 12px rgba(15, 23, 42, 0.05)',
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  headRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  authorName: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  projectPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 10px',
    borderRadius: '999px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: MONO,
  },
  dateChip: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
  },
  contextLine: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  contextChangeTitle: {
    color: tokens.colorNeutralForeground2,
    fontFamily: 'inherit',
    fontWeight: 500,
  },
  commentText: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: tokens.colorNeutralForeground1,
    padding: '10px 14px',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandStroke2,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    marginTop: '4px',
  },
  empty: {
    padding: '64px 20px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '10px',
  },
})

export function CommentsPage() {
  const styles = useStyles()
  const [query, setQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [authorFilter, setAuthorFilter] = useState<string>('all')

  const allComments: CommentEntry[] = useMemo(() => {
    const list: CommentEntry[] = []
    for (const [projectId, changes] of Object.entries(mockChanges)) {
      const project = mockProjects.find((p) => p.id === projectId)
      if (!project) continue
      for (const change of changes) {
        if (!change.comment) continue
        list.push({
          id: `${projectId}-${change.id}`,
          projectId,
          projectName: project.name,
          projectCode: project.code,
          change,
          authorName: change.comment.author.name,
          authorInitials: change.comment.author.initials,
          text: change.comment.text,
        })
      }
    }
    return list
  }, [])

  const authors = useMemo(() => {
    const seen = new Map<string, string>()
    for (const c of allComments) {
      if (!seen.has(c.authorName)) seen.set(c.authorName, c.authorInitials)
    }
    return Array.from(seen.entries()).map(([name, initials]) => ({
      name,
      initials,
    }))
  }, [allComments])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allComments.filter((c) => {
      if (projectFilter !== 'all' && c.projectId !== projectFilter) return false
      if (authorFilter !== 'all' && c.authorName !== authorFilter) return false
      if (!q) return true
      return (
        c.text.toLowerCase().includes(q) ||
        c.change.title.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q)
      )
    })
  }, [allComments, query, projectFilter, authorFilter])

  const topAuthor = useMemo((): { name: string; count: number } | null => {
    const counts = new Map<string, number>()
    for (const c of allComments) {
      counts.set(c.authorName, (counts.get(c.authorName) ?? 0) + 1)
    }
    let topName: string | null = null
    let topCount = 0
    counts.forEach((count, name) => {
      if (count > topCount) {
        topCount = count
        topName = name
      }
    })
    return topName ? { name: topName, count: topCount } : null
  }, [allComments])

  return (
    <>
      <PageHeader
        title="Comentarios"
        description="Conversaciones técnicas registradas en los cambios de bitácora."
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total comentarios</div>
          <div className={styles.statValue}>{allComments.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Proyectos con comentarios</div>
          <div className={styles.statValue}>
            {new Set(allComments.map((c) => c.projectId)).size}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Autores únicos</div>
          <div className={styles.statValue}>{authors.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Autor más activo</div>
          <div className={styles.statValue}>
            {topAuthor ? topAuthor.name : '—'}
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          placeholder="Buscar por texto, autor, proyecto o cambio…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
        <Dropdown
          className={styles.filterDropdown}
          value={
            projectFilter === 'all'
              ? 'Todos los proyectos'
              : mockProjects.find((p) => p.id === projectFilter)?.name ?? 'Proyecto'
          }
          selectedOptions={[projectFilter]}
          onOptionSelect={(_, d) => setProjectFilter(d.optionValue ?? 'all')}
        >
          <Option value="all" text="Todos los proyectos">
            Todos los proyectos
          </Option>
          {mockProjects.map((p) => (
            <Option key={p.id} value={p.id} text={p.name}>
              {p.name}
            </Option>
          ))}
        </Dropdown>
        <Dropdown
          className={styles.filterDropdown}
          value={authorFilter === 'all' ? 'Todos los autores' : authorFilter}
          selectedOptions={[authorFilter]}
          onOptionSelect={(_, d) => setAuthorFilter(d.optionValue ?? 'all')}
        >
          <Option value="all" text="Todos los autores">
            Todos los autores
          </Option>
          {authors.map((a) => (
            <Option key={a.name} value={a.name} text={a.name}>
              {a.name}
            </Option>
          ))}
        </Dropdown>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          Sin comentarios que coincidan con los filtros actuales.
        </div>
      ) : (
        <div className={styles.feed}>
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/proyectos/${c.projectId}`}
              className={styles.card}
            >
              <Avatar
                name={c.authorName}
                initials={c.authorInitials}
                color="brand"
                size={40}
              />
              <div className={styles.main}>
                <div className={styles.headRow}>
                  <span className={styles.authorName}>{c.authorName}</span>
                  <span className={styles.projectPill}>
                    <FolderOpen20Regular style={{ fontSize: '11px' }} />
                    {c.projectCode} · {c.projectName}
                  </span>
                  <Badge
                    appearance="tint"
                    color={changeBadgeColor(c.change.type)}
                    size="small"
                  >
                    {c.change.type}
                  </Badge>
                  <span className={styles.dateChip}>{c.change.date}</span>
                </div>
                <div className={styles.contextLine}>
                  // comentó en{' '}
                  <span className={styles.contextChangeTitle}>
                    "{c.change.title}"
                  </span>
                </div>
                <div className={styles.commentText}>{c.text}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
