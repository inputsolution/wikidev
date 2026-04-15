import { useState } from 'react'
import {
  Badge,
  Button,
  Spinner,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  makeStyles,
  tokens,
  useId,
  useToastController,
} from '@fluentui/react-components'
import {
  ArrowSync20Regular,
  BranchFork20Regular,
  Checkmark20Filled,
  PlugConnected20Regular,
  Settings20Regular,
  TicketDiagonal20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockProjects } from '@/features/projects/mockData'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

interface SyncRecord {
  id: string
  timestamp: string
  provider: 'Jira' | 'Azure DevOps'
  project: string
  items: number
  duration: string
  status: 'OK' | 'Fallo' | 'Parcial'
}

const initialHistory: SyncRecord[] = [
  {
    id: 's-001',
    timestamp: '14 Abr 2026 · 09:12',
    provider: 'Jira',
    project: 'API Solicitudes',
    items: 14,
    duration: '3.2 s',
    status: 'OK',
  },
  {
    id: 's-002',
    timestamp: '14 Abr 2026 · 09:08',
    provider: 'Azure DevOps',
    project: 'API Solicitudes',
    items: 6,
    duration: '1.8 s',
    status: 'OK',
  },
  {
    id: 's-003',
    timestamp: '14 Abr 2026 · 08:30',
    provider: 'Jira',
    project: 'Portal Cliente',
    items: 22,
    duration: '4.1 s',
    status: 'OK',
  },
  {
    id: 's-004',
    timestamp: '14 Abr 2026 · 08:30',
    provider: 'Azure DevOps',
    project: 'Portal Cliente',
    items: 11,
    duration: '2.4 s',
    status: 'Parcial',
  },
  {
    id: 's-005',
    timestamp: '13 Abr 2026 · 22:00',
    provider: 'Jira',
    project: 'Motor de Pagos',
    items: 8,
    duration: '2.9 s',
    status: 'OK',
  },
  {
    id: 's-006',
    timestamp: '13 Abr 2026 · 22:00',
    provider: 'Azure DevOps',
    project: 'Motor de Pagos',
    items: 3,
    duration: '1.2 s',
    status: 'Fallo',
  },
]

const projectMapping: Array<{
  wikiProject: string
  jiraKey: string
  devopsProject: string
}> = [
  {
    wikiProject: 'API Solicitudes',
    jiraKey: 'SOLIC',
    devopsProject: 'banco-solicitudes',
  },
  {
    wikiProject: 'Portal Cliente',
    jiraKey: 'PORTAL',
    devopsProject: 'banco-portal-cliente',
  },
  {
    wikiProject: 'Motor de Pagos',
    jiraKey: 'PAY',
    devopsProject: 'banco-pagos',
  },
  {
    wikiProject: 'Mobile Banking',
    jiraKey: 'MOBILE',
    devopsProject: 'banco-mobile',
  },
  {
    wikiProject: 'Core Bancario',
    jiraKey: 'CORE',
    devopsProject: 'banco-core',
  },
]

const useStyles = makeStyles({
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginBottom: '24px',
    '@media (min-width: 960px)': {
      gridTemplateColumns: '1fr 1fr',
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
    borderRadius: '14px',
    padding: '22px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHead: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },
  brandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandLogo: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '16px',
    fontFamily: MONO,
  },
  jiraLogo: {
    backgroundColor: '#0052CC',
  },
  devopsLogo: {
    backgroundColor: '#0078D4',
  },
  brandName: {
    fontSize: '17px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dashed',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  detailLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
  },
  detailValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    fontFamily: MONO,
    textAlign: 'right',
    wordBreak: 'break-all',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  sectionSub: {
    fontSize: '11px',
    fontFamily: MONO,
    color: tokens.colorNeutralForeground4,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  panel: {
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
    overflow: 'hidden',
    marginBottom: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  th: {
    textAlign: 'left',
    padding: '11px 16px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  td: {
    padding: '12px 16px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    verticalAlign: 'middle',
    fontFamily: MONO,
  },
  pillProvider: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: MONO,
  },
  pillJira: {
    backgroundColor: 'rgba(0, 82, 204, 0.1)',
    color: '#0052CC',
  },
  pillDevops: {
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    color: '#0078D4',
  },
  mappingWiki: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    fontFamily: 'inherit',
  },
})

