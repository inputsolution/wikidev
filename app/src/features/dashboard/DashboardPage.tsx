import { Link } from 'react-router-dom'
import {
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Badge,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowRight16Regular,
  ArrowTrendingLines20Regular,
  BranchFork20Regular,
  DocumentText20Regular,
  FolderOpen20Regular,
  History20Regular,
  ArrowUp12Filled,
  ArrowDown12Filled,
} from '@fluentui/react-icons'
import { useAuth } from '@/features/auth/hooks/useAuth'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  welcome: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  welcomeMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  welcomeKicker: {
    fontFamily: MONO,
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: tokens.colorBrandForeground1,
  },
  welcomeTitle: {
    fontSize: '26px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.2,
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
  },
  welcomeActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  kpis: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  kpi: {
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
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
      boxShadow: '0 8px 24px rgba(3, 149, 169, 0.08)',
      transform: 'translateY(-1px)',
    },
  },
  kpiHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
  },
  kpiIcon: {
    display: 'inline-flex',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  kpiValue: {
    fontSize: '30px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  kpiDeltaUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#059669',
  },
  kpiDeltaDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#E11D48',
  },
  kpiFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  kpiHint: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
  },
  spark: {
    width: '80px',
    height: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    '@media (min-width: 1100px)': {
      gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)',
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
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.005em',
  },
  cardSub: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  seeMore: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    fontWeight: 600,
    ':hover': {
      textDecoration: 'underline',
    },
  },
  activity: {
    position: 'relative',
    paddingLeft: '22px',
  },
  activityLine: {
    position: 'absolute',
    left: '7px',
    top: '6px',
    bottom: '6px',
    width: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  activityItem: {
    position: 'relative',
    paddingBottom: '16px',
    paddingRight: '4px',
  },
  activityDot: {
    position: 'absolute',
    left: '-18px',
    top: '4px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  activityTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  commitHash: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: tokens.colorBrandBackground2,
  },
  activityMessage: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    fontWeight: 500,
  },
  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap',
  },
  activityMetaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  activityMono: {
    fontFamily: MONO,
  },
  prList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  prItem: {
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background-color 140ms ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  prTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  prTitleText: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.3,
  },
  prMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
  },
  prNumber: {
    color: tokens.colorBrandForeground1,
  },
  activeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  activeItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  activeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
  },
  activeName: {
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
  },
  activeCount: {
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    fontSize: '11px',
  },
  activeBar: {
    height: '6px',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground2,
    overflow: 'hidden',
  },
  activeBarFill: {
    height: '100%',
    backgroundImage: `linear-gradient(90deg, #0395A9, #7DDFEE)`,
    borderRadius: '999px',
  },
  sidebarCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: 0,
  },
})

interface Kpi {
  label: string
  value: number
  delta: number
  hint: string
  icon: React.ComponentType
  spark: number[]
}

const KPIS: Kpi[] = [
  {
    label: 'Proyectos activos',
    value: 12,
    delta: 8,
    hint: '+1 esta semana',
    icon: FolderOpen20Regular,
    spark: [8, 9, 9, 10, 10, 11, 12],
  },
  {
    label: 'Cambios · 7 días',
    value: 38,
    delta: 24,
    hint: 'vs semana previa',
    icon: History20Regular,
    spark: [3, 6, 4, 8, 7, 5, 5],
  },
  {
    label: 'PR pendientes',
    value: 7,
    delta: -12,
    hint: '2 en revisión crítica',
    icon: BranchFork20Regular,
    spark: [10, 9, 9, 8, 8, 8, 7],
  },
  {
    label: 'Docs actualizadas',
    value: 24,
    delta: 15,
    hint: 'últimos 30 días',
    icon: DocumentText20Regular,
    spark: [12, 14, 15, 18, 20, 22, 24],
  },
]

interface ActivityItem {
  hash: string
  type: 'feat' | 'fix' | 'refactor' | 'docs'
  message: string
  project: string
  projectId: string
  author: { name: string; initials: string }
  time: string
  branch: string
}

