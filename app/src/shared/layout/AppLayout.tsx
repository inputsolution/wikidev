import { Outlet } from 'react-router-dom'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  content: {
    flex: 1,
    padding: '28px 32px 48px',
  },
})

export function AppLayout() {
  const styles = useStyles()
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
