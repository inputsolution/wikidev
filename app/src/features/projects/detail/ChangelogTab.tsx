import {
  Avatar,
  Badge,
  Button,
  Caption1,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Add20Regular,
  TicketDiagonal20Regular,
  BranchFork20Regular,
  Attach20Regular,
  DocumentPdf20Regular,
  Image20Regular,
  Code20Regular,
  LinkSquare20Regular,
} from '@fluentui/react-icons'
import { useState, type FC, type ReactNode } from 'react'
import type { ChangeType, Project, ProjectChange } from '../types'
import {
  mockAttachments,
  mockChanges,
  mockDevOpsLinks,
  mockJiraLinks,
} from '../mockData'
import { NewChangeDrawer } from './NewChangeDrawer'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    '@media (min-width: 1100px)': {
      gridTemplateColumns: 'minmax(0, 1fr) 300px',
    },
  },
  main: {
    minWidth: 0,
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  timeline: {
    position: 'relative',
    paddingLeft: '28px',
    '::before': {
      content: '""',
      position: 'absolute',
      left: '11px',
      top: '6px',
      bottom: '6px',
      width: '2px',
      backgroundColor: tokens.colorNeutralStroke2,
    },
  },
  dateRow: {
    position: 'relative',
    marginBottom: '12px',
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    letterSpacing: '0.02em',
  },
  dateDot: {
    position: 'absolute',
    left: '-23px',
    top: '3px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  changeCard: {
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderRadius: '10px',
    padding: '16px 18px',
    marginBottom: '16px',
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    ':hover': {
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
      boxShadow: '0 4px 16px rgba(3, 149, 169, 0.08)',
    },
  },
  changeDot: {
    position: 'absolute',
    left: '-23px',
    top: '22px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  changeHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  changeTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.005em',
  },
  changeDesc: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.55,
    marginBottom: '12px',
  },
  refs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  refChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorNeutralForeground2,
  },
  refChipJira: {
    color: '#0052CC',
    borderTopColor: 'rgba(0, 82, 204, 0.25)',
    borderRightColor: 'rgba(0, 82, 204, 0.25)',
    borderBottomColor: 'rgba(0, 82, 204, 0.25)',
    borderLeftColor: 'rgba(0, 82, 204, 0.25)',
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  refChipPR: {
    color: '#6B46C1',
    borderTopColor: 'rgba(107, 70, 193, 0.25)',
    borderRightColor: 'rgba(107, 70, 193, 0.25)',
    borderBottomColor: 'rgba(107, 70, 193, 0.25)',
    borderLeftColor: 'rgba(107, 70, 193, 0.25)',
    backgroundColor: 'rgba(107, 70, 193, 0.06)',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexWrap: 'wrap',
  },
  author: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaBlock: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: MONO,
  },
  comment: {
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderLeft: `3px solid ${tokens.colorBrandStroke2}`,
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  commentMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  commentAuthor: {
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  commentText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '10px',
    padding: '16px 18px',
  },
  panelTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    transition: 'background-color 120ms ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  linkIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  linkText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  linkKey: {
    fontFamily: MONO,
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
})

function changeColor(type: ChangeType): string {
  switch (type) {
    case 'Bugfix':
      return '#E11D48'
    case 'Mejora':
      return '#0395A9'
    case 'Refactor':
      return '#D97706'
    case 'Feature':
      return '#059669'
    case 'Docs':
      return '#7C3AED'
  }
}

function changeBadgeColor(
  type: ChangeType,
): 'brand' | 'danger' | 'warning' | 'success' | 'informative' {
  switch (type) {
    case 'Bugfix':
      return 'danger'
    case 'Mejora':
      return 'brand'
    case 'Refactor':
      return 'warning'
    case 'Feature':
      return 'success'
    case 'Docs':
      return 'informative'
  }
}

function groupByDate(changes: ProjectChange[]): Record<string, ProjectChange[]> {
  return changes.reduce<Record<string, ProjectChange[]>>((acc, change) => {
    if (!acc[change.date]) acc[change.date] = []
    acc[change.date].push(change)
    return acc
  }, {})
}

function attachmentIcon(name: string): ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) return <Image20Regular />
  if (ext === 'pdf') return <DocumentPdf20Regular />
  if (['sql', 'js', 'ts', 'tsx', 'py', 'cs', 'java'].includes(ext))
    return <Code20Regular />
  return <Attach20Regular />
}

