import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Search20Regular,
  TicketDiagonal20Regular,
} from '@fluentui/react-icons'
import type { FC } from 'react'
import type {
  Project,
  UserStory,
  UserStoryPriority,
  UserStoryStatus,
} from '../types'
import { mockUserStories } from '../mockData'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
  },
  search: {
    flex: 1,
    maxWidth: '360px',
    minWidth: '220px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
  },
  stat: {
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
    borderRadius: '10px',
    padding: '12px 14px',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    borderRadius: '10px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'border-color 140ms ease',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  cardHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  huKey: {
    fontFamily: MONO,
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    color: '#0052CC',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  huTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    flex: 1,
    minWidth: 0,
  },
  description: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap',
    paddingTop: '8px',
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  footerItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  mono: {
    fontFamily: MONO,
  },
  empty: {
    padding: '48px 20px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '10px',
  },
})

function statusColor(
  status: UserStoryStatus,
): 'informative' | 'warning' | 'brand' | 'success' | 'subtle' {
  switch (status) {
    case 'Backlog':
      return 'subtle'
    case 'En progreso':
      return 'warning'
    case 'En revisión':
      return 'informative'
    case 'QA':
      return 'brand'
    case 'Hecho':
      return 'success'
  }
}

function priorityColor(
  priority: UserStoryPriority,
): 'danger' | 'warning' | 'subtle' {
  switch (priority) {
    case 'Alta':
      return 'danger'
    case 'Media':
      return 'warning'
    case 'Baja':
      return 'subtle'
  }
}

interface UserStoriesTabProps {
  project: Project
}

export const UserStoriesTab: FC<UserStoriesTabProps> = ({ project }) => {
  const styles = useStyles()
  const stories = mockUserStories[project.id] ?? mockUserStories['p-001'] ?? []
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stories
    return stories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.key.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.assignee.name.toLowerCase().includes(q),
    )
  }, [stories, query])

  const totalPoints = filtered.reduce((acc, s) => acc + s.storyPoints, 0)
  const done = filtered.filter((s) => s.status === 'Hecho').length
  const inProgress = filtered.filter(
    (s) => s.status === 'En progreso' || s.status === 'En revisión' || s.status === 'QA',
  ).length
  const backlog = filtered.filter((s) => s.status === 'Backlog').length

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>Historias de usuario relacionadas</div>
          <div className={styles.subtitle}>
            // {filtered.length} HU · {totalPoints} story points · sync con Jira
          </div>
        </div>
        <Input
          className={styles.search}
          placeholder="Buscar HU por título, clave o responsable…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Hechas</div>
          <div className={styles.statValue}>{done}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>En curso</div>
          <div className={styles.statValue}>{inProgress}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Backlog</div>
          <div className={styles.statValue}>{backlog}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Story points</div>
          <div className={styles.statValue}>{totalPoints}</div>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            Sin historias de usuario relacionadas con este proyecto.
          </div>
        )}
        {filtered.map((s) => (
          <div key={s.id} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.huKey}>
                <TicketDiagonal20Regular style={{ fontSize: '14px' }} />
                {s.key}
              </span>
              <span className={styles.huTitle}>{s.title}</span>
              <Badge appearance="tint" color={statusColor(s.status)} size="small">
                {s.status}
              </Badge>
              <Badge appearance="outline" color={priorityColor(s.priority)} size="small">
                {s.priority}
              </Badge>
            </div>
            <div className={styles.description}>{s.description}</div>
            <div className={styles.footer}>
              <span className={styles.footerItem}>
                <Avatar
                  name={s.assignee.name}
                  initials={s.assignee.initials}
                  color="brand"
                  size={20}
                />
                {s.assignee.name}
              </span>
              <span className={`${styles.footerItem} ${styles.mono}`}>
                sprint: {s.sprint}
              </span>
              <span className={`${styles.footerItem} ${styles.mono}`}>
                pts: {s.storyPoints}
              </span>
              <span className={`${styles.footerItem} ${styles.mono}`}>
                actualizado: {s.updatedAt}
              </span>
              {s.linkedChangeIds.length > 0 && (
                <span className={`${styles.footerItem} ${styles.mono}`}>
                  · {s.linkedChangeIds.length} cambio(s) vinculado(s)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Evitar warning por UserStory no usado directamente en runtime
export type { UserStory }
