import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular,
  Checkmark20Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons'
import type { NewProjectDraft, Project, ProjectMember } from './types'
import { emptyNewProjectDraft } from './types'
import { mockMembersPool } from './mockData'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

type StepKey = 'generales' | 'equipo' | 'revisar'

interface StepDef {
  key: StepKey
  title: string
  subtitle: string
}

const STEPS: StepDef[] = [
  { key: 'generales', title: 'Generales', subtitle: 'Código, nombre y stack' },
  { key: 'equipo', title: 'Equipo', subtitle: 'Responsable y miembros' },
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
    },
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
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
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '10px',
  },
  memberCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
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
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    textAlign: 'left',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  memberCardActive: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorBrandBackground2,
  },
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  memberName: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  memberRole: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: MONO,
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
  avatarStack: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
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
})

interface NewProjectDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (project: Project) => void
}

function slugCode(name: string, existing: number): string {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 4)
  const padded = String(existing).padStart(3, '0')
  return base ? `${base}${padded}` : `PR${padded}`
}

function buildProject(
  draft: NewProjectDraft,
  owner: ProjectMember,
): Project {
  return {
    id: `p-${Math.random().toString(36).slice(2, 9)}`,
    code: draft.code.trim().toUpperCase() || slugCode(draft.name, Date.now() % 1000),
    name: draft.name.trim(),
    description: draft.description.trim(),
    status: 'Activo',
    owner,
    lastUpdate: new Date().toLocaleDateString('es-DO'),
    changesCount: 0,
    prCount: 0,
    docsCount: 0,
    tech: draft.tech,
  }
}

