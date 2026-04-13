import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Text,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useAuth } from '../hooks/useAuth'

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
    padding: '64px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    flexDirection: 'column',
    justifyContent: 'space-between',
    '@media (min-width: 900px)': {
      display: 'flex',
    },
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
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '6px',
    boxSizing: 'border-box',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  brandSubtitle: {
    opacity: 0.85,
    fontSize: '13px',
    marginTop: '2px',
  },
  brandPitch: {
    maxWidth: '440px',
  },
  brandPitchTitle: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: '16px',
  },
  brandPitchText: {
    opacity: 0.9,
    lineHeight: 1.6,
  },
  brandFooter: {
    opacity: 0.75,
    fontSize: '12px',
  },
  formPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
  },
  formCard: {
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  mobileLogo: {
    width: '48px',
    height: '48px',
    marginBottom: '8px',
    '@media (min-width: 900px)': {
      display: 'none',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  hint: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '12px 14px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
  },
  hintTitle: {
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginBottom: '4px',
  },
})

export function LoginPage() {
  const styles = useStyles()
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
        <div className={styles.brandHeader}>
          <img src="/logo.png" alt="wiki DEV" className={styles.brandLogo} />
          <div>
            <div className={styles.brandTitle}>wiki DEV</div>
            <div className={styles.brandSubtitle}>Portal interno de conocimiento</div>
          </div>
        </div>

        <div className={styles.brandPitch}>
          <div className={styles.brandPitchTitle}>
            Documentación técnica con trazabilidad completa.
          </div>
          <div className={styles.brandPitchText}>
            Centraliza arquitectura, cambios, historias de usuario y pull requests. Integrado con
            Jira y Azure DevOps.
          </div>
        </div>

        <div className={styles.brandFooter}>
          &copy; {new Date().getFullYear()} wiki DEV &middot; Uso interno
        </div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <img src="/logo.png" alt="wiki DEV" className={styles.mobileLogo} />
            <Title2 as="h1">Iniciar sesión</Title2>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              Ingresa tus credenciales para acceder al portal.
            </Text>
          </div>

          {error && (
            <MessageBar intent="error">
              <MessageBarBody>{error}</MessageBarBody>
            </MessageBar>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field label="Correo electrónico" required>
              <Input
                type="email"
                value={email}
                onChange={(_, d) => setEmail(d.value)}
                placeholder="usuario@empresa.com"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </Field>

            <Field label="Contraseña" required>
              <Input
                type="password"
                value={password}
                onChange={(_, d) => setPassword(d.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </Field>

            <Button
              appearance="primary"
              type="submit"
              size="large"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Verificando…' : 'Entrar'}
            </Button>
          </form>

          <div className={styles.hint}>
            <span className={styles.hintTitle}>Usuarios de prueba</span>
            admin@wikidev.local / admin123
            <br />
            editor@wikidev.local / editor123
            <br />
            reader@wikidev.local / reader123
          </div>
        </div>
      </main>
    </div>
  )
}
