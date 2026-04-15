import { useEffect, useMemo, useState } from 'react'
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
  Dropdown,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Option,
  Select,
  Tab,
  TabList,
  Textarea,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowUndo20Regular,
  BookOpen20Regular,
  Checkmark20Regular,
  Dismiss20Regular,
  Edit20Regular,
  History20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { MarkdownContent } from '@/shared/components/MarkdownContent'
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
  toolbar: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },
  toolbarLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: MONO,
  },
  projectDropdown: {
    minWidth: '280px',
  },
  spacer: {
    flex: 1,
  },
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    marginBottom: '0',
  },
  tabs: {
    flex: 1,
    overflowX: 'auto',
  },
  newSectionBtn: {
    flexShrink: 0,
    marginBottom: '6px',
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '0',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 280px)',
  },
  viewerHead: {
    padding: '22px 28px',
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
    fontSize: '24px',
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
    padding: '28px 32px',
    overflowY: 'auto',
    flex: 1,
    maxWidth: '900px',
    width: '100%',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  contentPre: {
    margin: 0,
    fontFamily: MONO,
    fontSize: '13px',
    lineHeight: 1.75,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  editorFooter: {
    padding: '14px 28px',
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
    minHeight: '420px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '80px 48px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontSize: '24px',
  },
  emptyTitle: {
    fontWeight: 600,
    fontSize: '16px',
    color: tokens.colorNeutralForeground1,
  },
  emptyText: {
    fontSize: '13px',
    maxWidth: '420px',
  },
  historyVersion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '4px 0',
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
  historicBanner: {
    padding: '12px 16px',
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
    fontSize: '12px',
    borderRadius: '8px',
    margin: '16px 28px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  dialogSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  projectMeta: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    mockProjects[0]?.id ?? '',
  )
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

  useEffect(() => {
    if (projectSections.length === 0) {
      setSelectedSectionId(null)
      return
    }
    const exists = projectSections.find((s) => s.id === selectedSectionId)
    if (!exists) {
      setSelectedSectionId(projectSections[0].id)
    }
  }, [projectSections, selectedSectionId])

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
    viewingVersionId !==
      selectedSection.versions[selectedSection.versions.length - 1]?.id

  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId)

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedSectionId(null)
    setEditMode(false)
    setViewingVersionId(null)
  }

  const handleTabSelect = (_e: SelectTabEvent, data: SelectTabData) => {
    setSelectedSectionId(String(data.value))
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

      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>// proyecto</span>
        <Dropdown
          className={styles.projectDropdown}
          value={selectedProject?.name ?? ''}
          selectedOptions={[selectedProjectId]}
          onOptionSelect={(_, data) => {
            if (data.optionValue) handleSelectProject(data.optionValue)
          }}
        >
          {mockProjects.map((p) => {
            const count = sections.filter((s) => s.projectId === p.id).length
            return (
              <Option key={p.id} value={p.id} text={p.name}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className={styles.projectMeta}>
                    {p.code} · {count} {count === 1 ? 'sección' : 'secciones'}
                  </div>
                </div>
              </Option>
            )
          })}
        </Dropdown>
        <div className={styles.spacer} />
      </div>

      <div className={styles.tabsRow}>
        <div className={styles.tabs}>
          {projectSections.length > 0 && (
            <TabList
              selectedValue={selectedSectionId ?? ''}
              onTabSelect={handleTabSelect}
              size="medium"
            >
              {projectSections.map((s) => {
                const last = s.versions[s.versions.length - 1]
                return (
                  <Tab key={s.id} value={s.id}>
                    {s.title}
                    <Badge
                      appearance="tint"
                      size="extra-small"
                      style={{ marginLeft: 8 }}
                    >
                      v{last?.number ?? 1}
                    </Badge>
                  </Tab>
                )
              })}
            </TabList>
          )}
        </div>
        <Button
          className={styles.newSectionBtn}
          size="small"
          appearance="primary"
          icon={<Add20Regular />}
          onClick={() => setNewDialogOpen(true)}
          disabled={!selectedProjectId}
        >
          Nueva sección
        </Button>
      </div>

      <div className={styles.panel}>
        {!selectedSection && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BookOpen20Regular />
            </div>
            <div className={styles.emptyTitle}>Sin secciones aún</div>
            <div className={styles.emptyText}>
              Este proyecto no tiene secciones de documentación. Usa{' '}
              <strong>Nueva sección</strong> para crear la primera.
            </div>
          </div>
        )}

        {selectedSection && activeVersion && (
          <>
            <div className={styles.viewerHead}>
              <div className={styles.viewerKicker}>
                // {selectedProject?.code ?? ''} · {selectedSection.kind}
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
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <Field label="Contenido (markdown plano)">
                    <Textarea
                      className={styles.editorTextarea}
                      value={editorContent}
                      onChange={(_, d) => setEditorContent(d.value)}
                      resize="vertical"
                      rows={22}
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
                <MarkdownContent content={activeVersion.content} />
              )}
            </div>

            {editMode && (
              <div className={styles.editorFooter}>
                <span className={styles.editorFooterHint}>
                  // se creará v
                  {(selectedSection.versions[selectedSection.versions.length - 1]
                    ?.number ?? 0) + 1}
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
