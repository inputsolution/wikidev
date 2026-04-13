import { Link28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integraciones"
        description="Enlaces externos a Jira y Azure DevOps con estado y descripción."
      />
      <EmptyModule
        icon={<Link28Regular />}
        title="Integraciones externas"
        description="Aquí se configurarán y visualizarán las conexiones con Jira y Azure DevOps."
      />
    </>
  )
}
