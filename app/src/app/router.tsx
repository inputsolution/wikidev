import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/shared/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { RoleGuard } from '@/features/auth/components/RoleGuard'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { ForbiddenPage } from '@/features/auth/components/ForbiddenPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { DocumentationPage } from '@/features/documentation/DocumentationPage'
import { ChangelogPage } from '@/features/changelog/ChangelogPage'
import { IntegrationsPage } from '@/features/integrations/IntegrationsPage'
import { CommentsPage } from '@/features/comments/CommentsPage'
import { AttachmentsPage } from '@/features/attachments/AttachmentsPage'
import { AdministrationPage } from '@/features/administration/AdministrationPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'proyectos', element: <ProjectsPage /> },
      { path: 'proyectos/:projectId', element: <ProjectDetailPage /> },
      { path: 'documentacion', element: <DocumentationPage /> },
      { path: 'bitacora', element: <ChangelogPage /> },
      { path: 'integraciones', element: <IntegrationsPage /> },
      { path: 'comentarios', element: <CommentsPage /> },
      { path: 'adjuntos', element: <AttachmentsPage /> },
      {
        path: 'administracion',
        element: (
          <RoleGuard allowed={['admin']}>
            <AdministrationPage />
          </RoleGuard>
        ),
      },
      { path: 'forbidden', element: <ForbiddenPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
