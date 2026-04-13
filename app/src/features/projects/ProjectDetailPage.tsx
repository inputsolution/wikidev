import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Tab,
  TabList,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import { ChevronLeft20Regular } from '@fluentui/react-icons'
import { mockProjects } from './mockData'
import type { ProjectStatus } from './types'
import { ChangelogTab } from './detail/ChangelogTab'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  breadcrumb: {
    marginBottom: '14px',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    marginBottom: '12px',
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    paddingBottom: '20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaLabel: {
    color: tokens.colorNeutralForeground4,
  },
  metaValue: {
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
  },
  code: {
    fontFamily: MONO,
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  description: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    maxWidth: '720px',
    lineHeight: 1.55,
  },
  tabs: {
    marginBottom: '24px',
  },
  placeholder: {
    padding: '64px 24px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: '10px',
  },
})

type TabKey = 'resumen' | 'documentacion' | 'bitacora' | 'hu' | 'pr' | 'adjuntos'

function statusBadge(
  status: ProjectStatus,
): { color: 'success' | 'warning' | 'subtle'; appearance: 'tint' } {
  if (status === 'Activo') return { color: 'success', appearance: 'tint' }
  if (status === 'En pausa') return { color: 'warning', appearance: 'tint' }
  return { color: 'subtle', appearance: 'tint' }
}

export function ProjectDetailPage() {
  const styles = useStyles()
  const { projectId } = useParams<{ projectId: string }>()
  const [selected, setSelected] = useState<TabKey>('bitacora')

  const project = mockProjects.find((p) => p.id === projectId)
  if (!project) return <Navigate to="/proyectos" replace />

  const sb = statusBadge(project.status)

  const onTabSelect = (_e: SelectTabEvent, data: SelectTabData) => {
    setSelected(data.value as TabKey)
  }

  return (
    <>
      <Link to="/proyectos" className={styles.back}>
        <ChevronLeft20Regular /> Volver a proyectos
      </Link>

      <Breadcrumb className={styles.breadcrumb} size="small">
        <BreadcrumbItem>
          <BreadcrumbButton href="/proyectos">Proyectos</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current>{project.name}</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.title}>{project.name}</div>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Código:</span>
              <span className={styles.code}>{project.code}</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Estado:</span>
              <Badge appearance={sb.appearance} color={sb.color}>
                {project.status}
              </Badge>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Responsable:</span>
              <Avatar
                name={project.owner.name}
                initials={project.owner.initials}
                color="brand"
                size={20}
              />
              <span className={styles.metaValue}>{project.owner.name}</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Última actualización:</span>
              <span className={styles.metaValue}>{project.lastUpdate}</span>
            </span>
          </div>
          <div className={styles.description}>{project.description}</div>
        </div>
      </div>

      <TabList
        className={styles.tabs}
        selectedValue={selected}
        onTabSelect={onTabSelect}
        size="medium"
      >
        <Tab value="resumen">Resumen</Tab>
        <Tab value="documentacion">Documentación</Tab>
        <Tab value="bitacora">Bitácora</Tab>
        <Tab value="hu">HU Relacionadas</Tab>
        <Tab value="pr">PR Relacionados</Tab>
        <Tab value="adjuntos">Adjuntos</Tab>
      </TabList>

      {selected === 'bitacora' && <ChangelogTab project={project} />}
      {selected !== 'bitacora' && (
        <div className={styles.placeholder}>
          Pestaña <strong>{selected}</strong> pendiente de implementar.
        </div>
      )}
    </>
  )
}