export function NewProjectDrawer({ open, onClose, onSave }: NewProjectDrawerProps) {
  const styles = useStyles()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<NewProjectDraft>(emptyNewProjectDraft)
  const [techInput, setTechInput] = useState('')

  const update = <K extends keyof NewProjectDraft>(
    key: K,
    value: NewProjectDraft[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const canNext = useMemo(() => {
    if (step === 0) {
      return (
        draft.name.trim().length >= 3 &&
        draft.description.trim().length >= 10 &&
        draft.tech.length > 0
      )
    }
    if (step === 1) {
      return !!draft.ownerId
    }
    return true
  }, [step, draft])

  const reset = () => {
    setDraft(emptyNewProjectDraft)
    setStep(0)
    setTechInput('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const addTech = () => {
    const v = techInput.trim()
    if (!v) return
    if (draft.tech.includes(v)) {
      setTechInput('')
      return
    }
    update('tech', [...draft.tech, v])
    setTechInput('')
  }

  const removeTech = (name: string) => {
    update(
      'tech',
      draft.tech.filter((t) => t !== name),
    )
  }

  const toggleMember = (memberId: string) => {
    if (draft.memberIds.includes(memberId)) {
      update(
        'memberIds',
        draft.memberIds.filter((m) => m !== memberId),
      )
    } else {
      update('memberIds', [...draft.memberIds, memberId])
    }
  }

  const handleSave = () => {
    const owner = mockMembersPool.find((m) => m.id === draft.ownerId)
    if (!owner) return
    const project = buildProject(draft, owner)
    onSave(project)
    reset()
    onClose()
  }

  const ownerObj = mockMembersPool.find((m) => m.id === draft.ownerId)
  const memberObjs = mockMembersPool.filter((m) =>
    draft.memberIds.includes(m.id),
  )

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
          <div className={styles.headerKicker}>// new_project</div>
          Crear nuevo proyecto
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
                <div className={styles.sectionTitle}>Datos generales</div>
                <div className={styles.sectionHint}>
                  Información básica que identifica al proyecto dentro del portal.
                </div>
              </div>

              <Field label="Código del proyecto">
                <Input
                  className={styles.input}
                  placeholder="Se genera automáticamente si lo dejas vacío"
                  value={draft.code}
                  onChange={(_, d) => update('code', d.value)}
                />
              </Field>

              <Field label="Nombre" required>
                <Input
                  className={styles.input}
                  placeholder="Ej: API Solicitudes"
                  value={draft.name}
                  onChange={(_, d) => update('name', d.value)}
                />
              </Field>

              <Field label="Descripción" required>
                <Textarea
                  placeholder="Explica brevemente el propósito del proyecto y a quién sirve."
                  rows={4}
                  value={draft.description}
                  onChange={(_, d) => update('description', d.value)}
                />
              </Field>

              <Field label="Stack tecnológico" required>
                <div className={styles.chipsRow}>
                  {draft.tech.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                      <span
                        className={styles.chipRemove}
                        onClick={() => removeTech(t)}
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
                    placeholder="Ej: React, Node, PostgreSQL"
                    value={techInput}
                    onChange={(_, d) => setTechInput(d.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTech()
                      }
                    }}
                  />
                  <Button icon={<Add20Regular />} onClick={addTech}>
                    Agregar
                  </Button>
                </div>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <div className={styles.sectionTitle}>Responsable principal</div>
                <div className={styles.sectionHint}>
                  Selecciona al miembro que lidera técnicamente el proyecto.
                </div>
                <div className={styles.memberGrid}>
                  {mockMembersPool.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`${styles.memberCard} ${
                        draft.ownerId === m.id ? styles.memberCardActive : ''
                      }`}
                      onClick={() => update('ownerId', m.id)}
                    >
                      <Avatar
                        name={m.name}
                        initials={m.initials}
                        color="brand"
                        size={32}
                      />
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{m.name}</span>
                        <span className={styles.memberRole}>owner</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.sectionTitle}>Miembros del equipo</div>
                <div className={styles.sectionHint}>
                  Puedes agregar miembros adicionales que colaborarán en el proyecto.
                </div>
                <div className={styles.memberGrid}>
                  {mockMembersPool
                    .filter((m) => m.id !== draft.ownerId)
                    .map((m) => {
                      const active = draft.memberIds.includes(m.id)
                      return (
                        <button
                          key={m.id}
                          type="button"
                          className={`${styles.memberCard} ${
                            active ? styles.memberCardActive : ''
                          }`}
                          onClick={() => toggleMember(m.id)}
                        >
                          <Avatar
                            name={m.name}
                            initials={m.initials}
                            color="colorful"
                            size={32}
                          />
                          <div className={styles.memberInfo}>
                            <span className={styles.memberName}>{m.name}</span>
                            <span className={styles.memberRole}>
                              {active ? '✓ incluido' : 'miembro'}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.sectionTitle}>Revisar y guardar</div>
              <div className={styles.sectionHint}>
                Confirma la información antes de registrar el proyecto.
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Código</span>
                  <span className={styles.reviewValue}>
                    {draft.code.toUpperCase() || '— auto —'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Nombre</span>
                  <span className={styles.reviewValue}>{draft.name || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Descripción</span>
                  <span className={styles.reviewValue}>
                    {draft.description || '—'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Stack</span>
                  <span className={styles.reviewValue}>
                    {draft.tech.length > 0 ? draft.tech.join(', ') : '—'}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Responsable</span>
                  <span className={styles.reviewValue}>
                    {ownerObj ? (
                      <Badge appearance="tint">{ownerObj.name}</Badge>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
                <div
                  className={styles.reviewRow}
                  style={{
                    borderBottom: 'none',
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                >
                  <span className={styles.reviewLabel}>Miembros</span>
                  <span className={styles.reviewValue}>
                    {memberObjs.length === 0 ? (
                      '—'
                    ) : (
                      <div className={styles.avatarStack}>
                        {memberObjs.map((m) => (
                          <Avatar
                            key={m.id}
                            name={m.name}
                            initials={m.initials}
                            color="colorful"
                            size={24}
                          />
                        ))}
                      </div>
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
                disabled={!draft.ownerId}
              >
                Crear proyecto
              </Button>
            )}
          </div>
        </div>
      </DrawerFooter>
    </Drawer>
  )
}

