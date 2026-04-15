import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Input,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  BranchFork20Regular,
  Dismiss24Regular,
  FolderOpen20Regular,
  Search20Regular,
  TicketDiagonal20Regular,
  Warning20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockProjects } from '@/features/projects/mockData'
import { mockIncidents } from './mockData'
import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from './types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const SEVERITIES: IncidentSeverity[] = ['Crítica', 'Alta', 'Media', 'Baja']
const STATUSES: IncidentStatus[] = [
  'Abierta',
  'En investigación',
  'Workaround',
  'Resuelta',
]

function severityColor(
  s: IncidentSeverity,
): 'danger' | 'warning' | 'brand' | 'subtle' {
  switch (s) {
    case 'Crítica':
      return 'danger'
    case 'Alta':
      return 'warning'
    case 'Media':
      return 'brand'
    case 'Baja':
      return 'subtle'
  }
}

function statusColor(
  s: IncidentStatus,
): 'success' | 'danger' | 'warning' | 'informative' {
  switch (s) {
    case 'Resuelta':
      return 'success'
    case 'Abierta':
      return 'danger'
    case 'En investigación':
      return 'warning'
    case 'Workaround':
      return 'informative'
  }
}

const useStyles = makeStyles({
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
    minWidth: '160px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '14px',
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
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },
  code: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.35,
    marginTop: '2px',
  },
  description: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  meta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    paddingTop: '10px',
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  projectPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: '10px',
    fontWeight: 600,
  },
  tags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  tag: {
    fontFamily: MONO,
    fontSize: '10px',
    padding: '2px 7px',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
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
  empty: {
    padding: '64px 20px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '10px',
  },
  drawer: {
    width: '640px',
    maxWidth: '95vw',
  },
  drawerKicker: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '8px 4px',
  },
  drawerHeadBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: MONO,
    marginBottom: '8px',
  },
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  prose: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.65,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '10px',
    padding: '14px 16px',
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metaRowLabel: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground4,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
    fontFamily: MONO,
  },
  metaRowValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    fontFamily: MONO,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  step: {
    display: 'flex',
    gap: '12px',
    padding: '10px 14px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandStroke2,
  },
  stepNumber: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.55,
  },
  linksRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  linkChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontFamily: MONO,
    fontSize: '11px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
  },
  linkHu: {
    color: '#0052CC',
    borderTopColor: 'rgba(0, 82, 204, 0.25)',
    borderRightColor: 'rgba(0, 82, 204, 0.25)',
    borderBottomColor: 'rgba(0, 82, 204, 0.25)',
    borderLeftColor: 'rgba(0, 82, 204, 0.25)',
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  linkPr: {
    color: '#6B46C1',
    borderTopColor: 'rgba(107, 70, 193, 0.25)',
    borderRightColor: 'rgba(107, 70, 193, 0.25)',
    borderBottomColor: 'rgba(107, 70, 193, 0.25)',
    borderLeftColor: 'rgba(107, 70, 193, 0.25)',
    backgroundColor: 'rgba(107, 70, 193, 0.06)',
  },
  notesBox: {
    padding: '12px 14px',
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: 1.55,
  },
})

