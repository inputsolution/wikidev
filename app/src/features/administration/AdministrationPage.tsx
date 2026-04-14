import { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Input,
  Tab,
  TabList,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import {
  Add20Regular,
  CheckmarkCircle16Filled,
  DismissCircle16Regular,
  Person20Regular,
  Search20Regular,
  ShieldCheckmark20Regular,
  TagMultiple20Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { mockMembersPool } from '@/features/projects/mockData'
import type { UserRole } from '@/features/auth/types'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

type AdminTab = 'usuarios' | 'roles' | 'catalogos'

interface AdminUser {
  id: string
  name: string
  initials: string
  email: string
  role: UserRole
  status: 'Activo' | 'Inactivo' | 'Pendiente'
  lastSeen: string
}

interface RoleCard {
  role: UserRole
  label: string
  description: string
  users: number
  permissions: Permission[]
}

interface Permission {
  id: string
  label: string
  enabled: boolean
}

interface Catalog {
  id: string
  name: string
  description: string
  values: string[]
}

const BASE_PERMISSIONS: Array<Omit<Permission, 'enabled'>> = [
  { id: 'projects.read', label: 'Ver proyectos' },
  { id: 'projects.create', label: 'Crear proyectos' },
  { id: 'projects.edit', label: 'Editar proyectos' },
  { id: 'projects.delete', label: 'Eliminar proyectos' },
  { id: 'changes.create', label: 'Registrar cambios' },
  { id: 'docs.edit', label: 'Editar documentación' },
  { id: 'docs.version', label: 'Publicar versiones' },
  { id: 'users.manage', label: 'Gestionar usuarios' },
  { id: 'catalogs.manage', label: 'Gestionar catálogos' },
]

function buildPermissions(role: UserRole): Permission[] {
  return BASE_PERMISSIONS.map((p) => ({
    ...p,
    enabled: (() => {
      if (role === 'admin') return true
      if (role === 'editor') {
        return (
          p.id === 'projects.read' ||
          p.id === 'projects.create' ||
          p.id === 'projects.edit' ||
          p.id === 'changes.create' ||
          p.id === 'docs.edit' ||
          p.id === 'docs.version'
        )
      }
      return p.id === 'projects.read'
    })(),
  }))
}

const initialUsers: AdminUser[] = [
  {
    id: 'u-001',
    name: 'ANDEJESUS',
    initials: 'AJ',
    email: 'ANDEJESUS@bancoademi.com.do',
    role: 'admin',
    status: 'Activo',
    lastSeen: 'hace 2 min',
  },
  ...mockMembersPool.map<AdminUser>((m, i) => ({
    id: m.id,
    name: m.name,
    initials: m.initials,
    email: `${m.name.replace(/\s|\./g, '').toLowerCase()}@bancoademi.com.do`,
    role: i < 3 ? 'editor' : 'reader',
    status: i === 4 ? 'Inactivo' : i === 7 ? 'Pendiente' : 'Activo',
    lastSeen:
      i === 4
        ? 'hace 3 meses'
        : i === 7
          ? 'nunca'
          : `hace ${Math.floor(Math.random() * 30 + 1)} h`,
  })),
]

const initialCatalogs: Catalog[] = [
  {
    id: 'cat-change-types',
    name: 'Tipos de cambio',
    description: 'Clasificación utilizada en la bitácora.',
    values: ['Mejora', 'Bugfix', 'Refactor', 'Feature', 'Docs'],
  },
  {
    id: 'cat-environments',
    name: 'Ambientes',
    description: 'Entornos de despliegue permitidos.',
    values: ['DEV', 'QA', 'UAT', 'PROD'],
  },
  {
    id: 'cat-priorities',
    name: 'Prioridades de HU',
    description: 'Niveles permitidos para priorizar historias de usuario.',
    values: ['Alta', 'Media', 'Baja'],
  },
  {
    id: 'cat-pr-status',
    name: 'Estados de PR',
    description: 'Estados aceptados para pull requests.',
    values: ['Open', 'En revisión', 'Cambios pedidos', 'Aprobado', 'Merged', 'Cerrado'],
  },
]

const useStyles = makeStyles({
  tabList: {
    marginBottom: '20px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    maxWidth: '420px',
  },
  card: {
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
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  th: {
    textAlign: 'left',
    padding: '12px 18px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  td: {
    padding: '12px 18px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    verticalAlign: 'middle',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userMain: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  userEmail: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
  },
  lastSeen: {
    fontFamily: MONO,
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  roleCard: {
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
    borderRadius: '12px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  roleCardHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  roleIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleName: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    textTransform: 'capitalize',
  },
  roleSub: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    fontFamily: MONO,
  },
  roleDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
  },
  permissions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  permissionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  permissionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  permissionYes: {
    color: '#059669',
    display: 'inline-flex',
  },
  permissionNo: {
    color: tokens.colorNeutralForeground4,
    display: 'inline-flex',
  },
  catalogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  catalogCard: {
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
    borderRadius: '12px',
    padding: '18px 20px',
  },
  catalogHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    gap: '12px',
  },
  catalogTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  catalogSub: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  catalogValues: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  catalogChip: {
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
  catalogAdd: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },
})

function statusBadge(
  status: AdminUser['status'],
): { color: 'success' | 'subtle' | 'warning'; label: string } {
  if (status === 'Activo') return { color: 'success', label: 'Activo' }
  if (status === 'Inactivo') return { color: 'subtle', label: 'Inactivo' }
  return { color: 'warning', label: 'Pendiente' }
}

function roleDescription(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Acceso completo al portal, incluyendo gestión de usuarios, roles y catálogos.'
    case 'editor':
      return 'Puede crear proyectos, registrar cambios y publicar versiones de documentación.'
    case 'reader':
      return 'Acceso de solo lectura a proyectos, bitácora y documentación.'
  }
}

