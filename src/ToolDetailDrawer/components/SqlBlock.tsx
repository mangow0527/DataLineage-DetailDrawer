import { useMemo, type ReactNode } from 'react'

type SqlBlockProps = {
  content: string
}

const SQL_KEYWORDS = [
  'select',
  'from',
  'where',
  'join',
  'inner',
  'left',
  'right',
  'full',
  'outer',
  'cross',
  'on',
  'group',
  'by',
  'order',
  'having',
  'limit',
  'offset',
  'union',
  'all',
  'distinct',
  'insert',
  'into',
  'values',
  'update',
  'set',
  'delete',
  'create',
  'table',
  'alter',
  'drop',
  'truncate',
  'as',
  'and',
  'or',
  'not',
  'in',
  'exists',
  'between',
  'like',
  'is',
  'null',
  'case',
  'when',
  'then',
  'else',
  'end',
  'with'
] as const

const SQL_KEYWORDS_SET = new Set<string>(SQL_KEYWORDS)
const SQL_KEYWORDS_RE = new RegExp(`\\b(?:${SQL_KEYWORDS.join('|')})\\b`, 'gi')

export default function SqlBlock({ content }: SqlBlockProps) {
  const nodes = useMemo(() => {
    const parts = content.split(SQL_KEYWORDS_RE)
    const matches = content.match(SQL_KEYWORDS_RE) ?? []
    const out: ReactNode[] = []

    for (let i = 0; i < parts.length; i += 1) {
      const text = parts[i]
      if (text) out.push(text)

      const kw = matches[i]
      if (kw) {
        const lower = kw.toLowerCase()
        if (SQL_KEYWORDS_SET.has(lower)) {
          out.push(
            <span key={`kw-${i}-${kw}`} className="latest-info-panels__kw">
              {kw}
            </span>
          )
        } else {
          out.push(kw)
        }
      }
    }

    return out
  }, [content])

  return <pre className="latest-info-panels__code">{nodes}</pre>
}
