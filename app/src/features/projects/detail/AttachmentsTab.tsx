import { useMemo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ArrowDownload20Regular,
  ArrowUpload20Regular,
  Attach20Regular,
  Code20Regular,
  Delete20Regular,
  Document20Regular,
  DocumentPdf20Regular,
  DocumentTable20Regular,
  Image20Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { Attachment, Project, ProjectMember } from '../types'
import { mockAttachments } from '../mockData'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

type Category = 'all' | 'image' | 'pdf' | 'code' | 'sheet' | 'other'

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
  headMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
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
  toolbar: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    maxWidth: '360px',
    minWidth: '220px',
  },
  filters: {
    display: 'flex',
    gap: '6px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
    position: 'relative',
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
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    paddingTop: '10px',
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  uploader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
  },
  uploaderName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    display: 'flex',
    gap: '4px',
  },
  empty: {
    padding: '56px 20px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '10px',
  },
})

interface Category2 {
  category: Category
  color: string
  icon: ReactNode
}

function categoryOf(name: string): Category2 {
  const ext = (name.split('.').pop() ?? '').toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return { category: 'image', color: '#7C3AED', icon: <Image20Regular /> }
  }
  if (ext === 'pdf') {
    return { category: 'pdf', color: '#E11D48', icon: <DocumentPdf20Regular /> }
  }
  if (
    ['sql', 'js', 'ts', 'tsx', 'py', 'cs', 'java', 'json', 'yml', 'yaml', 'xml', 'drawio', 'txt'].includes(
      ext,
    )
  ) {
    return { category: 'code', color: '#0395A9', icon: <Code20Regular /> }
  }
  if (['xlsx', 'csv', 'xls'].includes(ext)) {
    return { category: 'sheet', color: '#059669', icon: <DocumentTable20Regular /> }
  }
  return { category: 'other', color: '#64748B', icon: <Document20Regular /> }
}

const FILTERS: Array<{ key: Category; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'image', label: 'Imágenes' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'code', label: 'Código' },
  { key: 'sheet', label: 'Hojas de cálculo' },
  { key: 'other', label: 'Otros' },
]

const MOCK_UPLOAD_SAMPLES = [
  'evidencia_ambiente_dev.png',
  'changelog_release_1.5.3.md',
  'estimacion_scoring.xlsx',
  'contrato_api_v2.json',
  'script_rollback.sql',
]

function randomId(): string {
  return `att-${Math.random().toString(36).slice(2, 9)}`
}

function todayLabel(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

interface AttachmentsTabProps {
  project: Project
}

export const AttachmentsTab: FC<AttachmentsTabProps> = ({ project }) => {
  const styles = useStyles()
  const { user } = useAuth()
  const initial = mockAttachments[project.id] ?? mockAttachments['p-001'] ?? []
  const [items, setItems] = useState<Attachment[]>(initial)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Category>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((a) => {
      const c = categoryOf(a.name)
      if (filter !== 'all' && c.category !== filter) return false
      if (q && !a.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, query, filter])

  const handleUpload = () => {
    const name =
      MOCK_UPLOAD_SAMPLES[items.length % MOCK_UPLOAD_SAMPLES.length] ?? 'archivo.txt'
    const uploadedBy: ProjectMember | undefined = user
      ? { id: user.id, name: user.displayName, initials: user.initials }
      : undefined
    const newItem: Attachment = {
      id: randomId(),
      name,
      size: `${Math.floor(Math.random() * 800 + 40)} KB`,
      uploadedAt: todayLabel(),
      uploadedBy,
    }
    setItems((prev) => [newItem, ...prev])
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id))
  }

  const counts: Record<Category, number> = {
    all: items.length,
    image: 0,
    pdf: 0,
    code: 0,
    sheet: 0,
    other: 0,
  }
  for (const a of items) {
    counts[categoryOf(a.name).category]++
  }

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.headMain}>
          <div className={styles.title}>Adjuntos del proyecto</div>
          <div className={styles.subtitle}>
            // {filtered.length} de {items.length} archivos
          </div>
        </div>
        <Button
          appearance="primary"
          icon={<ArrowUpload20Regular />}
          onClick={handleUpload}
        >
          Subir archivo
        </Button>
      </div>

      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          placeholder="Buscar archivo por nombre…"
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, d) => setQuery(d.value)}
        />
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.filterChip} ${
                filter === f.key ? styles.filterChipActive : ''
              }`}
              onClick={() => setFilter(f.key)}
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
          <div>
            Sin archivos{query ? ` para "${query}"` : ''}
            {filter !== 'all' ? ` en la categoría seleccionada` : ''}.
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((a) => {
            const c = categoryOf(a.name)
            return (
              <div key={a.id} className={styles.card}>
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
                <div className={styles.footer}>
                  <span className={styles.uploader}>
                    {a.uploadedBy && (
                      <Avatar
                        name={a.uploadedBy.name}
                        initials={a.uploadedBy.initials}
                        color="brand"
                        size={16}
                      />
                    )}
                    <span className={styles.uploaderName}>
                      {a.uploadedBy?.name ?? 'desconocido'}
                    </span>
                  </span>
                  <span className={styles.actions}>
                    <Button
                      size="small"
                      appearance="subtle"
                      icon={<ArrowDownload20Regular />}
                      aria-label="Descargar"
                    />
                    <Button
                      size="small"
                      appearance="subtle"
                      icon={<Delete20Regular />}
                      aria-label="Eliminar"
                      onClick={() => handleDelete(a.id)}
                    />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
