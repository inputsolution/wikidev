import { DocumentText28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function DocumentationPage() {
  return (
    <>
      <PageHeader
        title="Documentación"
        description="Editor estructurado por secciones: Arquitectura, APIs, Base de datos, Flujo funcional y Despliegue."
      />
      <EmptyModule
        icon={<DocumentText28Regular />}
        title="Editor de documentación"
        description="Pronto estará disponible el editor por secciones con versionado e historial."
      />
    </>
  )
}
