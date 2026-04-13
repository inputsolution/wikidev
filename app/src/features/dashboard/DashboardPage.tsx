import {
  Card,
  CardHeader,
  Text,
  Title3,
  Caption1,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  FolderOpen24Regular,
  History24Regular,
  BranchFork24Regular,
  DocumentText24Regular,
} from '@fluentui/react-icons'
import { PageHeader } from '@/shared/components/PageHeader'

const useStyles = makeStyles({
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  metricCard: {
    padding: '18px 20px',
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '8px',
    color: tokens.colorNeutralForeground1,
  },
  metricLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
  },
  iconWrap: {
    display: 'inline-flex',
    padding: '8px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },
  listCard: {
    padding: '18px 20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '12px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  listItemMain: {
    display: 'flex',
    flexDirection: 'column',
  },
})

const metrics = [
  { label: 'Proyectos activos', value: 12, icon: FolderOpen24Regular },
  { label: 'Cambios esta semana', value: 38, icon: History24Regular },
  { label: 'PR pendientes', value: 7, icon: BranchFork24Regular },
  { label: 'Docs actualizadas', value: 24, icon: DocumentText24Regular },
]

const recentChanges = [
  { title: 'Refactor del módulo de facturación', project: 'ERP Core', type: 'Mejora', author: 'A. García' },
  { title: 'Fix en validación de sesiones', project: 'Portal Cliente', type: 'Bugfix', author: 'M. López' },
  { title: 'Nueva API de reportes', project: 'BI Service', type: 'Mejora', author: 'J. Pérez' },
]

export function DashboardPage() {
  const styles = useStyles()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista general de la actividad técnica del portal."
      />

      <div className={styles.metrics}>
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className={styles.metricCard}>
            <div className={styles.metricRow}>
              <Caption1 className={styles.metricLabel}>{label}</Caption1>
              <span className={styles.iconWrap}>
                <Icon />
              </span>
            </div>
            <div className={styles.metricValue}>{value}</div>
          </Card>
        ))}
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.listCard}>
          <CardHeader header={<Title3>Cambios recientes</Title3>} />
          <div className={styles.list}>
            {recentChanges.map((c) => (
              <div key={c.title} className={styles.listItem}>
                <div className={styles.listItemMain}>
                  <Text weight="semibold">{c.title}</Text>
                  <Caption1>
                    {c.project} &middot; {c.author}
                  </Caption1>
                </div>
                <Badge
                  appearance="tint"
                  color={c.type === 'Bugfix' ? 'danger' : 'brand'}
                >
                  {c.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.listCard}>
          <CardHeader header={<Title3>Pull requests pendientes</Title3>} />
          <div className={styles.list}>
            <div className={styles.listItem}>
              <div className={styles.listItemMain}>
                <Text weight="semibold">PR #421 &middot; Ajustes en login SSO</Text>
                <Caption1>Portal Cliente &middot; 2 revisores</Caption1>
              </div>
              <Badge appearance="tint" color="warning">
                En revisión
              </Badge>
            </div>
            <div className={styles.listItem}>
              <div className={styles.listItemMain}>
                <Text weight="semibold">PR #418 &middot; Migración de esquema pagos</Text>
                <Caption1>ERP Core &middot; 1 revisor</Caption1>
              </div>
              <Badge appearance="tint" color="warning">
                En revisión
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
