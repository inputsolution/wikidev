import { NavLink } from 'react-router-dom'
import { makeStyles, mergeClasses, Text, tokens } from '@fluentui/react-components'
import { navItems } from './navigation'

const useStyles = makeStyles({
  sidebar: {
    width: '248px',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 20px 18px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logo: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  brandName: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },
  sectionLabel: {
    padding: '18px 20px 6px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.colorNeutralForeground4,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 8px',
    gap: '2px',
    flex: 1,
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background-color 120ms ease, color 120ms ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  navLinkActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
      color: tokens.colorBrandForeground1,
    },
  },
  navIcon: {
    fontSize: '20px',
    display: 'inline-flex',
  },
  footer: {
    padding: '14px 20px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
  },
})

export function Sidebar() {
  const styles = useStyles()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/logo.png" alt="wiki DEV" className={styles.logo} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>wiki DEV</span>
          <span className={styles.brandSubtitle}>Portal de conocimiento</span>
        </div>
      </div>

      <Text className={styles.sectionLabel}>Navegación</Text>
      <nav className={styles.nav}>
        {navItems.map((item) => {
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

      <div className={styles.footer}>v0.1.0 &middot; Interno</div>
    </aside>
  )
}
