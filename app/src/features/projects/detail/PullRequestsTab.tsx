import { useMemo, useState } from 'react'
import {
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Badge,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  BranchFork20Regular,
  CheckmarkCircle16Filled,
  Circle16Regular,
  Comment20Regular,
  DismissCircle16Filled,
  Search20Regular,
} from '@fluentui/react-icons'
import type { FC } from 'react'
import type {
  CheckStatus,
  Project,
  PullRequest,
  PullRequestStatus,
} from '../types'
import { mockPullRequests } from '../mockData'

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
  list: {
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
    borderRadius: '10px',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  cardHeadMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
  },
  prNumber: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
  },
  prTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.005em',
  },
  branches: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontFamily: MONO,
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap',
  },
  branchChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground2,
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
    color: tokens.colorNeutralForeground2,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap',
    paddingTop: '10px',
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  diffAdd: {
    color: '#059669',
    fontFamily: MONO,
    fontWeight: 600,
  },
  diffRemove: {
    color: '#E11D48',
    fontFamily: MONO,
    fontWeight: 600,
  },
  mono: {
    fontFamily: MONO,
  },
  checksRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  checkItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontFamily: MONO,
    color: tokens.colorNeutralForeground3,
  },
  checkPassed: {
    color: '#059669',
  },
  checkFailed: {
    color: '#E11D48',
  },
  checkRunning: {
    color: '#D97706',
  },
  linkedHu: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    color: '#0052CC',
    fontFamily: MONO,
    fontSize: '11px',
    fontWeight: 600,
  },
  reviewers: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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

function statusBadge(
  status: PullRequestStatus,
): { color: 'success' | 'warning' | 'danger' | 'informative' | 'subtle'; label: string } {
  switch (status) {
    case 'Open':
      return { color: 'informative', label: 'Abierto' }
    case 'En revisión':
      return { color: 'warning', label: 'En revisión' }
    case 'Cambios pedidos':
      return { color: 'danger', label: 'Cambios pedidos' }
    case 'Aprobado':
      return { color: 'success', label: 'Aprobado' }
    case 'Merged':
      return { color: 'success', label: 'Merged' }
    case 'Cerrado':
      return { color: 'subtle', label: 'Cerrado' }
  }
}

function CheckBadge({ status }: { status: CheckStatus }) {
  if (status === 'passed') return <CheckmarkCircle16Filled />
  if (status === 'failed') return <DismissCircle16Filled />
  return <Circle16Regular />
}

interface PullRequestsTabProps {
  project: Project
}

export const PullRequestsTab: FC<PullRequestsTabProps> = ({ project }) => {
  const styles = useStyles()
  const prs = mockPullRequests[project.id] ?? mockPullRequests['p-001'] ?? []
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return prs
    return prs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.branch.toLowerCase().includes(q) ||
        String(p.number).includes(q) ||
        p.author.name.toLowerCase().includes(q),
    )
  }, [prs, query])

  const open = filtered.filter((p) => p.status !== 'Merged' && p.status !== 'Cerrado').length
  const merged = filtered.filter((p) => p.status === 'Merged').length

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>Pull requests relacionados</div>
          <div className={styles.subtitle}>
            // {filtered.length} total · {open} abiertos · {merged} merged · sync con Azure DevOps
          </div>
        </div>
        <Input
          className={styles.search}
          placeholder="Buscar PR por título, branch o autor…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            Sin pull requests relacionados con este proyecto.
          </div>
        )}
        {filtered.map((pr) => {
          const badge = statusBadge(pr.status)
          return (
            <div key={pr.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadMain}>
                  <span className={styles.prNumber}>PR #{pr.number}</span>
                  <span className={styles.prTitle}>{pr.title}</span>
                  <div className={styles.branches}>
                    <span className={styles.branchChip}>
                      <BranchFork20Regular style={{ fontSize: '12px' }} />
                      {pr.branch}
                    </span>
                    <span>→</span>
                    <span className={styles.branchChip}>{pr.targetBranch}</span>
                    {pr.linkedHuKeys.length > 0 &&
                      pr.linkedHuKeys.map((k) => (
                        <span key={k} className={styles.linkedHu}>
                          {k}
                        </span>
                      ))}
                  </div>
                </div>
                <Badge appearance="tint" color={badge.color}>
                  {badge.label}
                </Badge>
              </div>

              <div className={styles.checksRow}>
                {pr.checks.map((c) => (
                  <span
                    key={c.name}
                    className={`${styles.checkItem} ${
                      c.status === 'passed'
                        ? styles.checkPassed
                        : c.status === 'failed'
                          ? styles.checkFailed
                          : styles.checkRunning
                    }`}
                  >
                    <CheckBadge status={c.status} />
                    {c.name}
                  </span>
                ))}
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <Avatar
                    name={pr.author.name}
                    initials={pr.author.initials}
                    color="brand"
                    size={20}
                  />
                  {pr.author.name}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.diffAdd}>+{pr.additions}</span>
                  <span className={styles.diffRemove}>−{pr.deletions}</span>
                  <span className={styles.mono}>· {pr.filesChanged} archivos</span>
                </span>
                <span className={`${styles.metaItem} ${styles.mono}`}>
                  <Comment20Regular style={{ fontSize: '14px' }} />
                  {pr.commentsCount}
                </span>
                <span className={`${styles.metaItem} ${styles.mono}`}>
                  actualizado: {pr.updatedAt}
                </span>
                <span className={styles.reviewers}>
                  <span className={styles.mono} style={{ fontSize: '11px' }}>
                    revisores:
                  </span>
                  <AvatarGroup size={20}>
                    {pr.reviewers.map((r) => (
                      <AvatarGroupItem
                        key={r.id}
                        name={r.name}
                        initials={r.initials}
                      />
                    ))}
                  </AvatarGroup>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { PullRequest }
