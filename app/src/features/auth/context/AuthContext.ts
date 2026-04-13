import { createContext } from 'react'
import type { AuthState, AuthUser, LoginCredentials } from '../types'

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
