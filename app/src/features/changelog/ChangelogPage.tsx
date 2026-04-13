import { History28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function ChangelogPage() {
  return (
    <>
      <PageHeader
        title="Bitácora de cambios"
        description="Timeline de cambios con tipo, autor, ambiente, versión, HU Jira y PR DevOps."
      />
      <EmptyModule
        icon={<History28Regular />}
        title="Timeline de cambios"
        description="Próximamente: historial completo de cambios con comentarios y adjuntos asociados."
      />
    </>
  )
}
