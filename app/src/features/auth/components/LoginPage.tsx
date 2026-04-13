import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Mail20Regular,
  LockClosed20Regular,
  Eye20Regular,
  EyeOff20Regular,
  ArrowRight20Regular,
} from '@fluentui/react-icons'
import { useAuth } from '../hooks/useAuth'
import {
  useTerminalTyping,
  type TerminalStep,
} from '@/shared/hooks/useTerminalTyping'

const TERMINAL_STEPS: TerminalStep[] = [
  {
    command: 'git log --oneline -1',
    output: [
      { kind: 'hash', text: 'a3f9c2e refactor(auth): migrate to MSAL provider' },
      { kind: 'diff', text: '+284 −127  ·  12 files  ·  HU-1423  ·  PR #418' },
      { kind: 'meta', text: 'branch: main → staging' },
    ],
  },
  {
    command: 'git status',
    output: [
      { kind: 'meta', text: 'On branch main' },
      { kind: 'meta', text: "Your branch is up to date with 'origin/main'." },
      { kind: 'plain', text: 'nothing to commit, working tree clean' },
    ],
  },
  {
    command: 'npm run build',
    output: [
      { kind: 'meta', text: '> vite build' },
      { kind: 'diff', text: '✓ typecheck passed' },
      { kind: 'diff', text: '✓ 2098 modules transformed' },
      { kind: 'diff', text: '✓ built in 983ms' },
    ],
  },
  {
    command: 'git log --graph --oneline -3',
    output: [
      { kind: 'hash', text: '* 7bd104f feat(dashboard): add PR pending metric' },
      { kind: 'hash', text: '* 1e2c88a fix(api): handle 401 refresh edge case' },
      { kind: 'hash', text: '* 9c0ffab docs(arch): update sequence diagram' },
    ],
  },
]

