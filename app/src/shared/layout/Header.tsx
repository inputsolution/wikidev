import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SearchBox,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Alert20Regular,
  QuestionCircle20Regular,
  SignOut20Regular,
  Person20Regular,
} from '@fluentui/react-icons'
import { useAuth } from '@/features/auth/hooks/useAuth'

const useStyles = makeStyles({
  header: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  search: {
    flex: 1,
    maxWidth: '480px',
  },
  spacer: {
    flex: 1,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 10px 4px 4px',
    marginLeft: '8px',
    border: 'none',
    background: 'transparent',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'capitalize',
  },
})

export function Header() {
  const styles = useStyles()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.header}>
      <SearchBox
        className={styles.search}
        placeholder="Buscar en proyectos, documentación, cambios…"
        appearance="filled-lighter"
      />
      <div className={styles.spacer} />

      <div className={styles.actions}>
        <Button
          appearance="subtle"
          icon={<QuestionCircle20Regular />}
          aria-label="Ayuda"
        />
        <Button
          appearance="subtle"
          icon={<Alert20Regular />}
          aria-label="Notificaciones"
        />
      </div>

      {user && (
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <button type="button" className={styles.userButton}>
              <Avatar name={user.displayName} initials={user.initials} color="brand" size={32} />
              <span className={styles.userMeta}>
                <Text size={200} weight="semibold">
                  {user.displayName}
                </Text>
                <span className={styles.userRole}>{user.role}</span>
              </span>
            </button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Person20Regular />}>Mi perfil</MenuItem>
              <MenuItem icon={<SignOut20Regular />} onClick={handleLogout}>
                Cerrar sesión
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      )}
    </header>
  )
}