const ACTIVITY: ActivityItem[] = [
  {
    hash: 'a3f9c2e',
    type: 'refactor',
    message: 'Migrar autenticación a MSAL',
    project: 'Portal Cliente',
    projectId: 'p-002',
    author: { name: 'Carlos R.', initials: 'CR' },
    time: 'hace 12 min',
    branch: 'main',
  },
  {
    hash: '7bd104f',
    type: 'feat',
    message: 'Endpoint de scoring asíncrono',
    project: 'API Solicitudes',
    projectId: 'p-001',
    author: { name: 'María P.', initials: 'MP' },
    time: 'hace 48 min',
    branch: 'feature/scoring',
  },
  {
    hash: '1e2c88a',
    type: 'fix',
    message: 'Corrección en validación de montos ACH',
    project: 'Motor de Pagos',
    projectId: 'p-003',
    author: { name: 'Ana G.', initials: 'AG' },
    time: 'hace 2 h',
    branch: 'hotfix/ach-amount',
  },
  {
    hash: '9c0ffab',
    type: 'docs',
    message: 'Documentación del flujo de onboarding',
    project: 'Mobile Banking',
    projectId: 'p-005',
    author: { name: 'Luisa F.', initials: 'LF' },
    time: 'hace 4 h',
    branch: 'docs/onboarding',
  },
  {
    hash: '5c0aec2',
    type: 'feat',
    message: 'Nuevo conector Snowflake para ETL',
    project: 'Data Warehouse',
    projectId: 'p-004',
    author: { name: 'Jorge V.', initials: 'JV' },
    time: 'hace 6 h',
    branch: 'main',
  },
]

function activityColor(type: ActivityItem['type']): string {
  switch (type) {
    case 'feat':
      return '#059669'
    case 'fix':
      return '#E11D48'
    case 'refactor':
      return '#D97706'
    case 'docs':
      return '#7C3AED'
  }
}

function activityBadgeColor(
  type: ActivityItem['type'],
): 'success' | 'danger' | 'warning' | 'informative' {
  switch (type) {
    case 'feat':
      return 'success'
    case 'fix':
      return 'danger'
    case 'refactor':
      return 'warning'
    case 'docs':
      return 'informative'
  }
}

interface PendingPr {
  number: number
  title: string
  project: string
  reviewers: string[]
  state: 'review' | 'changes' | 'approved'
  branch: string
}

const PENDING_PRS: PendingPr[] = [
  {
    number: 421,
    title: 'Ajustes en login SSO',
    project: 'Portal Cliente',
    reviewers: ['CR', 'MP'],
    state: 'review',
    branch: 'fix/sso-login',
  },
  {
    number: 418,
    title: 'Migración esquema pagos',
    project: 'ERP Core',
    reviewers: ['AG'],
    state: 'changes',
    branch: 'feat/pay-schema',
  },
  {
    number: 409,
    title: 'Refactor scoring a colas',
    project: 'API Solicitudes',
    reviewers: ['MP', 'LF'],
    state: 'review',
    branch: 'refactor/scoring',
  },
]

function prStateBadge(
  state: PendingPr['state'],
): { color: 'warning' | 'danger' | 'success'; label: string } {
  if (state === 'review') return { color: 'warning', label: 'En revisión' }
  if (state === 'changes') return { color: 'danger', label: 'Cambios pedidos' }
  return { color: 'success', label: 'Aprobado' }
}

interface ActiveProject {
  id: string
  name: string
  changes: number
  max: number
}

const ACTIVE_PROJECTS: ActiveProject[] = [
  { id: 'p-006', name: 'Core Bancario', changes: 42, max: 50 },
  { id: 'p-002', name: 'Portal Cliente', changes: 38, max: 50 },
  { id: 'p-001', name: 'API Solicitudes', changes: 27, max: 50 },
  { id: 'p-005', name: 'Mobile Banking', changes: 21, max: 50 },
]

