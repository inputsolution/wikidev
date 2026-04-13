import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'
import type { AuthState, AuthUser, LoginCredentials } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    const restored = authService.restore()
    if (restored) {
      setState({ user: restored, status: 'authenticated', error: null })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const user = await authService.login(credentials)
      setState({ user, status: 'authenticated', error: null })
      return user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setState({ user: null, status: 'error', error: message })
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setState({ user: null, status: 'idle', error: null })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
