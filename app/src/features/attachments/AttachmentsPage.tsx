import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
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
  Attach20Regular,
  Code20Regular,
  Document20Regular,
  DocumentPdf20Regular,
  DocumentTable20Regular,
  FolderOpen20Regular,
  Image20Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockAttachments, mockProjects } from '@/features/projects/mockData'
import type { Attachment } from '@/features/projects/types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

type Category = 'all' | 'image' | 'pdf' | 'code' | 'sheet' | 'other'

interface GlobalAttachment extends Attachment {
  projectId: string
  projectName: string
  projectCode: string
}

function categoryOf(name: string): {
  category: Category
  color: string
  icon: ReactNode
} {
  const ext = (name.split('.').pop() ?? '').toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return { category: 'image', color: '#7C3AED', icon: <Image20Regular /> }
  }
  if (ext === 'pdf') {
    return { category: 'pdf', color: '#E11D48', icon: <DocumentPdf20Regular /> }
  }
  if (
    [
      'sql',
      'js',
      'ts',
      'tsx',
      'py',
      'cs',
      'java',
      'json',
      'yml',
      'yaml',
      'xml',
      'drawio',
      'txt',
      'md',
    ].includes(ext)
  ) {
    return { category: 'code', color: '#0395A9', icon: <Code20Regular /> }
  }
  if (['xlsx', 'csv', 'xls'].includes(ext)) {
    return { category: 'sheet', color: '#059669', icon: <DocumentTable20Regular /> }
  }
  return { category: 'other', color: '#64748B', icon: <Document20Regular /> }
}

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    maxWidth: '360px',
    minWidth: '220px',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '5px 12px',
    borderRadius: '999px',
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
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    fontFamily: MONO,
    cursor: 'pointer',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  filterChipActive: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
  },
  projectDropdown: {
    minWidth: '200px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textDecoration: 'none',
    color: 'inherit',
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
    gap: '10px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  nameWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: 1,
  },
  name: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    fontFamily: MONO,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
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
    fontFamily: MONO,
    fontWeight: 600,
    width: 'fit-content',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '10px',
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
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

const FILTERS: Array<{ key: Category; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'image', label: 'Imágenes' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'code', label: 'Código' },
  { key: 'sheet', label: 'Hojas de cálculo' },
  { key: 'other', label: 'Otros' },
]

export function AttachmentsPage() {
  const styles = useStyles()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')

  const all: GlobalAttachment[] = useMemo(() => {
    const list: GlobalAttachment[] = []
    for (const [projectId, files] of Object.entries(mockAttachments)) {
      const project = mockProjects.find((p) => p.id === projectId)
      if (!project) continue
      for (const f of files) {
        list.push({
          ...f,
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
    return all.filter((a) => {
      if (projectFilter !== 'all' && a.projectId !== projectFilter) return false
      if (categoryFilter !== 'all' && categoryOf(a.name).category !== categoryFilter)
        return false
      if (q && !a.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [all, query, categoryFilter, projectFilter])

  const counts: Record<Category, number> = {
    all: all.length,
    image: 0,
    pdf: 0,
    code: 0,
    sheet: 0,
    other: 0,
  }
  for (const a of all) {
    counts[categoryOf(a.name).category]++
  }

  return (
    <>
      <PageHeader
        title="Adjuntos"
        description="Repositorio global de archivos cargados en los proyectos."
      />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total archivos</div>
          <div className={styles.statValue}>{all.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Imágenes</div>
          <div className={styles.statValue}>{counts.image}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Código</div>
          <div className={styles.statValue}>{counts.code}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>PDFs</div>
          <div className={styles.statValue}>{counts.pdf}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          placeholder="Buscar archivo por nombre…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
        <Dropdown
          className={styles.projectDropdown}
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
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.filterChip} ${
                categoryFilter === f.key ? styles.filterChipActive : ''
              }`}
              onClick={() => setCategoryFilter(f.key)}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <Badge
                  appearance="tint"
                  size="extra-small"
                  style={{ marginLeft: 6 }}
                >
                  {counts[f.key]}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <Attach20Regular style={{ fontSize: '20px', marginBottom: 8 }} />
          <div>Sin archivos que coincidan con los filtros.</div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((a) => {
            const c = categoryOf(a.name)
            return (
              <Link
                key={`${a.projectId}-${a.id}`}
                to={`/proyectos/${a.projectId}`}
                className={styles.card}
              >
                <span className={styles.projectPill}>
                  <FolderOpen20Regular style={{ fontSize: '11px' }} />
                  {a.projectCode} · {a.projectName}
                </span>
                <div className={styles.cardHead}>
                  <span
                    className={styles.iconWrap}
                    style={{ backgroundColor: c.color }}
                  >
                    {c.icon}
                  </span>
                  <div className={styles.nameWrap}>
                    <span className={styles.name}>{a.name}</span>
                    <span className={styles.meta}>
                      {a.size} · {a.uploadedAt}
                    </span>
                  </div>
                </div>
                {a.uploadedBy && (
                  <div className={styles.footer}>
                    <Avatar
                      name={a.uploadedBy.name}
                      initials={a.uploadedBy.initials}
                      color="brand"
                      size={16}
                    />
                    <span>{a.uploadedBy.name}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
