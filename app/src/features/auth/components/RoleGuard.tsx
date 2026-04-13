import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

interface RoleGuardProps {
  allowed: UserRole[]
  children: ReactNode
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allowed.includes(user.role)) {
    return <Navigate to="/forbidden" replace state={{ required: allowed }} />
  }
  return <>{children}</>
}
