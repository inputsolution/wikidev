import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ArrowDownload20Regular,
  BranchFork20Regular,
  FolderOpen20Regular,
  Search20Regular,
  TicketDiagonal20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockChanges, mockProjects } from '@/features/projects/mockData'
import type {
  ChangeType,
  Environment,
  ProjectChange,
} from '@/features/projects/types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

interface GlobalChange extends ProjectChange {
  projectId: string
  projectName: string
  projectCode: string
}

const CHANGE_TYPES: ChangeType[] = ['Mejora', 'Bugfix', 'Refactor', 'Feature', 'Docs']
const ENVIRONMENTS: Environment[] = ['DEV', 'QA', 'UAT', 'PROD']

function changeColor(type: ChangeType): string {
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
  filterGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterDropdown: {
    minWidth: '140px',
  },
  spacer: {
    flex: 1,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
  timeline: {
    position: 'relative',
    paddingLeft: '28px',
  },
  timelineLine: {
    position: 'absolute',
    left: '11px',
    top: '6px',
    bottom: '6px',
    width: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  dateRow: {
    position: 'relative',
    marginBottom: '12px',
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    letterSpacing: '0.02em',
  },
  dateDot: {
    position: 'absolute',
    left: '-23px',
    top: '3px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '2px',
    borderRightWidth: '2px',
    borderBottomWidth: '2px',
    borderLeftWidth: '2px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
  },
  changeCard: {
    position: 'relative',
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
    marginBottom: '14px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
      boxShadow: '0 3px 12px rgba(15, 23, 42, 0.05)',
    },
  },
  changeDot: {
    position: 'absolute',
    left: '-23px',
    top: '22px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    borderTopWidth: '2px',
    borderRightWidth: '2px',
    borderBottomWidth: '2px',
    borderLeftWidth: '2px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralBackground2,
    borderRightColor: tokens.colorNeutralBackground2,
    borderBottomColor: tokens.colorNeutralBackground2,
    borderLeftColor: tokens.colorNeutralBackground2,
  },
  projectPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 10px',
    borderRadius: '999px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: MONO,
    marginRight: '8px',
  },
  changeHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  changeTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  changeDesc: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
    marginBottom: '12px',
  },
  refs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  refChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
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
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorNeutralForeground2,
  },
  refChipJira: {
    color: '#0052CC',
    borderTopColor: 'rgba(0, 82, 204, 0.25)',
    borderRightColor: 'rgba(0, 82, 204, 0.25)',
    borderBottomColor: 'rgba(0, 82, 204, 0.25)',
    borderLeftColor: 'rgba(0, 82, 204, 0.25)',
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  refChipPR: {
    color: '#6B46C1',
    borderTopColor: 'rgba(107, 70, 193, 0.25)',
    borderRightColor: 'rgba(107, 70, 193, 0.25)',
    borderBottomColor: 'rgba(107, 70, 193, 0.25)',
    borderLeftColor: 'rgba(107, 70, 193, 0.25)',
    backgroundColor: 'rgba(107, 70, 193, 0.06)',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    paddingTop: '12px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    flexWrap: 'wrap',
  },
  author: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaBlock: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: MONO,
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

export function ChangelogPage() {
  const styles = useStyles()
  const [query, setQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [envFilter, setEnvFilter] = useState<string>('all')

  const allChanges: GlobalChange[] = useMemo(() => {
    const list: GlobalChange[] = []
    for (const [projectId, changes] of Object.entries(mockChanges)) {
      const project = mockProjects.find((p) => p.id === projectId)
      if (!project) continue
      for (const c of changes) {
        list.push({
          ...c,
          projectId,
          projectName: project.name,
          projectCode: project.code,
        })
      }
    }
    return list
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allChanges.filter((c) => {
      if (projectFilter !== 'all' && c.projectId !== projectFilter) return false
      if (typeFilter !== 'all' && c.type !== typeFilter) return false
      if (envFilter !== 'all' && c.environment !== envFilter) return false
      if (!q) return true
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q) ||
        c.author.name.toLowerCase().includes(q) ||
        c.huRefs.some((h) => h.toLowerCase().includes(q)) ||
        c.prRefs.some((p) => p.toLowerCase().includes(q))
      )
    })
  }, [allChanges, query, projectFilter, typeFilter, envFilter])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, GlobalChange[]>>((acc, c) => {
      if (!acc[c.date]) acc[c.date] = []
      acc[c.date].push(c)
      return acc
    }, {})
  }, [filtered])

  const byType = (t: ChangeType) => filtered.filter((c) => c.type === t).length

  return (
    <>
      <PageHeader
        title="Bitácora global"
        description="Histórico de cambios de todos los proyectos con filtros y trazabilidad."
        actions={
          <Button icon={<ArrowDownload20Regular />}>Exportar CSV</Button>
        }
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Cambios</div>
          <div className={styles.statValue}>{filtered.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Mejoras</div>
          <div className={styles.statValue}>{byType('Mejora')}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Bugfixes</div>
          <div className={styles.statValue}>{byType('Bugfix')}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Features</div>
          <div className={styles.statValue}>{byType('Feature')}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          placeholder="Buscar por título, descripción, HU, PR, autor…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
        <div className={styles.filterGroup}>
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
            value={typeFilter === 'all' ? 'Todos los tipos' : typeFilter}
            selectedOptions={[typeFilter]}
            onOptionSelect={(_, d) => setTypeFilter(d.optionValue ?? 'all')}
          >
            <Option value="all" text="Todos los tipos">
              Todos los tipos
            </Option>
            {CHANGE_TYPES.map((t) => (
              <Option key={t} value={t} text={t}>
                {t}
              </Option>
            ))}
          </Dropdown>
          <Dropdown
            className={styles.filterDropdown}
            value={envFilter === 'all' ? 'Todos los ambientes' : envFilter}
            selectedOptions={[envFilter]}
            onOptionSelect={(_, d) => setEnvFilter(d.optionValue ?? 'all')}
          >
            <Option value="all" text="Todos los ambientes">
              Todos los ambientes
            </Option>
            {ENVIRONMENTS.map((e) => (
              <Option key={e} value={e} text={e}>
                {e}
              </Option>
            ))}
          </Dropdown>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          Sin cambios que coincidan con los filtros actuales.
        </div>
      ) : (
        <div className={styles.timeline}>
          <span className={styles.timelineLine} />
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className={styles.dateRow}>
                <span className={styles.dateDot} />
                {date}
              </div>
              {items.map((c) => (
                <Link
                  key={`${c.projectId}-${c.id}`}
                  to={`/proyectos/${c.projectId}`}
                  className={styles.changeCard}
                >
                  <span
                    className={styles.changeDot}
                    style={{ backgroundColor: changeColor(c.type) }}
                  />
                  <div className={styles.changeHead}>
                    <span className={styles.projectPill}>
                      <FolderOpen20Regular style={{ fontSize: '12px' }} />
                      {c.projectCode} · {c.projectName}
                    </span>
                    <Badge appearance="tint" color={changeBadgeColor(c.type)}>
                      {c.type}
                    </Badge>
                    <span className={styles.changeTitle}>{c.title}</span>
                  </div>
                  <div className={styles.changeDesc}>{c.description}</div>

                  {(c.huRefs.length > 0 || c.prRefs.length > 0) && (
                    <div className={styles.refs}>
                      {c.huRefs.map((h) => (
                        <span
                          key={h}
                          className={`${styles.refChip} ${styles.refChipJira}`}
                        >
                          <TicketDiagonal20Regular style={{ fontSize: '12px' }} />
                          {h}
                        </span>
                      ))}
                      {c.prRefs.map((pr) => (
                        <span
                          key={pr}
                          className={`${styles.refChip} ${styles.refChipPR}`}
                        >
                          <BranchFork20Regular style={{ fontSize: '12px' }} />
                          {pr}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.meta}>
                    <span className={styles.author}>
                      <Avatar
                        name={c.author.name}
                        initials={c.author.initials}
                        color="brand"
                        size={20}
                      />
                      {c.author.name}
                    </span>
                    <span className={styles.metaBlock}>
                      ambiente: <strong>{c.environment}</strong>
                    </span>
                    <span className={styles.metaBlock}>
                      versión: <strong>{c.version}</strong>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
