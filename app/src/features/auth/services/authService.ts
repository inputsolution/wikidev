import type { AuthUser, LoginCredentials } from '../types'

const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 'u-001',
    email: 'ANDEJESUS@bancoademi.com.do',
    password: 'admin123',
    displayName: 'ANDEJESUS',
    role: 'admin',
    initials: 'AJ',
  },
  {
    id: 'u-002',
    email: 'editor@wikidev.local',
    password: 'editor123',
    displayName: 'Esteban Editor',
    role: 'editor',
    initials: 'EE',
  },
  {
    id: 'u-003',
    email: 'reader@wikidev.local',
    password: 'reader123',
    displayName: 'Rosa Reader',
    role: 'reader',
    initials: 'RR',
  },
]

const STORAGE_KEY = 'wikidev.auth.user'
const LATENCY_MS = 900

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    await delay(LATENCY_MS)
    const match = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    )
    if (!match) {
      throw new Error('Credenciales incorrectas')
    }
    const user: AuthUser = {
      id: match.id,
      email: match.email,
      displayName: match.displayName,
      role: match.role,
      initials: match.initials,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  },

  async logout(): Promise<void> {
    await delay(100)
    localStorage.removeItem(STORAGE_KEY)
  },

  restore(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  },
}
