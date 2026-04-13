import { FluentProvider } from '@fluentui/react-components'
import { RouterProvider } from 'react-router-dom'
import { wikiDevLightTheme } from '@/shared/theme'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { router } from './router'

export function App() {
  return (
    <FluentProvider theme={wikiDevLightTheme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </FluentProvider>
  )
}