function Sparkline({ data }: { data: number[] }) {
  const width = 80
  const height = 24
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke="#0395A9"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

function greet(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatDate(): string {
  return new Intl.DateTimeFormat('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

export function DashboardPage() {
  const styles = useStyles()
  const { user } = useAuth()

  return (
    <>
      <section className={styles.welcome}>
        <div className={styles.welcomeMain}>
          <span className={styles.welcomeKicker}>// dashboard</span>
          <h1 className={styles.welcomeTitle}>
            {greet()}, {user?.displayName ?? 'usuario'}
          </h1>
          <span className={styles.welcomeSubtitle}>
            Hoy es {formatDate()}. Tienes 7 pull requests esperando revisión y 3 cambios
            sin documentar.
          </span>
        </div>
        <div className={styles.welcomeActions}>
          <Button icon={<ArrowTrendingLines20Regular />} appearance="subtle">
            Reportes
          </Button>
          <Button appearance="primary" icon={<Add20Regular />}>
            Nuevo cambio
          </Button>
        </div>
      </section>

      <section className={styles.kpis}>
        {KPIS.map((kpi) => {
          const Icon = kpi.icon
          const up = kpi.delta >= 0
          return (
            <div key={kpi.label} className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <span className={styles.kpiIcon}>
                  <Icon />
                </span>
              </div>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiValue}>{kpi.value}</span>
                <span className={up ? styles.kpiDeltaUp : styles.kpiDeltaDown}>
                  {up ? <ArrowUp12Filled /> : <ArrowDown12Filled />}
                  {Math.abs(kpi.delta)}%
                </span>
              </div>
              <div className={styles.kpiFoot}>
                <span className={styles.kpiHint}>{kpi.hint}</span>
                <div className={styles.spark}>
                  <Sparkline data={kpi.spark} />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Actividad reciente</div>
              <div className={styles.cardSub}>git log --all --recent</div>
            </div>
            <Link to="/bitacora" className={styles.seeMore}>
              Ver bitácora <ArrowRight16Regular />
            </Link>
          </div>

          <div className={styles.activity}>
            <span className={styles.activityLine} />
            {ACTIVITY.map((item) => (
              <div key={item.hash} className={styles.activityItem}>
                <span
                  className={styles.activityDot}
                  style={{ backgroundColor: activityColor(item.type) }}
                />
                <div className={styles.activityTitle}>
                  <span className={styles.commitHash}>{item.hash}</span>
                  <Badge
                    appearance="tint"
                    color={activityBadgeColor(item.type)}
                    size="small"
                  >
                    {item.type}
                  </Badge>
                  <span className={styles.activityMessage}>{item.message}</span>
                </div>
                <div className={styles.activityMeta}>
                  <span className={styles.activityMetaItem}>
                    <Avatar
                      name={item.author.name}
                      initials={item.author.initials}
                      color="brand"
                      size={16}
                    />
                    {item.author.name}
                  </span>
                  <Link
                    to={`/proyectos/${item.projectId}`}
                    className={styles.activityMetaItem}
                    style={{
                      color: tokens.colorNeutralForeground3,
                      textDecoration: 'none',
                    }}
                  >
                    <FolderOpen20Regular style={{ fontSize: '14px' }} />
                    {item.project}
                  </Link>
                  <span
                    className={`${styles.activityMetaItem} ${styles.activityMono}`}
                  >
                    <BranchFork20Regular style={{ fontSize: '14px' }} />
                    {item.branch}
                  </span>
                  <span className={styles.activityMetaItem}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.sidebarCol}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <div className={styles.cardTitle}>Pull requests pendientes</div>
                <div className={styles.cardSub}>
                  {PENDING_PRS.length} abiertos
                </div>
              </div>
            </div>
            <div className={styles.prList}>
              {PENDING_PRS.map((pr) => {
                const badge = prStateBadge(pr.state)
                return (
                  <Link
                    key={pr.number}
                    to={`/proyectos/p-001`}
                    className={styles.prItem}
                  >
                    <div className={styles.prTitle}>
                      <span className={styles.prTitleText}>{pr.title}</span>
                      <Badge appearance="tint" color={badge.color} size="small">
                        {badge.label}
                      </Badge>
                    </div>
                    <div className={styles.prMeta}>
                      <span>
                        <span className={styles.prNumber}>PR #{pr.number}</span>
                        {'  ·  '}
                        {pr.branch}
                      </span>
                      <AvatarGroup size={20}>
                        {pr.reviewers.map((r) => (
                          <AvatarGroupItem key={r} name={r} initials={r} />
                        ))}
                      </AvatarGroup>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <div className={styles.cardTitle}>Proyectos más activos</div>
                <div className={styles.cardSub}>últimos 30 días</div>
              </div>
            </div>
            <div className={styles.activeList}>
              {ACTIVE_PROJECTS.map((p) => (
                <div key={p.id} className={styles.activeItem}>
                  <div className={styles.activeHeader}>
                    <Link
                      to={`/proyectos/${p.id}`}
                      className={styles.activeName}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {p.name}
                    </Link>
                    <span className={styles.activeCount}>{p.changes} cambios</span>
                  </div>
                  <div className={styles.activeBar}>
                    <div
                      className={styles.activeBarFill}
                      style={{ width: `${(p.changes / p.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
