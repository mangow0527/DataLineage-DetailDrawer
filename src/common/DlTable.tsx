import { Tooltip } from 'antd'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import './DlTable.less'

export type DlTableColumn<T> = {
  key: string
  title: ReactNode
  width?: number
  render: (record: T, index: number) => ReactNode
}

export function DlEllipsisText({
  text,
  mono = false,
  className
}: {
  text: string
  mono?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [overflowing, setOverflowing] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setOverflowing(el.scrollWidth > el.clientWidth)
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const recalc = () => setOverflowing(el.scrollWidth > el.clientWidth)
    recalc()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => recalc())
      ro.observe(el)
      return () => ro.disconnect()
    }

    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [text])

  return (
    <Tooltip title={overflowing ? text : null}>
      <span
        ref={ref}
        className={[
          'dl-ellipsis-text',
          mono ? 'dl-ellipsis-text--mono' : null,
          className ? className : null
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {text}
      </span>
    </Tooltip>
  )
}

export default function DlTable<T>({
  columns,
  dataSource,
  rowKey,
  onRowClick,
  className
}: {
  columns: DlTableColumn<T>[]
  dataSource: T[]
  rowKey: (record: T, index: number) => string
  onRowClick?: (record: T) => void
  className?: string
}) {
  const colStyles = useMemo(() => columns.map((c) => ({ width: c.width })), [columns])

  return (
    <div className={['dl-table', className ? className : null].filter(Boolean).join(' ')}>
      <div className="dl-table__container">
        <div className="dl-table__content">
          <table className="dl-table__table">
            <colgroup>
              {colStyles.map((c, idx) => (
                <col key={idx} style={c.width != null ? { width: c.width } : undefined} />
              ))}
            </colgroup>
            <thead className="dl-table__thead">
              <tr className="dl-table__row dl-table__row--head">
                {columns.map((c) => (
                  <th key={c.key} className="dl-table__th-cell">
                    {c.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="dl-table__tbody">
              {dataSource.map((record, index) => (
                <tr
                  key={rowKey(record, index)}
                  className="dl-table__row"
                  onClick={onRowClick ? () => onRowClick(record) : undefined}
                  data-clickable={onRowClick ? 'true' : 'false'}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="dl-table__td-cell">
                      {c.render(record, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
