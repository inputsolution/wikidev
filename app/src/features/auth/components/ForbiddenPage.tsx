import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ArrowLeft20Regular,
  LockClosed24Filled,
  ShieldError24Filled,
} from '@fluentui/react-icons'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
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
    borderRadius: '14px',
    padding: '40px 36px',
    textAlign: 'center',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
  },
  iconWrap: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
    color: '#E11D48',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '32px',
  },
  kicker: {
    fontFamily: MONO,
    fontSize: '11px',
    color: '#E11D48',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: '8px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
    marginBottom: '10px',
  },
  description: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  infoBlock: {
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
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '24px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontFamily: MONO,
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  infoLabel: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
})

export function ForbiddenPage() {
  const styles = useStyles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as { required?: UserRole[] } | null) ?? null
  const required = state?.required ?? []

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <ShieldError24Filled />
        </div>
        <div className={styles.kicker}>// 403 forbidden</div>
        <div className={styles.title}>Acceso denegado</div>
        <div className={styles.description}>
          No tienes los permisos necesarios para acceder a esta sección del portal. Si crees
          que deberías tener acceso, contacta al administrador del sistema.
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              <LockClosed24Filled
                style={{ fontSize: '13px', marginRight: '6px', verticalAlign: 'middle' }}
              />
              usuario
            </span>
            <span>{user?.displayName ?? '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>rol actual</span>
            {user ? (
              <Badge appearance="tint" color="informative">
                {user.role}
              </Badge>
            ) : (
              <span>—</span>
            )}
          </div>
          {required.length > 0 && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>rol requerido</span>
              <span>
                {required.map((r, i) => (
                  <Badge
                    key={r}
                    appearance="tint"
                    color="danger"
                    style={{ marginLeft: i === 0 ? 0 : 4 }}
                  >
                    {r}
                  </Badge>
                ))}
              </span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button icon={<ArrowLeft20Regular />} onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
          <Button appearance="primary" onClick={() => navigate('/')}>
            Ir al dashboard
          </Button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '11px', fontFamily: MONO }}>
          <Link
            to="/login"
            style={{ color: tokens.colorNeutralForeground3, textDecoration: 'none' }}
          >
            ¿Necesitas cambiar de usuario? Iniciar sesión de nuevo
          </Link>
        </div>
      </div>
    </div>
  )
}
