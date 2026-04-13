import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Badge,
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
  BranchFork16Regular,
  DocumentText16Regular,
  FolderOpen16Regular,
  QuestionCircle20Regular,
  SignOut20Regular,
  Person20Regular,
} from '@fluentui/react-icons'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  header: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  searchWrap: {
    position: 'relative',
    flex: 1,
    maxWidth: '520px',
  },
  search: {
    width: '100%',
  },
  kbd: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontFamily: MONO,
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
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
    pointerEvents: 'none',
    userSelect: 'none',
  },
  popover: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    maxHeight: '520px',
    overflowY: 'auto',
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
    borderRadius: '10px',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)',
    padding: '8px',
    zIndex: 25,
  },
  groupLabel: {
    padding: '10px 12px 6px',
    fontSize: '10px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: MONO,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    borderTopWidth: '0',
    borderRightWidth: '0',
    borderBottomWidth: '0',
    borderLeftWidth: '0',
    width: '100%',
    textAlign: 'left',
    color: tokens.colorNeutralForeground2,
    transition: 'background-color 120ms ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  resultIcon: {
    display: 'inline-flex',
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  resultMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultMeta: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: MONO,
  },
  resultSnippet: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: MONO,
  },
  highlight: {
    backgroundColor: 'rgba(3, 149, 169, 0.18)',
    color: tokens.colorBrandForeground1,
    borderRadius: '2px',
    padding: '0 2px',
    fontWeight: 600,
  },
  emptyResults: {
    padding: '24px 16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
  },
  footerHint: {
    padding: '10px 12px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    fontFamily: MONO,
    display: 'flex',
    justifyContent: 'space-between',
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
    borderTopWidth: '0',
    borderRightWidth: '0',
    borderBottomWidth: '0',
    borderLeftWidth: '0',
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

function highlightMatch(
  text: string,
  query: string,
  className: string,
): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className={className}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function Header() {
  const styles = useStyles()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useGlobalSearch(query)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const navigateAndClose = (path: string) => {
    navigate(path)
    setOpen(false)
    setQuery('')
  }

  const hasQuery = query.trim().length >= 2
  const hasAny =
    results.projects.length + results.changes.length + results.docs.length > 0

  return (
    <header className={styles.header}>
      <div className={styles.searchWrap} ref={wrapRef}>
        <SearchBox
          ref={inputRef as never}
          className={styles.search}
          placeholder="Buscar en proyectos, documentación, cambios…"
          appearance="filled-lighter"
          value={query}
          onChange={(_, d) => {
            setQuery(d.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
        {!query && <span className={styles.kbd}>⌘K</span>}

        {open && hasQuery && (
          <div className={styles.popover}>
            {!hasAny && (
              <div className={styles.emptyResults}>
                Sin resultados para <strong>"{query}"</strong>
              </div>
            )}

            {results.projects.length > 0 && (
              <div>
                <div className={styles.groupLabel}>
                  <span>// proyectos</span>
                  <span>{results.projects.length}</span>
                </div>
                {results.projects.map((r) => (
                  <button
                    key={r.project.id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => navigateAndClose(`/proyectos/${r.project.id}`)}
                  >
                    <span className={styles.resultIcon}>
                      <FolderOpen16Regular />
                    </span>
                    <div className={styles.resultMain}>
                      <span className={styles.resultTitle}>
                        {highlightMatch(r.project.name, query, styles.highlight)}
                      </span>
                      <span className={styles.resultMeta}>
                        {r.project.code} · {r.project.tech.join(', ')}
                      </span>
                    </div>
                    <Badge appearance="outline" size="small">
                      {r.matchedIn}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {results.changes.length > 0 && (
              <div>
                <div className={styles.groupLabel}>
                  <span>// cambios</span>
                  <span>{results.changes.length}</span>
                </div>
                {results.changes.map((r) => (
                  <button
                    key={r.change.id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => navigateAndClose(`/proyectos/${r.projectId}`)}
                  >
                    <span className={styles.resultIcon}>
                      <BranchFork16Regular />
                    </span>
                    <div className={styles.resultMain}>
                      <span className={styles.resultTitle}>
                        {highlightMatch(r.change.title, query, styles.highlight)}
                      </span>
                      <span className={styles.resultMeta}>
                        {r.change.type} · {r.change.date} ·{' '}
                        {r.change.huRefs[0] ?? r.change.prRefs[0] ?? r.change.version}
                      </span>
                    </div>
                    <Badge appearance="outline" size="small">
                      {r.matchedIn}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {results.docs.length > 0 && (
              <div>
                <div className={styles.groupLabel}>
                  <span>// documentación</span>
                  <span>{results.docs.length}</span>
                </div>
                {results.docs.map((r) => (
                  <button
                    key={r.section.id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => navigateAndClose(`/documentacion`)}
                  >
                    <span className={styles.resultIcon}>
                      <DocumentText16Regular />
                    </span>
                    <div className={styles.resultMain}>
                      <span className={styles.resultTitle}>
                        {highlightMatch(r.section.title, query, styles.highlight)}
                      </span>
                      <span className={styles.resultSnippet}>
                        {highlightMatch(r.snippet, query, styles.highlight)}
                      </span>
                    </div>
                    <Badge appearance="outline" size="small">
                      {r.matchedIn}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {hasAny && (
              <div className={styles.footerHint}>
                <span>
                  {results.total} resultado{results.total === 1 ? '' : 's'}
                </span>
                <span>esc para cerrar</span>
              </div>
            )}
          </div>
        )}
      </div>

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
              <Avatar
                name={user.displayName}
                initials={user.initials}
                color="brand"
                size={32}
              />
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