export function IntegrationsPage() {
  const styles = useStyles()
  const toasterId = useId('integrations-toaster')
  const { dispatchToast } = useToastController(toasterId)
  const [history, setHistory] = useState<SyncRecord[]>(initialHistory)
  const [syncingJira, setSyncingJira] = useState(false)
  const [syncingDevops, setSyncingDevops] = useState(false)

  const notifyTest = (provider: 'Jira' | 'Azure DevOps') => {
    dispatchToast(
      <Toast>
        <ToastTitle>Conexión con {provider} exitosa</ToastTitle>
        <ToastBody>Latencia &lt; 200 ms · token válido</ToastBody>
      </Toast>,
      { intent: 'success' },
    )
  }

  const timestamp = (): string => {
    const d = new Date()
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ]
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const randomId = () => `s-${Math.random().toString(36).slice(2, 9)}`

  const simulateSync = async (provider: 'Jira' | 'Azure DevOps') => {
    if (provider === 'Jira') setSyncingJira(true)
    else setSyncingDevops(true)

    await new Promise((r) => setTimeout(r, 1200))

    const items = Math.floor(Math.random() * 18 + 3)
    const duration = (Math.random() * 3 + 0.8).toFixed(1)
    const record: SyncRecord = {
      id: randomId(),
      timestamp: timestamp(),
      provider,
      project: 'API Solicitudes',
      items,
      duration: `${duration} s`,
      status: 'OK',
    }
    setHistory((prev) => [record, ...prev])

    dispatchToast(
      <Toast>
        <ToastTitle>Sincronización {provider} completada</ToastTitle>
        <ToastBody>
          {items} items importados en {duration} s
        </ToastBody>
      </Toast>,
      { intent: 'success' },
    )

    if (provider === 'Jira') setSyncingJira(false)
    else setSyncingDevops(false)
  }

  const statusColor = (
    status: SyncRecord['status'],
  ): 'success' | 'warning' | 'danger' => {
    if (status === 'OK') return 'success'
    if (status === 'Parcial') return 'warning'
    return 'danger'
  }

  return (
    <>
      <Toaster toasterId={toasterId} position="top-end" />
      <PageHeader
        title="Integraciones"
        description="Conexiones con sistemas externos: Jira Cloud y Azure DevOps."
      />

      <div className={styles.cardsGrid}>
        {/* Jira card */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.brandBlock}>
              <span className={`${styles.brandLogo} ${styles.jiraLogo}`}>Ji</span>
              <div>
                <div className={styles.brandName}>Jira Cloud</div>
                <div className={styles.brandSub}>
                  // jira.atlassian.net
                </div>
              </div>
            </div>
            <Badge appearance="tint" color="success" icon={<Checkmark20Filled />}>
              Conectado
            </Badge>
          </div>

          <div className={styles.detailList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tenant</span>
              <span className={styles.detailValue}>
                https://bancoademi.atlassian.net
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Proyectos sincronizados</span>
              <span className={styles.detailValue}>5</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Último sync</span>
              <span className={styles.detailValue}>hace 12 min</span>
            </div>
            <div
              className={styles.detailRow}
              style={{ borderBottom: 'none', paddingBottom: 0 }}
            >
              <span className={styles.detailLabel}>HU importadas</span>
              <span className={styles.detailValue}>128</span>
            </div>
          </div>

          <div className={styles.cardActions}>
            <Button
              icon={<PlugConnected20Regular />}
              onClick={() => notifyTest('Jira')}
            >
              Probar conexión
            </Button>
            <Button
              appearance="primary"
              icon={
                syncingJira ? (
                  <Spinner size="tiny" appearance="inverted" />
                ) : (
                  <ArrowSync20Regular />
                )
              }
              disabled={syncingJira}
              onClick={() => simulateSync('Jira')}
            >
              {syncingJira ? 'Sincronizando…' : 'Sincronizar ahora'}
            </Button>
            <Button icon={<Settings20Regular />} appearance="subtle">
              Configurar
            </Button>
          </div>
        </div>

        {/* Azure DevOps card */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.brandBlock}>
              <span className={`${styles.brandLogo} ${styles.devopsLogo}`}>Az</span>
              <div>
                <div className={styles.brandName}>Azure DevOps</div>
                <div className={styles.brandSub}>// dev.azure.com</div>
              </div>
            </div>
            <Badge appearance="tint" color="success" icon={<Checkmark20Filled />}>
              Conectado
            </Badge>
          </div>

          <div className={styles.detailList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Organization</span>
              <span className={styles.detailValue}>
                https://dev.azure.com/bancoademi
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Proyectos espejados</span>
              <span className={styles.detailValue}>5</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Último sync</span>
              <span className={styles.detailValue}>hace 3 min</span>
            </div>
            <div
              className={styles.detailRow}
              style={{ borderBottom: 'none', paddingBottom: 0 }}
            >
              <span className={styles.detailLabel}>PRs sincronizados</span>
              <span className={styles.detailValue}>42</span>
            </div>
          </div>

          <div className={styles.cardActions}>
            <Button
              icon={<PlugConnected20Regular />}
              onClick={() => notifyTest('Azure DevOps')}
            >
              Probar conexión
            </Button>
            <Button
              appearance="primary"
              icon={
                syncingDevops ? (
                  <Spinner size="tiny" appearance="inverted" />
                ) : (
                  <ArrowSync20Regular />
                )
              }
              disabled={syncingDevops}
              onClick={() => simulateSync('Azure DevOps')}
            >
              {syncingDevops ? 'Sincronizando…' : 'Sincronizar ahora'}
            </Button>
            <Button icon={<Settings20Regular />} appearance="subtle">
              Configurar
            </Button>
          </div>
        </div>
      </div>

      {/* Mapeo de proyectos */}
      <div className={styles.sectionHead}>
        <div>
          <div className={styles.sectionTitle}>Mapeo de proyectos</div>
          <div className={styles.sectionSub}>
            // correspondencia wiki DEV ↔ Jira ↔ Azure DevOps
          </div>
        </div>
        <Badge appearance="tint">{projectMapping.length} mapeos</Badge>
      </div>

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Proyecto wiki DEV</th>
              <th className={styles.th}>Jira project</th>
              <th className={styles.th}>Azure DevOps project</th>
            </tr>
          </thead>
          <tbody>
            {projectMapping.map((m) => {
              const project = mockProjects.find((p) => p.name === m.wikiProject)
              return (
                <tr key={m.wikiProject}>
                  <td className={styles.td}>
                    <span className={styles.mappingWiki}>{m.wikiProject}</span>
                    {project && (
                      <span style={{ color: tokens.colorNeutralForeground4, marginLeft: 8 }}>
                        {project.code}
                      </span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.pillProvider} ${styles.pillJira}`}>
                      <TicketDiagonal20Regular style={{ fontSize: '12px' }} />
                      {m.jiraKey}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.pillProvider} ${styles.pillDevops}`}>
                      <BranchFork20Regular style={{ fontSize: '12px' }} />
                      {m.devopsProject}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Historial */}
      <div className={styles.sectionHead}>
        <div>
          <div className={styles.sectionTitle}>Historial de sincronizaciones</div>
          <div className={styles.sectionSub}>// últimas {history.length} operaciones</div>
        </div>
      </div>

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Fecha</th>
              <th className={styles.th}>Proveedor</th>
              <th className={styles.th}>Proyecto</th>
              <th className={styles.th}>Items</th>
              <th className={styles.th}>Duración</th>
              <th className={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r.id}>
                <td className={styles.td}>{r.timestamp}</td>
                <td className={styles.td}>
                  <span
                    className={`${styles.pillProvider} ${
                      r.provider === 'Jira' ? styles.pillJira : styles.pillDevops
                    }`}
                  >
                    {r.provider}
                  </span>
                </td>
                <td className={styles.td}>{r.project}</td>
                <td className={styles.td}>{r.items}</td>
                <td className={styles.td}>{r.duration}</td>
                <td className={styles.td}>
                  <Badge appearance="tint" color={statusColor(r.status)}>
                    {r.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
