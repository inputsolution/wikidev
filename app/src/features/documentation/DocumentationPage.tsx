import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Select,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowUndo20Regular,
  BookOpen20Regular,
  Checkmark20Regular,
  Dismiss20Regular,
  Edit20Regular,
  History20Regular,
  DocumentText20Regular,
  FolderOpen20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockProjects } from '@/features/projects/mockData'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { ProjectMember } from '@/features/projects/types'
import { mockDocSections } from './mockData'
import {
  DEFAULT_SECTION_KINDS,
  emptyNewSectionDraft,
  type DocSection,
  type DocVersion,
  type NewSectionDraft,
  type SectionKind,
} from './types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gridTemplateColumns: '240px 260px minmax(0, 1fr)',
    gap: '16px',
    minHeight: 'calc(100vh - 180px)',
  },
  column: {
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
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  columnHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  columnTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: MONO,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    gap: '2px',
    overflowY: 'auto',
    flex: 1,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    backgroundColor: 'transparent',
    borderTopWidth: '0',
    borderRightWidth: '0',
    borderBottomWidth: '0',
    borderLeftWidth: '0',
    color: tokens.colorNeutralForeground2,
    transition: 'background-color 140ms ease, color 140ms ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
    },
  },
  rowActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2,
      color: tokens.colorBrandForeground1,
    },
  },
  rowMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: 1,
  },
  rowTitle: {
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowSub: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
  },
  icon: {
    color: 'currentColor',
    flexShrink: 0,
  },
  emptyList: {
    padding: '32px 16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground4,
    fontSize: '12px',
  },
  viewer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  viewerHead: {
    padding: '20px 24px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  viewerKicker: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  viewerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  viewerTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
  },
  viewerActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  viewerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    flexWrap: 'wrap',
  },
  viewerMetaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  viewerMono: {
    fontFamily: MONO,
  },
  viewerBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  contentPre: {
    margin: 0,
    fontFamily: MONO,
    fontSize: '13px',
    lineHeight: 1.65,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  editorFooter: {
    padding: '14px 24px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  editorFooterHint: {
    fontSize: '11px',
    fontFamily: MONO,
    color: tokens.colorNeutralForeground4,
  },
  editorTextarea: {
    width: '100%',
    minHeight: '360px',
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
    borderRadius: '8px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '48px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  historyVersion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px 10px',
  },
  historyVersionNumber: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
  },
  historyVersionMeta: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  dialogSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  historicBanner: {
    padding: '10px 14px',
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
    fontSize: '12px',
    borderRadius: '6px',
    margin: '0 24px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
})

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function todayLabel(): string {
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
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function authorFromUser(user: {
  id: string
  displayName: string
  initials: string
}): ProjectMember {
  return {
    id: user.id,
    name: user.displayName,
    initials: user.initials,
  }
}

export function DocumentationPage() {
  const styles = useStyles()
  const { user } = useAuth()
  const [sections, setSections] = useState<DocSection[]>(mockDocSections)
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0]?.id ?? '')
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editorContent, setEditorContent] = useState('')
  const [editorNote, setEditorNote] = useState('')
  const [viewingVersionId, setViewingVersionId] = useState<string | null>(null)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [newDraft, setNewDraft] = useState<NewSectionDraft>(emptyNewSectionDraft)

  const projectSections = useMemo(
    () => sections.filter((s) => s.projectId === selectedProjectId),
    [sections, selectedProjectId],
  )

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId) ?? null,
    [sections, selectedSectionId],
  )

  const activeVersion: DocVersion | null = useMemo(() => {
    if (!selectedSection) return null
    if (viewingVersionId) {
      return (
        selectedSection.versions.find((v) => v.id === viewingVersionId) ??
        selectedSection.versions[selectedSection.versions.length - 1]
      )
    }
    return selectedSection.versions[selectedSection.versions.length - 1]
  }, [selectedSection, viewingVersionId])

  const isHistoricView =
    !!viewingVersionId &&
    !!selectedSection &&
    viewingVersionId !== selectedSection.versions[selectedSection.versions.length - 1]?.id

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedSectionId(null)
    setEditMode(false)
    setViewingVersionId(null)
  }

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId)
    setEditMode(false)
    setViewingVersionId(null)
  }

  const handleStartEdit = () => {
    if (!activeVersion) return
    setEditorContent(activeVersion.content)
    setEditorNote('')
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditorContent('')
    setEditorNote('')
  }

  const handleSaveVersion = () => {
    if (!selectedSection || !user) return
    const last = selectedSection.versions[selectedSection.versions.length - 1]
    const newVersion: DocVersion = {
      id: randomId('ver'),
      number: (last?.number ?? 0) + 1,
      author: authorFromUser(user),
      createdAt: todayLabel(),
      note: editorNote.trim() || undefined,
      content: editorContent,
    }
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSection.id
          ? { ...s, versions: [...s.versions, newVersion] }
          : s,
      ),
    )
    setEditMode(false)
    setEditorContent('')
    setEditorNote('')
    setViewingVersionId(null)
  }

  const handleRestoreVersion = () => {
    if (!selectedSection || !viewingVersionId || !user) return
    const old = selectedSection.versions.find((v) => v.id === viewingVersionId)
    if (!old) return
    const last = selectedSection.versions[selectedSection.versions.length - 1]
    const restored: DocVersion = {
      id: randomId('ver'),
      number: (last?.number ?? 0) + 1,
      author: authorFromUser(user),
      createdAt: todayLabel(),
      note: `Restauración de v${old.number}`,
      content: old.content,
    }
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSection.id
          ? { ...s, versions: [...s.versions, restored] }
          : s,
      ),
    )
    setViewingVersionId(null)
  }

  const handleCreateSection = () => {
    if (!selectedProjectId || !user) return
    if (newDraft.title.trim().length < 3) return
    const section: DocSection = {
      id: randomId('sec'),
      projectId: selectedProjectId,
      kind: newDraft.kind,
      title: newDraft.title.trim(),
      versions: [
        {
          id: randomId('ver'),
          number: 1,
          author: authorFromUser(user),
          createdAt: todayLabel(),
          note: 'Versión inicial',
          content:
            newDraft.initialContent ||
            `# ${newDraft.title.trim()}\n\nContenido inicial de la sección.`,
        },
      ],
    }
    setSections((prev) => [...prev, section])
    setSelectedSectionId(section.id)
    setNewDraft(emptyNewSectionDraft)
    setNewDialogOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Documentación"
        description="Editor estructurado por proyecto con secciones y versionado."
      />

      <div className={styles.layout}>
        {/* Columna 1: Proyectos */}
        <div className={styles.column}>
          <div className={styles.columnHead}>
            <span className={styles.columnTitle}>// proyectos</span>
          </div>
          <div className={styles.list}>
            {mockProjects.map((p) => {
              const isActive = p.id === selectedProjectId
              const count = sections.filter((s) => s.projectId === p.id).length
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
                  onClick={() => handleSelectProject(p.id)}
                >
                  <FolderOpen20Regular className={styles.icon} />
                  <div className={styles.rowMain}>
                    <span className={styles.rowTitle}>{p.name}</span>
                    <span className={styles.rowSub}>
                      {p.code} · {count} {count === 1 ? 'sección' : 'secciones'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Columna 2: Secciones */}
        <div className={styles.column}>
          <div className={styles.columnHead}>
            <span className={styles.columnTitle}>// secciones</span>
            <Button
              size="small"
              appearance="primary"
              icon={<Add20Regular />}
              onClick={() => setNewDialogOpen(true)}
              disabled={!selectedProjectId}
            >
              Nueva
            </Button>
          </div>
          <div className={styles.list}>
            {projectSections.length === 0 && (
              <div className={styles.emptyList}>
                Este proyecto aún no tiene secciones.
                <br />
                Usa <strong>Nueva</strong> para crear la primera.
              </div>
            )}
            {projectSections.map((s) => {
              const isActive = s.id === selectedSectionId
              const lastVersion = s.versions[s.versions.length - 1]
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
                  onClick={() => handleSelectSection(s.id)}
                >
                  <DocumentText20Regular className={styles.icon} />
                  <div className={styles.rowMain}>
                    <span className={styles.rowTitle}>{s.title}</span>
                    <span className={styles.rowSub}>
                      v{lastVersion?.number ?? 1} · {lastVersion?.createdAt}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Columna 3: Viewer / Editor */}
        <div className={`${styles.column} ${styles.viewer}`}>
          {!selectedSection && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <BookOpen20Regular />
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>
                Selecciona una sección
              </div>
              <div style={{ fontSize: '13px', maxWidth: '360px' }}>
                Elige un proyecto y luego una sección para ver su documentación. Puedes crear
                nuevas secciones o guardar una nueva versión del contenido.
              </div>
            </div>
          )}

          {selectedSection && activeVersion && (
            <>
              <div className={styles.viewerHead}>
                <div className={styles.viewerKicker}>
                  // {mockProjects.find((p) => p.id === selectedSection.projectId)?.code ?? ''}{' '}
                  · {selectedSection.kind}
                </div>
                <div className={styles.viewerTitleRow}>
                  <span className={styles.viewerTitle}>{selectedSection.title}</span>
                  {!editMode && (
                    <div className={styles.viewerActions}>
                      <Menu>
                        <MenuTrigger disableButtonEnhancement>
                          <Button icon={<History20Regular />}>
                            Historial ({selectedSection.versions.length})
                          </Button>
                        </MenuTrigger>
                        <MenuPopover>
                          <MenuList>
                            {[...selectedSection.versions]
                              .slice()
                              .reverse()
                              .map((v) => (
                                <MenuItem
                                  key={v.id}
                                  onClick={() => setViewingVersionId(v.id)}
                                >
                                  <div className={styles.historyVersion}>
                                    <span className={styles.historyVersionNumber}>
                                      v{v.number}
                                    </span>
                                    <span className={styles.historyVersionMeta}>
                                      {v.author.name} · {v.createdAt}
                                      {v.note ? ` · ${v.note}` : ''}
                                    </span>
                                  </div>
                                </MenuItem>
                              ))}
                          </MenuList>
                        </MenuPopover>
                      </Menu>
                      <Button
                        appearance="primary"
                        icon={<Edit20Regular />}
                        onClick={handleStartEdit}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
                <div className={styles.viewerMeta}>
                  <span className={styles.viewerMetaItem}>
                    <Badge appearance="tint">v{activeVersion.number}</Badge>
                  </span>
                  <span className={styles.viewerMetaItem}>
                    <Avatar
                      name={activeVersion.author.name}
                      initials={activeVersion.author.initials}
                      color="brand"
                      size={20}
                    />
                    {activeVersion.author.name}
                  </span>
                  <span className={`${styles.viewerMetaItem} ${styles.viewerMono}`}>
                    {activeVersion.createdAt}
                  </span>
                  {activeVersion.note && (
                    <span className={styles.viewerMetaItem}>· {activeVersion.note}</span>
                  )}
                </div>
              </div>

              {isHistoricView && !editMode && (
                <div className={styles.historicBanner}>
                  <span>
                    Estás viendo la <strong>versión v{activeVersion.number}</strong> (histórica).
                    La versión actual es v
                    {selectedSection.versions[selectedSection.versions.length - 1].number}.
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      size="small"
                      icon={<ArrowUndo20Regular />}
                      onClick={handleRestoreVersion}
                    >
                      Restaurar como nueva versión
                    </Button>
                    <Button
                      size="small"
                      appearance="subtle"
                      onClick={() => setViewingVersionId(null)}
                    >
                      Volver a la actual
                    </Button>
                  </div>
                </div>
              )}

              <div className={styles.viewerBody}>
                {editMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Field label="Contenido (markdown plano)">
                      <Textarea
                        className={styles.editorTextarea}
                        value={editorContent}
                        onChange={(_, d) => setEditorContent(d.value)}
                        resize="vertical"
                        rows={20}
                      />
                    </Field>
                    <Field label="Nota del cambio (opcional)">
                      <Input
                        placeholder="Ej: Se actualiza el diagrama"
                        value={editorNote}
                        onChange={(_, d) => setEditorNote(d.value)}
                      />
                    </Field>
                  </div>
                ) : (
                  <pre className={styles.contentPre}>{activeVersion.content}</pre>
                )}
              </div>

              {editMode && (
                <div className={styles.editorFooter}>
                  <span className={styles.editorFooterHint}>
                    // se creará v
                    {(selectedSection.versions[selectedSection.versions.length - 1]?.number ?? 0) + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button icon={<Dismiss20Regular />} onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                    <Button
                      appearance="primary"
                      icon={<Checkmark20Regular />}
                      onClick={handleSaveVersion}
                      disabled={editorContent.trim().length === 0}
                    >
                      Guardar nueva versión
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog: nueva sección */}
      <Dialog
        open={newDialogOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            setNewDialogOpen(false)
            setNewDraft(emptyNewSectionDraft)
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Nueva sección de documentación</DialogTitle>
            <DialogContent>
              <div className={styles.dialogSection}>
                <Field label="Título" required>
                  <Input
                    placeholder="Ej: Guía de despliegue"
                    value={newDraft.title}
                    onChange={(_, d) =>
                      setNewDraft((prev) => ({ ...prev, title: d.value }))
                    }
                  />
                </Field>
                <Field label="Tipo">
                  <Select
                    value={newDraft.kind}
                    onChange={(_, d) =>
                      setNewDraft((prev) => ({
                        ...prev,
                        kind: (d.value as SectionKind) || 'Custom',
                      }))
                    }
                  >
                    {DEFAULT_SECTION_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </Select>
                </Field>
                <Field label="Contenido inicial (opcional)">
                  <Textarea
                    rows={6}
                    placeholder="Markdown plano. Si lo dejas vacío, se generará una plantilla."
                    value={newDraft.initialContent}
                    onChange={(_, d) =>
                      setNewDraft((prev) => ({ ...prev, initialContent: d.value }))
                    }
                  />
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                icon={<Checkmark20Regular />}
                onClick={handleCreateSection}
                disabled={newDraft.title.trim().length < 3}
              >
                Crear sección
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
