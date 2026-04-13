import { FolderOpen28Regular } from '@fluentui/react-icons'
import { Button } from '@fluentui/react-components'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Listado de proyectos con su documentación, bitácora, HU y PR asociados."
        actions={<Button appearance="primary">Nuevo proyecto</Button>}
      />
      <EmptyModule
        icon={<FolderOpen28Regular />}
        title="Módulo en construcción"
        description="Aquí se listarán los proyectos con su vista de detalle en pestañas: Resumen, Documentación, Bitácora, HU, PR y Adjuntos."
      />
    </>
  )
}
