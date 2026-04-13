export type UserRole = 'admin' | 'editor' | 'reader'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  role: UserRole
  initials: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  error: string | null
}
