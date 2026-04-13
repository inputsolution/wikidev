import { Comment28Regular } from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyModule } from '@/shared/components/EmptyModule'

export function CommentsPage() {
  return (
    <>
      <PageHeader
        title="Comentarios"
        description="Conversación técnica asociada a cambios y documentación."
      />
      <EmptyModule
        icon={<Comment28Regular />}
        title="Hilo de comentarios"
        description="Aquí verás las conversaciones técnicas vinculadas a cada cambio y documento."
      />
    </>
  )
}
