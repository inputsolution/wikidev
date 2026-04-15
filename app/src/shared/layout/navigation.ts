import type { FC } from 'react'
import type { UserRole } from '@/features/auth/types'
import {
  Board20Regular,
  Board20Filled,
  FolderOpen20Regular,
  FolderOpen20Filled,
  DocumentText20Regular,
  DocumentText20Filled,
  History20Regular,
  History20Filled,
  Link20Regular,
  Link20Filled,
  Comment20Regular,
  Comment20Filled,
  Attach20Regular,
  Attach20Filled,
  Settings20Regular,
  Settings20Filled,
  Warning20Regular,
  Warning20Filled,
  bundleIcon,
  type FluentIcon,
} from '@fluentui/react-icons'

export interface NavItem {
  key: string
  label: string
  path: string
  icon: FC<{ className?: string }> | FluentIcon
  allowedRoles?: UserRole[]
}

const Dashboard = bundleIcon(Board20Filled, Board20Regular)
const Projects = bundleIcon(FolderOpen20Filled, FolderOpen20Regular)
const Docs = bundleIcon(DocumentText20Filled, DocumentText20Regular)
const Changelog = bundleIcon(History20Filled, History20Regular)
const Incidents = bundleIcon(Warning20Filled, Warning20Regular)
const Integrations = bundleIcon(Link20Filled, Link20Regular)
const Comments = bundleIcon(Comment20Filled, Comment20Regular)
const Attachments = bundleIcon(Attach20Filled, Attach20Regular)
const Administration = bundleIcon(Settings20Filled, Settings20Regular)

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/', icon: Dashboard },
  { key: 'projects', label: 'Proyectos', path: '/proyectos', icon: Projects },
  { key: 'documentation', label: 'Documentación', path: '/documentacion', icon: Docs },
  { key: 'changelog', label: 'Bitácora', path: '/bitacora', icon: Changelog },
  {
    key: 'incidents',
    label: 'Incidencias / Soluciones',
    path: '/incidencias',
    icon: Incidents,
  },
  { key: 'integrations', label: 'Integraciones', path: '/integraciones', icon: Integrations },
  { key: 'comments', label: 'Comentarios', path: '/comentarios', icon: Comments },
  { key: 'attachments', label: 'Adjuntos', path: '/adjuntos', icon: Attachments },
  {
    key: 'administration',
    label: 'Administración',
    path: '/administracion',
    icon: Administration,
    allowedRoles: ['admin'],
  },
]

export function filterNavByRole(items: NavItem[], role?: UserRole): NavItem[] {
  return items.filter((item) => !item.allowedRoles || (role && item.allowedRoles.includes(role)))
}