export function AdministrationPage() {
  const styles = useStyles()
  const [tab, setTab] = useState<AdminTab>('usuarios')
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [catalogs, setCatalogs] = useState<Catalog[]>(initialCatalogs)
  const [newValueByCatalog, setNewValueByCatalog] = useState<Record<string, string>>({})

  const onTabSelect = (_e: SelectTabEvent, data: SelectTabData) => {
    setTab(String(data.value) as AdminTab)
  }

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    )
  }, [users, query])

  const roles: RoleCard[] = (['admin', 'editor', 'reader'] as UserRole[]).map(
    (r) => ({
      role: r,
      label: r,
      description: roleDescription(r),
      users: users.filter((u) => u.role === r).length,
      permissions: buildPermissions(r),
    }),
  )

  const cycleRole = (id: string) => {
    const order: UserRole[] = ['admin', 'editor', 'reader']
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        const next = order[(order.indexOf(u.role) + 1) % order.length]
        return { ...u, role: next }
      }),
    )
  }

  const addCatalogValue = (id: string) => {
    const value = (newValueByCatalog[id] ?? '').trim()
    if (!value) return
    setCatalogs((prev) =>
      prev.map((c) =>
        c.id === id && !c.values.includes(value)
          ? { ...c, values: [...c.values, value] }
          : c,
      ),
    )
    setNewValueByCatalog((prev) => ({ ...prev, [id]: '' }))
  }

  const removeCatalogValue = (id: string, value: string) => {
    setCatalogs((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, values: c.values.filter((v) => v !== value) } : c,
      ),
    )
  }

  return (
    <>
      <PageHeader
        title="Administración"
        description="Gestión de usuarios, roles, permisos y catálogos del sistema."
        actions={
          <Badge appearance="tint" color="brand">
            solo admin
          </Badge>
        }
      />

      <TabList
        className={styles.tabList}
        selectedValue={tab}
        onTabSelect={onTabSelect}
        size="medium"
      >
        <Tab value="usuarios" icon={<Person20Regular />}>
          Usuarios
        </Tab>
        <Tab value="roles" icon={<ShieldCheckmark20Regular />}>
          Roles y permisos
        </Tab>
        <Tab value="catalogos" icon={<TagMultiple20Regular />}>
          Catálogos
        </Tab>
      </TabList>

      {tab === 'usuarios' && (
        <>
          <div className={styles.toolbar}>
            <Input
              className={styles.search}
              placeholder="Buscar por nombre, correo o rol…"
              contentBefore={<Search20Regular />}
              value={query}
              onChange={(_, d) => setQuery(d.value)}
            />
            <Button appearance="primary" icon={<Add20Regular />}>
              Invitar usuario
            </Button>
          </div>

          <div className={styles.card}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Usuario</th>
                  <th className={styles.th}>Rol</th>
                  <th className={styles.th}>Estado</th>
                  <th className={styles.th}>Último acceso</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const sb = statusBadge(u.status)
                  return (
                    <tr key={u.id}>
                      <td className={styles.td}>
                        <div className={styles.userCell}>
                          <Avatar
                            name={u.name}
                            initials={u.initials}
                            color="brand"
                            size={32}
                          />
                          <div className={styles.userMain}>
                            <span className={styles.userName}>{u.name}</span>
                            <span className={styles.userEmail}>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <Button
                          size="small"
                          appearance="subtle"
                          onClick={() => cycleRole(u.id)}
                        >
                          <Badge appearance="tint" color="brand">
                            {u.role}
                          </Badge>
                        </Button>
                      </td>
                      <td className={styles.td}>
                        <Badge appearance="tint" color={sb.color}>
                          {sb.label}
                        </Badge>
                      </td>
                      <td className={`${styles.td} ${styles.lastSeen}`}>
                        {u.lastSeen}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'roles' && (
        <div className={styles.roleGrid}>
          {roles.map((r) => (
            <div key={r.role} className={styles.roleCard}>
              <div className={styles.roleCardHead}>
                <span className={styles.roleIcon}>
                  <ShieldCheckmark20Regular />
                </span>
                <div>
                  <div className={styles.roleName}>{r.label}</div>
                  <div className={styles.roleSub}>
                    {r.users} {r.users === 1 ? 'usuario' : 'usuarios'}
                  </div>
                </div>
              </div>
              <div className={styles.roleDescription}>{r.description}</div>
              <div className={styles.permissions}>
                {r.permissions.map((p) => (
                  <div key={p.id} className={styles.permissionRow}>
                    <span className={styles.permissionLabel}>
                      {p.enabled ? (
                        <span className={styles.permissionYes}>
                          <CheckmarkCircle16Filled />
                        </span>
                      ) : (
                        <span className={styles.permissionNo}>
                          <DismissCircle16Regular />
                        </span>
                      )}
                      {p.label}
                    </span>
                    <Checkbox checked={p.enabled} disabled />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'catalogos' && (
        <div className={styles.catalogList}>
          {catalogs.map((c) => (
            <div key={c.id} className={styles.catalogCard}>
              <div className={styles.catalogHead}>
                <div>
                  <div className={styles.catalogTitle}>{c.name}</div>
                  <div className={styles.catalogSub}>{c.description}</div>
                </div>
                <Badge appearance="tint">{c.values.length} valores</Badge>
              </div>
              <div className={styles.catalogValues}>
                {c.values.map((v) => (
                  <span key={v} className={styles.catalogChip}>
                    {v}
                    <Button
                      size="small"
                      appearance="transparent"
                      aria-label={`Eliminar ${v}`}
                      onClick={() => removeCatalogValue(c.id, v)}
                      style={{ minWidth: 18, padding: 0 }}
                    >
                      ×
                    </Button>
                  </span>
                ))}
              </div>
              <div className={styles.catalogAdd}>
                <Input
                  placeholder="Nuevo valor"
                  value={newValueByCatalog[c.id] ?? ''}
                  onChange={(_, d) =>
                    setNewValueByCatalog((prev) => ({ ...prev, [c.id]: d.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCatalogValue(c.id)
                    }
                  }}
                />
                <Button
                  icon={<Add20Regular />}
                  onClick={() => addCatalogValue(c.id)}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
