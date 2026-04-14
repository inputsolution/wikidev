import type { FC } from 'react'
import {
  Avatar,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  BranchFork20Regular,
  Code20Regular,
  DocumentText20Regular,
  History20Regular,
  People20Regular,
  TicketDiagonal20Regular,
} from '@fluentui/react-icons'
import type {
  ChangeType,
  Project,
  ProjectChange,
  PullRequest,
  UserStory,
} from '../types'
import {
  mockChanges,
  mockMembersPool,
  mockPullRequests,
  mockUserStories,
} from '../mockData'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
    },
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
    padding: '18px 20px',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  cardSub: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  description: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  techRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  techChip: {
    fontFamily: MONO,
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
  },
  kpis: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  kpi: {
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  kpiHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
  },
  kpiIcon: {
    color: tokens.colorBrandForeground1,
    display: 'inline-flex',
  },
  kpiValue: {
    fontSize: '26px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
  },
  distributionBar: {
    display: 'flex',
    width: '100%',
    height: '10px',
    borderRadius: '999px',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground2,
    marginBottom: '12px',
  },
  distributionSegment: {
    height: '100%',
  },
  distributionLegend: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: MONO,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  team: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  memberName: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    flex: 1,
  },
  memberRole: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: MONO,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
  },
  activityMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  activityMeta: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
  },
  twoCols: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 900px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

function changeTypeColor(type: ChangeType): string {
  switch (type) {
    case 'Bugfix':
      return '#E11D48'
    case 'Mejora':
      return '#0395A9'
    case 'Refactor':
      return '#D97706'
    case 'Feature':
      return '#059669'
    case 'Docs':
      return '#7C3AED'
  }
}

interface Distribution {
  type: ChangeType
  count: number
  percent: number
}

function computeDistribution(changes: ProjectChange[]): Distribution[] {
  const total = changes.length
  if (total === 0) return []
  const counts: Record<string, number> = {}
  for (const c of changes) {
    counts[c.type] = (counts[c.type] ?? 0) + 1
  }
  return (Object.keys(counts) as ChangeType[]).map((type) => ({
    type,
    count: counts[type],
    percent: Math.round((counts[type] / total) * 100),
  }))
}

interface SummaryTabProps {
  project: Project
}

export const SummaryTab: FC<SummaryTabProps> = ({ project }) => {
  const styles = useStyles()

  const changes: ProjectChange[] =
    mockChanges[project.id] ?? mockChanges['p-001'] ?? []
  const prs: PullRequest[] =
    mockPullRequests[project.id] ?? mockPullRequests['p-001'] ?? []
  const stories: UserStory[] =
    mockUserStories[project.id] ?? mockUserStories['p-001'] ?? []

  const distribution = computeDistribution(changes)
  const openPrs = prs.filter(
    (p) => p.status !== 'Merged' && p.status !== 'Cerrado',
  ).length
  const activeHu = stories.filter((s) => s.status !== 'Hecho' && s.status !== 'Backlog').length
  const team = mockMembersPool.slice(0, 5)
  const recentChanges = changes.slice(0, 4)
  const recentPrs = prs.slice(0, 3)

  return (
    <div className={styles.root}>
      <div className={styles.topGrid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Acerca del proyecto</div>
              <div className={styles.cardSub}>
                // {project.code} · {project.status}
              </div>
            </div>
          </div>
          <div className={styles.description}>{project.description}</div>
          <div className={styles.techRow}>
            {project.tech.map((t) => (
              <span key={t} className={styles.techChip}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Indicadores</div>
              <div className={styles.cardSub}>// snapshot</div>
            </div>
          </div>
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span className={styles.kpiLabel}>Cambios</span>
                <span className={styles.kpiIcon}>
                  <History20Regular />
                </span>
              </div>
              <div className={styles.kpiValue}>{project.changesCount}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span className={styles.kpiLabel}>PRs abiertos</span>
                <span className={styles.kpiIcon}>
                  <BranchFork20Regular />
                </span>
              </div>
              <div className={styles.kpiValue}>{openPrs}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span className={styles.kpiLabel}>HU activas</span>
                <span className={styles.kpiIcon}>
                  <TicketDiagonal20Regular />
                </span>
              </div>
              <div className={styles.kpiValue}>{activeHu}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span className={styles.kpiLabel}>Docs</span>
                <span className={styles.kpiIcon}>
                  <DocumentText20Regular />
                </span>
              </div>
              <div className={styles.kpiValue}>{project.docsCount}</div>
            </div>
          </div>
        </div>
      </div>

      {distribution.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Distribución de cambios</div>
              <div className={styles.cardSub}>
                // {changes.length} cambios registrados
              </div>
            </div>
          </div>
          <div className={styles.distributionBar}>
            {distribution.map((d) => (
              <div
                key={d.type}
                className={styles.distributionSegment}
                style={{
                  width: `${d.percent}%`,
                  backgroundColor: changeTypeColor(d.type),
                }}
                title={`${d.type}: ${d.count} (${d.percent}%)`}
              />
            ))}
          </div>
          <div className={styles.distributionLegend}>
            {distribution.map((d) => (
              <span key={d.type} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: changeTypeColor(d.type) }}
                />
                {d.type} · {d.count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.twoCols}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Equipo</div>
              <div className={styles.cardSub}>// miembros activos</div>
            </div>
            <People20Regular />
          </div>
          <div className={styles.team}>
            <div className={styles.memberRow}>
              <Avatar
                name={project.owner.name}
                initials={project.owner.initials}
                color="brand"
                size={32}
              />
              <span className={styles.memberName}>{project.owner.name}</span>
              <span className={styles.memberRole}>owner</span>
            </div>
            {team.map((m) => (
              <div key={m.id} className={styles.memberRow}>
                <Avatar
                  name={m.name}
                  initials={m.initials}
                  color="colorful"
                  size={32}
                />
                <span className={styles.memberName}>{m.name}</span>
                <span className={styles.memberRole}>dev</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Actividad reciente</div>
              <div className={styles.cardSub}>// últimos cambios</div>
            </div>
            <Code20Regular />
          </div>
          <div className={styles.activityList}>
            {recentChanges.length === 0 && (
              <div style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }}>
                Sin cambios registrados aún.
              </div>
            )}
            {recentChanges.map((c) => (
              <div key={c.id} className={styles.activityItem}>
                <span
                  className={styles.activityDot}
                  style={{ backgroundColor: changeTypeColor(c.type) }}
                />
                <div className={styles.activityMain}>
                  <span className={styles.activityTitle}>{c.title}</span>
                  <span className={styles.activityMeta}>
                    {c.author.name} · {c.date} · {c.environment} · v{c.version}
                  </span>
                </div>
                <Badge appearance="tint" size="extra-small">
                  {c.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {recentPrs.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Pull requests recientes</div>
              <div className={styles.cardSub}>// top 3</div>
            </div>
          </div>
          <div className={styles.activityList}>
            {recentPrs.map((pr) => (
              <div key={pr.id} className={styles.activityItem}>
                <BranchFork20Regular
                  style={{
                    fontSize: '14px',
                    color: tokens.colorBrandForeground1,
                    marginTop: '2px',
                  }}
                />
                <div className={styles.activityMain}>
                  <span className={styles.activityTitle}>
                    PR #{pr.number} &middot; {pr.title}
                  </span>
                  <span className={styles.activityMeta}>
                    {pr.branch} → {pr.targetBranch} · {pr.author.name} ·{' '}
                    {pr.updatedAt}
                  </span>
                </div>
                <Badge appearance="tint" size="extra-small">
                  {pr.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
