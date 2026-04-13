import type { ReactNode } from 'react'
import { Card, makeStyles, Text, Title3, tokens } from '@fluentui/react-components'

interface EmptyModuleProps {
  icon: ReactNode
  title: string
  description: string
}

const useStyles = makeStyles({
  card: {
    padding: '48px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
    fontSize: '28px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '480px',
  },
})

export function EmptyModule({ icon, title, description }: EmptyModuleProps) {
  const styles = useStyles()
  return (
    <Card className={styles.card}>
      <span className={styles.iconWrap}>{icon}</span>
      <Title3>{title}</Title3>
      <Text className={styles.description}>{description}</Text>
    </Card>
  )
}
