import { Settings28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function AdministrationPage() {
  return (
    <>
      <PageHeader
        title="Administración"
        description="Gestión de usuarios, roles, permisos y catálogos."
      />
      <EmptyModule
        icon={<Settings28Regular />}
        title="Panel administrativo"
        description="Aquí se gestionarán usuarios, roles, permisos y catálogos del sistema."
      />
    </>
  )
}
