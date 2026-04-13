import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Select,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular,
  Attach20Regular,
  BranchFork20Regular,
  Checkmark20Regular,
  Comment20Regular,
  Dismiss24Regular,
  TicketDiagonal20Regular,
} from '@fluentui/react-icons'
import type {
  ChangeType,
  Environment,
  NewChangeDraft,
  Project,
  ProjectChange,
} from '../types'
import { emptyNewChangeDraft } from '../types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const CHANGE_TYPES: ChangeType[] = [
  'Mejora',
  'Bugfix',
  'Refactor',
  'Feature',
  'Docs',
]

const ENVIRONMENTS: Environment[] = ['DEV', 'QA', 'UAT', 'PROD']

interface StepDef {
  key: StepKey
  title: string
  subtitle: string
}

type StepKey =
  | 'detalles'
  | 'tecnico'
  | 'referencias'
  | 'adjuntos'
  | 'revisar'

const STEPS: StepDef[] = [
  { key: 'detalles', title: 'Detalles', subtitle: 'Tipo y descripción funcional' },
  { key: 'tecnico', title: 'Técnico', subtitle: 'Detalle técnico, ambiente y versión' },
  { key: 'referencias', title: 'Referencias', subtitle: 'HU de Jira y PR de DevOps' },
  { key: 'adjuntos', title: 'Adjuntos', subtitle: 'Archivos y evidencias' },
  { key: 'revisar', title: 'Revisar', subtitle: 'Confirmar y guardar' },
]

const useStyles = makeStyles({
  drawer: {
    width: '640px',
    maxWidth: '95vw',
  },
  headerKicker: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorBrandForeground1,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  stepper: {
    display: 'flex',
    gap: '4px',
    padding: '16px 24px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  step: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 10px',
    borderRadius: '6px',
    position: 'relative',
  },
  stepLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  stepLabelActive: {
    color: tokens.colorBrandForeground1,
  },
  stepLabelDone: {
    color: '#059669',
  },
  stepTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  stepBar: {
    height: '3px',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginTop: '4px',
  },
  stepBarActive: {
    backgroundColor: tokens.colorBrandBackground,
  },
  stepBarDone: {
    backgroundColor: '#10B981',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  sectionHint: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '12px',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  },
  typeCard: {
    padding: '12px 14px',
    borderRadius: '10px',
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
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  typeCardActive: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    boxShadow: '0 0 0 3px rgba(3, 149, 169, 0.12)',
  },
  input: {
    borderRadius: '8px',
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
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '140ms',
    ':focus-within': {
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
      boxShadow: '0 0 0 3px rgba(3, 149, 169, 0.12)',
    },
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
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
  chipRemove: {
    cursor: 'pointer',
    color: tokens.colorNeutralForeground3,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  chipInput: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  conditionalBlock: {
    marginTop: '8px',
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandBackground,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
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
  },
  toggleLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  toggleLabelTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  toggleLabelHint: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  reviewCard: {
    borderRadius: '10px',
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
    padding: '16px 18px',
  },
  reviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    paddingBottom: '10px',
    marginBottom: '10px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dashed',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  reviewLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
    flexShrink: 0,
    minWidth: '140px',
  },
  reviewValue: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    textAlign: 'right',
    fontFamily: MONO,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  stepHint: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
  },
  actionsRight: {
    display: 'flex',
    gap: '8px',
  },
  filePicker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '32px 20px',
    borderRadius: '10px',
    borderTopWidth: '2px',
    borderRightWidth: '2px',
    borderBottomWidth: '2px',
    borderLeftWidth: '2px',
    borderTopStyle: 'dashed',
    borderRightStyle: 'dashed',
    borderBottomStyle: 'dashed',
    borderLeftStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground2,
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '10px',
  },
  fileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    fontSize: '12px',
    fontFamily: MONO,
    color: tokens.colorNeutralForeground2,
  },
})

