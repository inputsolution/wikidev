import type { ReactNode } from 'react'
import { makeStyles, Text, Title3, tokens } from '@fluentui/react-components'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
})

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.textGroup}>
        <Title3 as="h1">{title}</Title3>
        {description && (
          <Text size={300} className={styles.description}>
            {description}
          </Text>
        )}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