export function IncidentsPage() {
  const styles = useStyles()
  const [query, setQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockIncidents.filter((inc) => {
      if (projectFilter !== 'all' && inc.projectId !== projectFilter) return false
      if (severityFilter !== 'all' && inc.severity !== severityFilter) return false
      if (statusFilter !== 'all' && inc.status !== statusFilter) return false
      if (!q) return true
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.code.toLowerCase().includes(q) ||
        inc.tags.some((t) => t.toLowerCase().includes(q)) ||
        inc.solutionSummary.toLowerCase().includes(q)
      )
    })
  }, [query, projectFilter, severityFilter, statusFilter])

  const selected: Incident | null = useMemo(
    () => mockIncidents.find((i) => i.id === selectedId) ?? null,
    [selectedId],
  )

  const total = mockIncidents.length
  const open = mockIncidents.filter((i) => i.status === 'Abierta').length
  const investigating = mockIncidents.filter(
    (i) => i.status === 'En investigación',
  ).length
  const resolved = mockIncidents.filter((i) => i.status === 'Resuelta').length
  const critical = mockIncidents.filter((i) => i.severity === 'Crítica').length

  const projectOf = (projectId: string) =>
    mockProjects.find((p) => p.id === projectId)

  return (
    <>
      <PageHeader
        title="Incidencias / Soluciones"
        description="Base de conocimiento de problemas reportados y cómo fueron resueltos."
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>{total}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Abiertas</div>
          <div className={styles.statValue}>{open}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>En investigación</div>
          <div className={styles.statValue}>{investigating}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Resueltas</div>
          <div className={styles.statValue}>{resolved}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Críticas</div>
          <div className={styles.statValue}>{critical}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          placeholder="Buscar por código, título, descripción o tag…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
        <Dropdown
          className={styles.filterDropdown}
          value={
            projectFilter === 'all'
              ? 'Todos los proyectos'
              : projectOf(projectFilter)?.name ?? 'Proyecto'
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
          value={severityFilter === 'all' ? 'Toda severidad' : severityFilter}
          selectedOptions={[severityFilter]}
          onOptionSelect={(_, d) => setSeverityFilter(d.optionValue ?? 'all')}
        >
          <Option value="all" text="Toda severidad">
            Toda severidad
          </Option>
          {SEVERITIES.map((s) => (
            <Option key={s} value={s} text={s}>
              {s}
            </Option>
          ))}
        </Dropdown>
        <Dropdown
          className={styles.filterDropdown}
          value={statusFilter === 'all' ? 'Todo estado' : statusFilter}
          selectedOptions={[statusFilter]}
          onOptionSelect={(_, d) => setStatusFilter(d.optionValue ?? 'all')}
        >
          <Option value="all" text="Todo estado">
            Todo estado
          </Option>
          {STATUSES.map((s) => (
            <Option key={s} value={s} text={s}>
              {s}
            </Option>
          ))}
        </Dropdown>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          Sin incidencias que coincidan con los filtros actuales.
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((inc) => {
            const project = projectOf(inc.projectId)
            return (
              <button
                key={inc.id}
                type="button"
                className={styles.card}
                onClick={() => setSelectedId(inc.id)}
              >
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.code}>{inc.code}</div>
                    <div className={styles.title}>{inc.title}</div>
                  </div>
                  <Badge appearance="tint" color={severityColor(inc.severity)} size="small">
                    {inc.severity}
                  </Badge>
                </div>
                <div className={styles.description}>{inc.description}</div>
                {inc.tags.length > 0 && (
                  <div className={styles.tags}>
                    {inc.tags.slice(0, 4).map((t) => (
                      <span key={t} className={styles.tag}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.meta}>
                  {project && (
                    <span className={styles.projectPill}>
                      <FolderOpen20Regular style={{ fontSize: '11px' }} />
                      {project.code}
                    </span>
                  )}
                  <Badge appearance="tint" color={statusColor(inc.status)} size="small">
                    {inc.status}
                  </Badge>
                  <span className={styles.metaItem}>{inc.environment}</span>
                  <span className={styles.metaItem}>{inc.reportedAt}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Drawer
        open={!!selected}
        onOpenChange={(_, data) => {
          if (!data.open) setSelectedId(null)
        }}
        position="end"
        size="medium"
        className={styles.drawer}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Cerrar"
                icon={<Dismiss24Regular />}
                onClick={() => setSelectedId(null)}
              />
            }
          >
            {selected && (
              <>
                <div className={styles.drawerKicker}>
                  // {selected.code} · {projectOf(selected.projectId)?.name ?? ''}
                </div>
                {selected.title}
                <div className={styles.drawerHeadBadges}>
                  <Badge appearance="tint" color={severityColor(selected.severity)}>
                    {selected.severity}
                  </Badge>
                  <Badge appearance="tint" color={statusColor(selected.status)}>
                    {selected.status}
                  </Badge>
                  <Badge appearance="outline">{selected.environment}</Badge>
                </div>
              </>
            )}
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          {selected && (
            <div className={styles.drawerBody}>
              <div className={styles.metaGrid}>
                <div className={styles.metaRow}>
                  <span className={styles.metaRowLabel}>Reportado por</span>
                  <span className={styles.metaRowValue}>
                    {selected.reportedBy.name}
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaRowLabel}>Fecha reporte</span>
                  <span className={styles.metaRowValue}>{selected.reportedAt}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaRowLabel}>Ambiente</span>
                  <span className={styles.metaRowValue}>{selected.environment}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaRowLabel}>Resuelta</span>
                  <span className={styles.metaRowValue}>
                    {selected.resolvedAt ?? '—'}
                  </span>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionLabel}>// descripción</div>
                <div className={styles.prose}>{selected.description}</div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionLabel}>// causa raíz</div>
                <div className={styles.prose}>{selected.rootCause}</div>
              </div>

              <div className={styles.sectionBlock}>
                <div className={styles.sectionLabel}>// solución</div>
                <div className={styles.prose} style={{ marginBottom: 12 }}>
                  {selected.solutionSummary}
                </div>
                <div className={styles.steps}>
                  {selected.solutionSteps.map((step) => (
                    <div key={step.order} className={styles.step}>
                      <span className={styles.stepNumber}>{step.order}</span>
                      <span className={styles.stepText}>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(selected.linkedHuKeys.length > 0 ||
                selected.linkedPrKeys.length > 0) && (
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionLabel}>// referencias</div>
                  <div className={styles.linksRow}>
                    {selected.linkedHuKeys.map((h) => (
                      <span
                        key={h}
                        className={`${styles.linkChip} ${styles.linkHu}`}
                      >
                        <TicketDiagonal20Regular style={{ fontSize: '12px' }} />
                        {h}
                      </span>
                    ))}
                    {selected.linkedPrKeys.map((p) => (
                      <span
                        key={p}
                        className={`${styles.linkChip} ${styles.linkPr}`}
                      >
                        <BranchFork20Regular style={{ fontSize: '12px' }} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.tags.length > 0 && (
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionLabel}>// tags</div>
                  <div className={styles.tags}>
                    {selected.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.notes && (
                <div className={styles.notesBox}>
                  <Warning20Regular
                    style={{ fontSize: '14px', marginRight: 6, verticalAlign: 'middle' }}
                  />
                  {selected.notes}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: tokens.colorNeutralForeground3,
                  paddingTop: '8px',
                }}
              >
                <Avatar
                  name={selected.reportedBy.name}
                  initials={selected.reportedBy.initials}
                  color="brand"
                  size={24}
                />
                Reportado por <strong>{selected.reportedBy.name}</strong>
              </div>
            </div>
          )}
        </DrawerBody>
      </Drawer>
    </>
  )
}