const MONO_STACK =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (min-width: 900px)': {
      gridTemplateColumns: '1.1fr 1fr',
    },
  },
  brandPanel: {
    display: 'none',
    position: 'relative',
    padding: '64px',
    color: '#EAFDFF',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: '#003B44',
    backgroundImage: `
      radial-gradient(circle at 20% 0%, rgba(3, 149, 169, 0.55) 0%, transparent 55%),
      radial-gradient(circle at 90% 100%, rgba(0, 20, 23, 0.85) 0%, transparent 60%),
      linear-gradient(180deg, #00272D 0%, #003B44 50%, #00151A 100%)
    `,
    '@media (min-width: 900px)': {
      display: 'flex',
    },
  },
  codeBackdrop: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    fontFamily: MONO_STACK,
    fontSize: '12px',
    lineHeight: 1.55,
    color: 'rgba(189, 241, 248, 0.12)',
    padding: '48px 56px',
    userSelect: 'none',
    overflow: 'hidden',
    maskImage: 'linear-gradient(180deg, transparent 0%, #000 12%, #000 75%, transparent 100%)',
    WebkitMaskImage:
      'linear-gradient(180deg, transparent 0%, #000 12%, #000 75%, transparent 100%)',
  },
  codeScroller: {
    whiteSpace: 'pre',
    willChange: 'transform',
    animationName: {
      from: { transform: 'translate3d(0, 0, 0)' },
      to: { transform: 'translate3d(0, -50%, 0)' },
    },
    animationDuration: '45s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  cursor: {
    display: 'inline-block',
    width: '7px',
    height: '13px',
    backgroundColor: '#7DDFEE',
    marginLeft: '4px',
    boxShadow: '0 0 10px rgba(125, 223, 238, 0.7)',
    animationName: {
      '0%, 49%': { opacity: 1 },
      '50%, 100%': { opacity: 0 },
    },
    animationDuration: '1.1s',
    animationTimingFunction: 'steps(1, end)',
    animationIterationCount: 'infinite',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
      opacity: 1,
    },
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
    `,
    backgroundSize: '32px 32px',
    maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
  },
  brandContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  brandLogo: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    padding: '6px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: '#FFFFFF',
  },
  brandSubtitle: {
    opacity: 0.75,
    fontSize: '12px',
    marginTop: '2px',
    fontFamily: MONO_STACK,
    letterSpacing: '0.02em',
  },
  brandPitch: {
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  brandPitchTitle: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: '#FFFFFF',
  },
  brandPitchHighlight: {
    color: '#7DDFEE',
  },
  brandPitchText: {
    opacity: 0.82,
    lineHeight: 1.6,
    fontSize: '14px',
    maxWidth: '440px',
  },
  commitCard: {
    marginTop: '8px',
    borderRadius: '10px',
    border: '1px solid rgba(189, 241, 248, 0.2)',
    backgroundColor: 'rgba(0, 20, 23, 0.72)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    fontFamily: MONO_STACK,
    fontSize: '12px',
    lineHeight: 1.75,
    maxWidth: '460px',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
  },
  terminalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderBottom: '1px solid rgba(189, 241, 248, 0.12)',
    position: 'relative',
  },
  trafficRed: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    backgroundColor: '#FF5F57',
  },
  trafficYellow: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    backgroundColor: '#FEBC2E',
  },
  trafficGreen: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    backgroundColor: '#28C840',
  },
  terminalTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(234, 253, 255, 0.55)',
    letterSpacing: '0.02em',
    pointerEvents: 'none',
  },
  terminalBody: {
    padding: '14px 18px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minHeight: '150px',
  },
  prompt: {
    color: '#7DDFEE',
    fontWeight: 600,
  },
  promptLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  commitHash: {
    color: '#7DDFEE',
  },
  diffAdd: {
    color: '#5EE3A8',
  },
  diffRemove: {
    color: '#FF8A9B',
  },
  meta: {
    color: 'rgba(234, 253, 255, 0.55)',
  },
  brandFooter: {
    fontFamily: MONO_STACK,
    fontSize: '11px',
    color: 'rgba(234, 253, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#5EE3A8',
    boxShadow: '0 0 8px #5EE3A8',
  },
  formPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage:
      'radial-gradient(circle at 85% 15%, rgba(3, 149, 169, 0.06) 0%, transparent 45%)',
    position: 'relative',
  },
  formCard: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    position: 'relative',
    zIndex: 1,
  },
  formHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '8px',
  },
  formLogo: {
    width: '72px',
    height: '72px',
    padding: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow:
      '0 12px 32px rgba(3, 149, 169, 0.18), 0 2px 6px rgba(15, 23, 42, 0.06)',
  },
  formBrandName: {
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: tokens.colorNeutralForeground1,
  },
  kicker: {
    fontFamily: MONO_STACK,
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: tokens.colorBrandForeground1,
    marginBottom: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    '& label': {
      fontSize: '12px',
      fontWeight: 600,
      color: tokens.colorNeutralForeground2,
      letterSpacing: '0.01em',
      marginBottom: '6px',
      textTransform: 'uppercase',
    },
  },
  input: {
    height: '48px',
    borderRadiusTop: '10px',
    borderRadiusBottom: '10px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
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
    },
  },
  passwordToggle: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground3,
    padding: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  submit: {
    height: '48px',
    borderRadius: '10px',
    fontWeight: 600,
    marginTop: '6px',
    boxShadow: '0 8px 20px rgba(3, 149, 169, 0.28), 0 1px 2px rgba(3, 149, 169, 0.18)',
    transition: 'transform 120ms ease, box-shadow 180ms ease',
    ':hover': {
      boxShadow: '0 12px 28px rgba(3, 149, 169, 0.35), 0 1px 2px rgba(3, 149, 169, 0.18)',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      boxShadow: 'none',
      transform: 'none',
    },
  },
})

const CODE_BACKDROP = `$ git log --oneline --graph
* a3f9c2e  refactor(auth): migrate to MSAL provider
* 7bd104f  feat(dashboard): add PR pending metric
* 1e2c88a  fix(api): handle 401 refresh edge case
| * 9c0ffab  docs(arch): update sequence diagram
|/
* 5c0aec2  chore: initial portal scaffold

// src/features/projects/service.ts
export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get<Project[]>('/projects')
  return res.data.map(normalizeProject)
}

-  return legacyAuth.validate(token)
+  return msal.acquireTokenSilent(request)

