import { NavLink } from 'react-router-dom'
import { Avatar, makeStyles, mergeClasses } from '@fluentui/react-components'
import { SignOut20Regular } from '@fluentui/react-icons'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  useTerminalTyping,
  type TerminalStep,
} from '@/shared/hooks/useTerminalTyping'
import { filterNavByRole, navItems } from './navigation'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const SIDEBAR_TERMINAL_STEPS: TerminalStep[] = [
  {
    command: 'git log --oneline -1',
    output: [
      { kind: 'hash', text: 'a3f9c2e refactor(auth): MSAL' },
      { kind: 'diff', text: '+284 −127 · HU-1423' },
      { kind: 'meta', text: 'branch: main' },
    ],
  },
  {
    command: 'git status',
    output: [
      { kind: 'meta', text: 'On branch main' },
      { kind: 'plain', text: 'working tree clean' },
    ],
  },
  {
    command: 'npm run build',
    output: [
      { kind: 'diff', text: '✓ typecheck ok' },
      { kind: 'diff', text: '✓ built in 983ms' },
    ],
  },
]

const useStyles = makeStyles({
  sidebar: {
    width: '240px',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#EAFDFF',
    backgroundColor: '#024750',
    backgroundImage: `
      radial-gradient(circle at 20% 0%, rgba(3, 149, 169, 0.5) 0%, transparent 58%),
      radial-gradient(circle at 90% 100%, rgba(0, 30, 35, 0.7) 0%, transparent 62%),
      linear-gradient(180deg, #023B44 0%, #024750 50%, #012F36 100%)
    `,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'rgba(189, 241, 248, 0.08)',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px)
    `,
    backgroundSize: '28px 28px',
    maskImage: 'radial-gradient(ellipse at center, #000 25%, transparent 80%)',
    WebkitMaskImage:
      'radial-gradient(ellipse at center, #000 25%, transparent 80%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 20px 18px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(189, 241, 248, 0.1)',
  },
  logo: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    padding: '4px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxSizing: 'border-box',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  brandName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '10px',
    color: 'rgba(234, 253, 255, 0.55)',
    marginTop: '2px',
    fontFamily: MONO,
    letterSpacing: '0.02em',
  },
  sectionLabel: {
    padding: '18px 22px 8px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(189, 241, 248, 0.45)',
    fontFamily: MONO,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
    gap: '2px',
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '9px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'rgba(234, 253, 255, 0.75)',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background-color 140ms ease, color 140ms ease',
    '&:hover': {
      backgroundColor: 'rgba(189, 241, 248, 0.07)',
      color: '#FFFFFF',
    },
  },
  navLinkActive: {
    backgroundColor: 'rgba(3, 149, 169, 0.22)',
    color: '#FFFFFF',
    boxShadow: 'inset 0 0 0 1px rgba(125, 223, 238, 0.25)',
    '&:hover': {
      backgroundColor: 'rgba(3, 149, 169, 0.3)',
      color: '#FFFFFF',
    },
    '::before': {
      content: '""',
      position: 'absolute',
      left: '-10px',
      top: '8px',
      bottom: '8px',
      width: '3px',
      backgroundColor: '#7DDFEE',
      borderRadius: '0 3px 3px 0',
      boxShadow: '0 0 12px rgba(125, 223, 238, 0.6)',
    },
  },
  navIcon: {
    fontSize: '20px',
    display: 'inline-flex',
    color: 'currentColor',
  },
  terminalWrap: {
    padding: '12px 14px 0',
  },
  terminal: {
    borderRadius: '10px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'rgba(189, 241, 248, 0.2)',
    borderRightColor: 'rgba(189, 241, 248, 0.2)',
    borderBottomColor: 'rgba(189, 241, 248, 0.2)',
    borderLeftColor: 'rgba(189, 241, 248, 0.2)',
    backgroundColor: 'rgba(0, 20, 23, 0.78)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    fontFamily: MONO,
    fontSize: '10px',
    lineHeight: 1.65,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  terminalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(189, 241, 248, 0.12)',
  },
  trafficRed: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FF5F57',
  },
  trafficYellow: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FEBC2E',
  },
  trafficGreen: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#28C840',
  },
  terminalTitle: {
    marginLeft: 'auto',
    fontSize: '9px',
    color: 'rgba(234, 253, 255, 0.5)',
    letterSpacing: '0.02em',
  },
  terminalBody: {
    padding: '10px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    minHeight: '108px',
    color: 'rgba(234, 253, 255, 0.85)',
  },
  prompt: {
    color: '#7DDFEE',
    fontWeight: 600,
  },
  promptLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
  },
  hash: {
    color: '#7DDFEE',
  },
  diff: {
    color: '#5EE3A8',
  },
  meta: {
    color: 'rgba(234, 253, 255, 0.55)',
  },
  cursor: {
    display: 'inline-block',
    width: '6px',
    height: '11px',
    backgroundColor: '#7DDFEE',
    boxShadow: '0 0 8px rgba(125, 223, 238, 0.7)',
    animationName: {
      '0%, 49%': { opacity: 1 },
      '50%, 100%': { opacity: 0 },
    },
    animationDuration: '1.1s',
    animationTimingFunction: 'steps(1, end)',
    animationIterationCount: 'infinite',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  userCard: {
    margin: '14px',
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
    borderTopColor: 'rgba(189, 241, 248, 0.15)',
    borderRightColor: 'rgba(189, 241, 248, 0.15)',
    borderBottomColor: 'rgba(189, 241, 248, 0.15)',
    borderLeftColor: 'rgba(189, 241, 248, 0.15)',
    backgroundColor: 'rgba(0, 20, 23, 0.6)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userMain: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#FFFFFF',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '10px',
    color: 'rgba(189, 241, 248, 0.55)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginTop: '2px',
    fontFamily: MONO,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderTopWidth: '0',
    borderRightWidth: '0',
    borderBottomWidth: '0',
    borderLeftWidth: '0',
    cursor: 'pointer',
    color: 'rgba(189, 241, 248, 0.6)',
    padding: '6px',
    borderRadius: '6px',
    display: 'inline-flex',
    transition: 'background-color 120ms ease, color 120ms ease',
    ':hover': {
      backgroundColor: 'rgba(189, 241, 248, 0.08)',
      color: '#FFFFFF',
    },
  },
})

export function Sidebar() {
  const styles = useStyles()
  const { user, logout } = useAuth()
  const terminal = useTerminalTyping(SIDEBAR_TERMINAL_STEPS, {
    charDelayMs: 60,
    lineDelayMs: 260,
    holdMs: 2600,
  })

  return (
    <aside className={styles.sidebar}>
      <div className={styles.gridOverlay} aria-hidden />
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="wiki DEV" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.brandName}>wiki DEV</span>
            <span className={styles.brandSubtitle}>~/portal/knowledge</span>
          </div>
        </div>

        <div className={styles.sectionLabel}>// navegación</div>
        <nav className={styles.nav}>
          {filterNavByRole(navItems, user?.role).map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  mergeClasses(styles.navLink, isActive && styles.navLinkActive)
                }
              >
                <span className={styles.navIcon}>
                  <Icon />
                </span>
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className={styles.terminalWrap}>
          <div className={styles.terminal}>
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
                      <span className={styles.prompt}>$</span> {line.text}
                    </div>
                  )
                }
                const cn =
                  line.kind === 'hash'
                    ? styles.hash
                    : line.kind === 'diff'
                      ? styles.diff
                      : line.kind === 'meta'
                        ? styles.meta
                        : undefined
                return (
                  <div key={`out-${i}`} className={cn}>
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

        {user && (
          <div className={styles.userCard}>
            <Avatar
              name={user.displayName}
              initials={user.initials}
              color="brand"
              size={32}
            />
            <div className={styles.userMain}>
              <span className={styles.userName}>{user.displayName}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={() => {
                void logout()
              }}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <SignOut20Regular />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
