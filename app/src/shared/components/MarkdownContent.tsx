import type { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { makeStyles, tokens } from '@fluentui/react-components'

const MONO =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace"

const useStyles = makeStyles({
  root: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: tokens.colorNeutralForeground1,
    maxWidth: '820px',
    '& h1': {
      fontSize: '28px',
      fontWeight: 700,
      marginTop: '32px',
      marginBottom: '16px',
      color: tokens.colorNeutralForeground1,
      letterSpacing: '-0.02em',
      paddingBottom: '10px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: tokens.colorNeutralStroke2,
    },
    '& h1:first-child': {
      marginTop: 0,
    },
    '& h2': {
      fontSize: '22px',
      fontWeight: 700,
      marginTop: '28px',
      marginBottom: '12px',
      color: tokens.colorNeutralForeground1,
      letterSpacing: '-0.015em',
    },
    '& h3': {
      fontSize: '17px',
      fontWeight: 600,
      marginTop: '24px',
      marginBottom: '10px',
      color: tokens.colorNeutralForeground1,
    },
    '& h4': {
      fontSize: '15px',
      fontWeight: 600,
      marginTop: '20px',
      marginBottom: '8px',
      color: tokens.colorNeutralForeground2,
    },
    '& p': {
      marginTop: 0,
      marginBottom: '14px',
      color: tokens.colorNeutralForeground2,
    },
    '& strong': {
      fontWeight: 600,
      color: tokens.colorNeutralForeground1,
    },
    '& em': {
      fontStyle: 'italic',
    },
    '& a': {
      color: tokens.colorBrandForeground1,
      textDecoration: 'none',
      fontWeight: 500,
      ':hover': {
        textDecoration: 'underline',
      },
    },
    '& ul, & ol': {
      marginTop: 0,
      marginBottom: '14px',
      paddingLeft: '24px',
      color: tokens.colorNeutralForeground2,
    },
    '& li': {
      marginBottom: '6px',
      lineHeight: 1.65,
    },
    '& li > p': {
      marginBottom: '6px',
    },
    '& code': {
      fontFamily: MONO,
      fontSize: '12.5px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorBrandForeground1,
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
    },
    '& pre': {
      margin: '0 0 16px 0',
      padding: '16px 18px',
      borderRadius: '10px',
      backgroundColor: '#012F36',
      color: '#EAFDFF',
      overflowX: 'auto',
      fontFamily: MONO,
      fontSize: '12.5px',
      lineHeight: 1.65,
      borderTopWidth: '1px',
      borderRightWidth: '1px',
      borderBottomWidth: '1px',
      borderLeftWidth: '1px',
      borderTopStyle: 'solid',
      borderRightStyle: 'solid',
      borderBottomStyle: 'solid',
      borderLeftStyle: 'solid',
      borderTopColor: 'rgba(189, 241, 248, 0.15)',
      borderRightColor: 'rgba(189, 241, 248, 0.15)',
      borderBottomColor: 'rgba(189, 241, 248, 0.15)',
      borderLeftColor: 'rgba(189, 241, 248, 0.15)',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
    },
    '& pre > code': {
      padding: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      backgroundColor: 'transparent',
      color: 'inherit',
      fontSize: 'inherit',
    },
    '& blockquote': {
      margin: '0 0 16px 0',
      padding: '10px 16px',
      borderLeftWidth: '3px',
      borderLeftStyle: 'solid',
      borderLeftColor: tokens.colorBrandStroke1,
      backgroundColor: tokens.colorNeutralBackground2,
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      color: tokens.colorNeutralForeground3,
      fontStyle: 'italic',
    },
    '& blockquote > p:last-child': {
      marginBottom: 0,
    },
    '& hr': {
      borderTopWidth: '0',
      borderRightWidth: '0',
      borderLeftWidth: '0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: tokens.colorNeutralStroke2,
      margin: '24px 0',
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '16px',
      fontSize: '13px',
    },
    '& th': {
      textAlign: 'left',
      padding: '10px 12px',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: tokens.colorNeutralForeground3,
      backgroundColor: tokens.colorNeutralBackground2,
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: tokens.colorNeutralStroke2,
      fontFamily: MONO,
    },
    '& td': {
      padding: '10px 12px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: tokens.colorNeutralStroke2,
      color: tokens.colorNeutralForeground2,
      verticalAlign: 'top',
    },
    '& img': {
      maxWidth: '100%',
      borderRadius: '8px',
      marginBottom: '16px',
    },
  },
})

interface MarkdownContentProps {
  content: string
}

export const MarkdownContent: FC<MarkdownContentProps> = ({ content }) => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
