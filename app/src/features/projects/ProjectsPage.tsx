import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Button,
  Caption1,
  Input,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  Search20Regular,
  FolderOpen20Regular,
  DocumentText20Regular,
  BranchFork20Regular,
  History20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockProjects } from './mockData'
import type { ProjectStatus } from './types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  search: {
    flex: 1,
    maxWidth: '460px',
    height: '44px',
    borderRadius: '10px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionDuration: '140ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      borderTopColor: tokens.colorNeutralStroke2,
      borderRightColor: tokens.colorNeutralStroke2,
      borderBottomColor: tokens.colorNeutralStroke2,
      borderLeftColor: tokens.colorNeutralStroke2,
      backgroundColor: tokens.colorNeutralBackground2,
    },
    ':focus-within': {
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
      boxShadow: '0 0 0 4px rgba(3, 149, 169, 0.12), 0 1px 2px rgba(15, 23, 42, 0.05)',
      backgroundColor: tokens.colorNeutralBackground1,
    },
    '> input': {
      fontSize: '13px',
      padding: '0 6px',
      fontFamily:
        "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace",
      letterSpacing: '0.01em',
    },
    '> span': {
      color: tokens.colorNeutralForeground3,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
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
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(3, 149, 169, 0.10), 0 2px 6px rgba(15, 23, 42, 0.05)',
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  cardHeaderMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  code: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: '17px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.01em',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  techRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  techChip: {
    fontFamily: MONO,
    fontSize: '10px',
    padding: '3px 8px',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: 'auto',
  },
  stats: {
    display: 'flex',
    gap: '14px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  stat: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  owner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ownerName: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
})

function statusBadge(status: ProjectStatus) {
  if (status === 'Activo') return { color: 'success', appearance: 'tint' } as const
  if (status === 'En pausa') return { color: 'warning', appearance: 'tint' } as const
  return { color: 'subtle', appearance: 'tint' } as const
}

export function ProjectsPage() {
  const styles = useStyles()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockProjects
    return mockProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Listado de proyectos técnicos activos con su documentación, bitácora, HU y PR."
        actions={
          <Button appearance="primary" icon={<Add20Regular />}>
            Nuevo proyecto
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          contentBefore={<Search20Regular />}
          placeholder="Buscar por nombre, código o tecnología…"
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
      </div>

      <div className={styles.grid}>
        {filtered.map((p) => {
          const sb = statusBadge(p.status)
          return (
            <Link key={p.id} to={`/proyectos/${p.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderMain}>
                  <span className={styles.code}>{p.code}</span>
                  <span className={styles.name}>{p.name}</span>
                </div>
                <Badge appearance={sb.appearance} color={sb.color}>
                  {p.status}
                </Badge>
              </div>

              <Text className={styles.description}>{p.description}</Text>

              <div className={styles.techRow}>
                {p.tech.map((t) => (
                  <span key={t} className={styles.techChip}>
                    {t}
                  </span>
                ))}
              </div>

              <div className={styles.footer}>
                <div className={styles.stats}>
                  <span className={styles.stat}>
                    <History20Regular /> {p.changesCount}
                  </span>
                  <span className={styles.stat}>
                    <BranchFork20Regular /> {p.prCount}
                  </span>
                  <span className={styles.stat}>
                    <DocumentText20Regular /> {p.docsCount}
                  </span>
                </div>
                <div className={styles.owner}>
                  <Avatar
                    name={p.owner.name}
                    initials={p.owner.initials}
                    color="brand"
                    size={24}
                  />
                  <span className={styles.ownerName}>{p.owner.name}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            color: tokens.colorNeutralForeground3,
          }}
        >
          <FolderOpen20Regular />
          <Caption1 style={{ display: 'block', marginTop: '8px' }}>
            Sin resultados para "{query}"
          </Caption1>
        </div>
      )}
    </>
  )
}