SELECT p.id, p.name, COUNT(c.id) AS changes
FROM   projects p
LEFT   JOIN changes c ON c.project_id = p.id
WHERE  p.archived = false
GROUP  BY p.id
ORDER  BY changes DESC;

[ci] build ........................... passed
[ci] typecheck ....................... passed
[ci] lint ............................ passed
[ci] test ............................ 128 passed
`

export function LoginPage() {
  const styles = useStyles()
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@wikidev.local')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const terminal = useTerminalTyping(TERMINAL_STEPS)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
  const isLoading = status === 'loading'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch {
      // error expuesto vía contexto
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.gridOverlay} aria-hidden />
        <div className={styles.codeBackdrop} aria-hidden>
          <div className={styles.codeScroller}>
            {CODE_BACKDROP}
            {CODE_BACKDROP}
          </div>
        </div>
        <div className={styles.brandContent}>
          <div className={styles.brandHeader}>
            <img src="/logo.png" alt="wiki DEV" className={styles.brandLogo} />
            <div>
              <div className={styles.brandTitle}>wiki DEV</div>
              <div className={styles.brandSubtitle}>~/portal/knowledge</div>
            </div>
          </div>

          <div className={styles.brandPitch}>
            <div className={styles.brandPitchTitle}>
              Conocimiento <span className={styles.brandPitchHighlight}>versionado</span>.
            </div>
            <div className={styles.brandPitchText}>
              Commits, pull requests, historias de usuario y documentación técnica trazados en un
              solo lugar. Integrado con Jira y Azure DevOps.
            </div>

            <div className={styles.commitCard}>
              <div className={styles.terminalHeader}>
                <span className={styles.trafficRed} />
                <span className={styles.trafficYellow} />
                <span className={styles.trafficGreen} />
                <span className={styles.terminalTitle}>zsh — wiki-dev</span>
              </div>
              <div className={styles.terminalBody}>
                {terminal.lines.map((line, i) => {
                  if (line.kind === 'command') {
                    return (
                      <div key={`cmd-${i}`}>
                        <span className={styles.prompt}>$</span>{' '}
                        <span>{line.text}</span>
                      </div>
                    )
                  }
                  const className =
                    line.kind === 'hash'
                      ? styles.commitHash
                      : line.kind === 'diff'
                        ? styles.diffAdd
                        : line.kind === 'meta'
                          ? styles.meta
                          : undefined
                  return (
                    <div key={`out-${i}`} className={className}>
                      {line.text}
                    </div>
                  )
                })}
                <div className={styles.promptLine}>
                  <span className={styles.prompt}>$</span>
                  <span>{terminal.currentCommand}</span>
                  <span className={styles.cursor} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.brandFooter}>
            <span className={styles.footerDot} />
            <span>
              v0.1.0 · build 5c0aec2 · © {new Date().getFullYear()} Banco Ademi · wiki DEV
            </span>
          </div>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <img src="/logo.png" alt="wiki DEV" className={styles.formLogo} />
            <div className={styles.formBrandName}>wiki DEV</div>
          </div>

          {error && (
            <MessageBar intent="error">
              <MessageBarBody>{error}</MessageBarBody>
            </MessageBar>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field className={styles.field} label="Correo corporativo" required>
              <Input
                className={styles.input}
                type="email"
                value={email}
                onChange={(_, d) => setEmail(d.value)}
                placeholder="usuario@bancoademi.com.do"
                autoComplete="email"
                disabled={isLoading}
                contentBefore={<Mail20Regular />}
                required
              />
            </Field>

            <Field className={styles.field} label="Contraseña" required>
              <Input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(_, d) => setPassword(d.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                contentBefore={<LockClosed20Regular />}
                contentAfter={
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff20Regular /> : <Eye20Regular />}
                  </button>
                }
                required
              />
            </Field>

            <Button
              className={styles.submit}
              appearance="primary"
              type="submit"
              size="large"
              disabled={isLoading || !email || !password}
              icon={<ArrowRight20Regular />}
              iconPosition="after"
            >
              {isLoading ? 'Verificando…' : 'Acceder al portal'}
            </Button>
          </form>

        </div>
      </main>
    </div>
  )
}