interface ChangelogTabProps {
  project: Project
}

export const ChangelogTab: FC<ChangelogTabProps> = ({ project }) => {
  const styles = useStyles()
  const initialChanges =
    mockChanges[project.id] ?? mockChanges['p-001'] ?? []
  const [changes, setChanges] = useState<ProjectChange[]>(initialChanges)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const jira = mockJiraLinks[project.id] ?? mockJiraLinks['p-001'] ?? []
  const devops = mockDevOpsLinks[project.id] ?? mockDevOpsLinks['p-001'] ?? []
  const attachments = mockAttachments[project.id] ?? mockAttachments['p-001'] ?? []
  const grouped = groupByDate(changes)

  const handleSave = (change: ProjectChange) => {
    setChanges((prev) => [change, ...prev])
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Bitácora de cambios</span>
          <Button
            appearance="primary"
            icon={<Add20Regular />}
            size="small"
            onClick={() => setDrawerOpen(true)}
          >
            Nuevo cambio
          </Button>
        </div>

        <div className={styles.timeline}>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className={styles.dateRow}>
                <span className={styles.dateDot} />
                {date}
              </div>
              {items.map((change) => (
                <div key={change.id} className={styles.changeCard}>
                  <span
                    className={styles.changeDot}
                    style={{ backgroundColor: changeColor(change.type) }}
                  />
                  <div className={styles.changeHead}>
                    <Badge appearance="tint" color={changeBadgeColor(change.type)}>
                      {change.type}
                    </Badge>
                    <span className={styles.changeTitle}>{change.title}</span>
                  </div>
                  <div className={styles.changeDesc}>{change.description}</div>

                  <div className={styles.refs}>
                    {change.huRefs.map((h) => (
                      <span
                        key={h}
                        className={`${styles.refChip} ${styles.refChipJira}`}
                      >
                        <TicketDiagonal20Regular style={{ fontSize: '14px' }} />
                        {h}
                      </span>
                    ))}
                    {change.prRefs.map((pr) => (
                      <span
                        key={pr}
                        className={`${styles.refChip} ${styles.refChipPR}`}
                      >
                        <BranchFork20Regular style={{ fontSize: '14px' }} />
                        {pr}
                      </span>
                    ))}
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.author}>
                      <Avatar
                        name={change.author.name}
                        initials={change.author.initials}
                        color="brand"
                        size={20}
                      />
                      {change.author.name}
                    </span>
                    <span className={styles.metaBlock}>
                      ambiente: <strong>{change.environment}</strong>
                    </span>
                    <span className={styles.metaBlock}>
                      versión: <strong>{change.version}</strong>
                    </span>
                  </div>

                  {change.comment && (
                    <div className={styles.comment}>
                      <Avatar
                        name={change.comment.author.name}
                        initials={change.comment.author.initials}
                        color="brand"
                        size={24}
                      />
                      <div className={styles.commentMain}>
                        <span className={styles.commentAuthor}>
                          {change.comment.author.name}
                        </span>
                        <span className={styles.commentText}>
                          {change.comment.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <LinkSquare20Regular /> Enlaces Relacionados
          </div>
          <div className={styles.linkList}>
            {jira.map((j) => (
              <a key={j.id} href="#" className={styles.linkRow}>
                <TicketDiagonal20Regular className={styles.linkIcon} />
                <span className={styles.linkText}>
                  <span className={styles.linkKey}>{j.key}</span>
                  <span>{j.title}</span>
                </span>
              </a>
            ))}
            {devops.map((d) => (
              <a key={d.id} href="#" className={styles.linkRow}>
                <BranchFork20Regular className={styles.linkIcon} />
                <span className={styles.linkText}>
                  <span className={styles.linkKey}>PR-{d.prNumber}</span>
                  <span>{d.title}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <Attach20Regular /> Adjuntos
          </div>
          <div className={styles.linkList}>
            {attachments.map((a) => (
              <a key={a.id} href="#" className={styles.linkRow}>
                <span className={styles.linkIcon}>{attachmentIcon(a.name)}</span>
                <span className={styles.linkText}>
                  <Text weight="semibold" size={200}>
                    {a.name}
                  </Text>
                  <Caption1>
                    {a.size} &middot; {a.uploadedAt}
                  </Caption1>
                </span>
              </a>
            ))}
          </div>
        </div>
      </aside>

      <NewChangeDrawer
        open={drawerOpen}
        project={project}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