interface NewChangeDrawerProps {
  open: boolean
  project: Project
  onClose: () => void
  onSave: (change: ProjectChange) => void
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

function randomId(): string {
  return `c-${Math.random().toString(36).slice(2, 9)}`
}

function buildChange(
  draft: NewChangeDraft,
  project: Project,
): ProjectChange | null {
  if (!draft.type || !draft.environment) return null
  return {
    id: randomId(),
    date: todayLabel(),
    type: draft.type,
    title: draft.title,
    description: draft.description,
    technicalDescription: draft.technicalDescription || undefined,
    impactedComponents:
      draft.impactedComponents.length > 0 ? draft.impactedComponents : undefined,
    huRefs: draft.hasHu ? draft.huRefs : [],
    prRefs: draft.hasPr ? draft.prRefs : [],
    author: project.owner,
    environment: draft.environment,
    version: draft.version || 'sin versión',
    attachments:
      draft.hasAttachments && draft.attachments.length > 0
        ? draft.attachments.map((a, i) => ({
            id: `att-${i}`,
            name: a.name,
            size: a.size,
            uploadedAt: todayLabel(),
          }))
        : undefined,
    comment:
      draft.hasComment && draft.comment.trim().length > 0
        ? { author: project.owner, text: draft.comment.trim() }
        : undefined,
  }
}

export function NewChangeDrawer({
  open,
  project,
  onClose,
  onSave,
}: NewChangeDrawerProps) {
  const styles = useStyles()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<NewChangeDraft>(emptyNewChangeDraft)
  const [componentInput, setComponentInput] = useState('')
  const [huInput, setHuInput] = useState('')
  const [prInput, setPrInput] = useState('')

  const update = <K extends keyof NewChangeDraft>(
    key: K,
    value: NewChangeDraft[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const canNext = useMemo(() => {
    if (step === 0) return !!draft.type && draft.title.trim().length >= 4
    if (step === 1) return !!draft.environment && draft.version.trim().length > 0
    return true
  }, [step, draft])

  const reset = () => {
    setDraft(emptyNewChangeDraft)
    setStep(0)
    setComponentInput('')
    setHuInput('')
    setPrInput('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSave = () => {
    const change = buildChange(draft, project)
    if (!change) return
    onSave(change)
    reset()
    onClose()
  }

  const addComponent = () => {
    const v = componentInput.trim()
    if (!v) return
    if (draft.impactedComponents.includes(v)) {
      setComponentInput('')
      return
    }
    update('impactedComponents', [...draft.impactedComponents, v])
    setComponentInput('')
  }

  const removeComponent = (name: string) => {
    update(
      'impactedComponents',
      draft.impactedComponents.filter((c) => c !== name),
    )
  }

  const addHu = () => {
    const v = huInput.trim().toUpperCase()
    if (!v) return
    if (draft.huRefs.includes(v)) {
      setHuInput('')
      return
    }
    update('huRefs', [...draft.huRefs, v])
    setHuInput('')
  }

  const removeHu = (ref: string) => {
    update('huRefs', draft.huRefs.filter((r) => r !== ref))
  }

  const addPr = () => {
    const v = prInput.trim().toUpperCase()
    if (!v) return
    if (draft.prRefs.includes(v)) {
      setPrInput('')
      return
    }
    update('prRefs', [...draft.prRefs, v])
    setPrInput('')
  }

  const removePr = (ref: string) => {
    update('prRefs', draft.prRefs.filter((r) => r !== ref))
  }

  const addMockFile = () => {
    const names = [
      'evidencia_qa.png',
      'log_error.txt',
      'script_migracion.sql',
      'diagrama.pdf',
    ]
    const name = names[draft.attachments.length % names.length]
    const size = `${Math.floor(Math.random() * 800 + 120)} KB`
    update('attachments', [...draft.attachments, { name, size }])
  }

  const removeFile = (index: number) => {
    update(
      'attachments',
      draft.attachments.filter((_, i) => i !== index),
    )
  }

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <Drawer
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) handleClose()
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
              onClick={handleClose}
            />
          }
        >
          <div className={styles.headerKicker}>// {project.code}</div>
          Nuevo cambio en bitácora
        </DrawerHeaderTitle>
      </DrawerHeader>

      <div className={styles.stepper}>
        {STEPS.map((s, i) => {
          const isActive = i === step
          const isDone = i < step
          return (
            <div key={s.key} className={styles.step}>
              <span
                className={`${styles.stepLabel} ${
                  isActive
                    ? styles.stepLabelActive
                    : isDone
                      ? styles.stepLabelDone
                      : ''
                }`}
              >
                Paso {i + 1}
              </span>
              <span className={styles.stepTitle}>{s.title}</span>
              <div
                className={`${styles.stepBar} ${
                  isActive
                    ? styles.stepBarActive
                    : isDone
                      ? styles.stepBarDone
                      : ''
                }`}
              />
            </div>
          )
        })}
      </div>

      <DrawerBody>
        <div className={styles.body}>
          {step === 0 && (
            <>
              <div>
                <div className={styles.sectionTitle}>Tipo de cambio</div>
                <div className={styles.sectionHint}>
                  Selecciona la categoría que mejor describe el cambio.
                </div>
                <div className={styles.typeGrid}>
                  {CHANGE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.typeCard} ${
                        draft.type === t ? styles.typeCardActive : ''
                      }`}
                      onClick={() => update('type', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Título del cambio" required>
                <Input
                  className={styles.input}
                  placeholder="Ej: Corrección de validación en login SSO"
                  value={draft.title}
                  onChange={(_, d) => update('title', d.value)}
                />
              </Field>

              <Field label="Descripción funcional" required>
                <Textarea
                  placeholder="¿Qué hace el cambio desde el punto de vista del usuario o del negocio?"
                  rows={4}
                  value={draft.description}
                  onChange={(_, d) => update('description', d.value)}
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Descripción técnica">
                <Textarea
                  placeholder="Detalle técnico del cambio: archivos, endpoints, queries, etc."
                  rows={5}
                  value={draft.technicalDescription}
                  onChange={(_, d) => update('technicalDescription', d.value)}
                />
              </Field>

              <Field label="Componentes impactados">
                <div className={styles.chipsRow}>
                  {draft.impactedComponents.map((c) => (
                    <span key={c} className={styles.chip}>
                      {c}
                      <span
                        className={styles.chipRemove}
                        onClick={() => removeComponent(c)}
                        role="button"
                        tabIndex={0}
                      >
                        <Dismiss24Regular style={{ fontSize: '12px' }} />
                      </span>
                    </span>
                  ))}
                </div>
                <div className={styles.chipInput}>
                  <Input
                    className={styles.input}
                    placeholder="Ej: auth-service, users.sql, login.tsx"
                    value={componentInput}
                    onChange={(_, d) => setComponentInput(d.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addComponent()
                      }
                    }}
                  />
                  <Button icon={<Add20Regular />} onClick={addComponent}>
                    Agregar
                  </Button>
                </div>
              </Field>

              <div className={styles.row}>
                <Field label="Ambiente" required>
                  <Select
                    value={draft.environment ?? ''}
                    onChange={(_, d) =>
                      update('environment', (d.value || null) as Environment | null)
                    }
                  >
                    <option value="">Selecciona…</option>
                    {ENVIRONMENTS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Versión" required>
                  <Input
                    className={styles.input}
                    placeholder="1.5.2"
                    value={draft.version}
                    onChange={(_, d) => update('version', d.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.toggleRow}>
                <Checkbox
                  checked={draft.hasHu}
                  onChange={(_, d) => update('hasHu', !!d.checked)}
                />
                <div className={styles.toggleLabel}>
                  <span className={styles.toggleLabelTitle}>
                    ¿Tiene HU en Jira?
                  </span>
                  <span className={styles.toggleLabelHint}>
                    Vincula una o varias historias de usuario.
                  </span>
                </div>
              </div>

              {draft.hasHu && (
                <div className={styles.conditionalBlock}>
                  <div className={styles.chipsRow}>
                    {draft.huRefs.map((h) => (
                      <span key={h} className={styles.chip}>
                        <TicketDiagonal20Regular style={{ fontSize: '12px' }} />
                        {h}
                        <span
                          className={styles.chipRemove}
                          onClick={() => removeHu(h)}
                          role="button"
                          tabIndex={0}
                        >
                          <Dismiss24Regular style={{ fontSize: '12px' }} />
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className={styles.chipInput}>
                    <Input
                      className={styles.input}
                      placeholder="HU-120"
                      value={huInput}
                      onChange={(_, d) => setHuInput(d.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addHu()
                        }
                      }}
                    />
                    <Button icon={<Add20Regular />} onClick={addHu}>
                      Vincular HU
                    </Button>
                  </div>
                </div>
              )}

              <div className={styles.toggleRow}>
                <Checkbox
                  checked={draft.hasPr}
                  onChange={(_, d) => update('hasPr', !!d.checked)}
                />
                <div className={styles.toggleLabel}>
                  <span className={styles.toggleLabelTitle}>
                    ¿Tiene PR en Azure DevOps?
                  </span>
                  <span className={styles.toggleLabelHint}>
                    Vincula una o varias pull requests.
                  </span>
                </div>
              </div>

              {draft.hasPr && (
                <div className={styles.conditionalBlock}>
                  <div className={styles.chipsRow}>
                    {draft.prRefs.map((p) => (
                      <span key={p} className={styles.chip}>
                        <BranchFork20Regular style={{ fontSize: '12px' }} />
                        {p}
                        <span
                          className={styles.chipRemove}
                          onClick={() => removePr(p)}
                          role="button"
                          tabIndex={0}
                        >
                          <Dismiss24Regular style={{ fontSize: '12px' }} />
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className={styles.chipInput}>
                    <Input
                      className={styles.input}
                      placeholder="PR-450"
                      value={prInput}
                      onChange={(_, d) => setPrInput(d.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addPr()
                        }
                      }}
                    />
                    <Button icon={<Add20Regular />} onClick={addPr}>
                      Vincular PR
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.toggleRow}>
                <Checkbox
                  checked={draft.hasAttachments}
                  onChange={(_, d) => update('hasAttachments', !!d.checked)}
                />
                <div className={styles.toggleLabel}>
                  <span className={styles.toggleLabelTitle}>
                    ¿Tiene adjuntos?
                  </span>
                  <span className={styles.toggleLabelHint}>
                    Scripts, evidencias, imágenes o documentos.
                  </span>
                </div>
              </div>

              {draft.hasAttachments && (
                <div className={styles.conditionalBlock}>
                  <button
                    type="button"
                    className={styles.filePicker}
                    onClick={addMockFile}
                  >
                    <Attach20Regular style={{ fontSize: '20px' }} />
                    <strong>Agregar archivo de ejemplo</strong>
                    <span>(mock — no sube archivos reales)</span>
                  </button>
                  {draft.attachments.length > 0 && (
                    <div className={styles.fileList}>
                      {draft.attachments.map((f, i) => (
                        <div key={i} className={styles.fileRow}>
                          <span>
                            {f.name} &middot; {f.size}
                          </span>
                          <Button
                            size="small"
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => removeFile(i)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={styles.toggleRow}>
                <Checkbox
                  checked={draft.hasComment}
                  onChange={(_, d) => update('hasComment', !!d.checked)}
                />
                <div className={styles.toggleLabel}>
                  <span className={styles.toggleLabelTitle}>
                    ¿Hay observaciones del equipo?
                  </span>
                  <span className={styles.toggleLabelHint}>
                    Agrega un comentario inicial al cambio.
                  </span>
                </div>
              </div>

              {draft.hasComment && (
                <div className={styles.conditionalBlock}>
                  <Field label="">
                    <Textarea
                      placeholder="Ej: Pruebas en QA completadas correctamente."
                      rows={3}
                      value={draft.comment}
                      onChange={(_, d) => update('comment', d.value)}
                    />
                  </Field>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div className={styles.sectionTitle}>Revisar y guardar</div>
              <div className={styles.sectionHint}>
                Confirma la información antes de registrarla en la bitácora.
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Tipo</span>
                  <span className={styles.reviewValue}>
                    {draft.type && <Badge appearance="tint">{draft.type}</Badge>}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Título</span>
                  <span className={styles.reviewValue}>{draft.title || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Ambiente · versión</span>
                  <span className={styles.reviewValue}>
                    {draft.environment ?? '—'} · {draft.version || '—'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Componentes</span>
                  <span className={styles.reviewValue}>
                    {draft.impactedComponents.length > 0
                      ? draft.impactedComponents.join(', ')
                      : 'ninguno'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>HU</span>
                  <span className={styles.reviewValue}>
                    {draft.hasHu && draft.huRefs.length > 0
                      ? draft.huRefs.join(', ')
                      : '—'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>PR</span>
                  <span className={styles.reviewValue}>
                    {draft.hasPr && draft.prRefs.length > 0
                      ? draft.prRefs.join(', ')
                      : '—'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Adjuntos</span>
                  <span className={styles.reviewValue}>
                    {draft.hasAttachments && draft.attachments.length > 0
                      ? `${draft.attachments.length} archivo(s)`
                      : '—'}
                  </span>
                </div>
                <div
                  className={styles.reviewRow}
                  style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}
                >
                  <span className={styles.reviewLabel}>Comentario</span>
                  <span className={styles.reviewValue}>
                    {draft.hasComment && draft.comment.trim() ? (
                      <Comment20Regular style={{ fontSize: '14px' }} />
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </DrawerBody>

      <DrawerFooter>
        <div className={styles.footer}>
          <span className={styles.stepHint}>
            // paso {step + 1} de {STEPS.length} · {currentStep.subtitle}
          </span>
          <div className={styles.actionsRight}>
            {step > 0 && (
              <Button
                icon={<ArrowLeft20Regular />}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Atrás
              </Button>
            )}
            {!isLast && (
              <Button
                appearance="primary"
                disabled={!canNext}
                icon={<ArrowRight20Regular />}
                iconPosition="after"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              >
                Siguiente
              </Button>
            )}
            {isLast && (
              <Button
                appearance="primary"
                icon={<Checkmark20Regular />}
                onClick={handleSave}
              >
                Guardar cambio
              </Button>
            )}
          </div>
        </div>
      </DrawerFooter>
    </Drawer>
  )
}
