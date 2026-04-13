import { Attach28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function AttachmentsPage() {
  return (
    <>
      <PageHeader
        title="Adjuntos"
        description="Repositorio de archivos relacionados: scripts, evidencias, imágenes."
      />
      <EmptyModule
        icon={<Attach28Regular />}
        title="Repositorio de adjuntos"
        description="Aquí podrás gestionar scripts, evidencias e imágenes asociadas a cada cambio."
      />
    </>
  )
}
