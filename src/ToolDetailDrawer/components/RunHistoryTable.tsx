import type { ReactNode } from 'react'
import { Table } from 'antd'
import { fmtDate, fmtDuration, fmtRunStateZh, normalizeRunState, statusClass } from '../../common/format'
import drawerImgs from '../../common/DrawerImgs'
import type { RunHistoryItemViewModel } from '../data/view-model'
import TablePager from '../../common/TablePager'
import { useMemo } from 'react'
import { useTablePagination } from '../../common/useTablePagination'

type RunHistoryTableProps = {
  items: RunHistoryItemViewModel[]
  theme: 'lightday' | 'evening'
  onSelect: (runId: string) => void
}

function Th({
  icon,
  label
}: {
  icon?: ReactNode
  label: string
}) {
  return (
    <span className="dl-table__th">
      <span>{label}</span>
      {icon ? <span className="dl-table__th-icon">{icon}</span> : null}
    </span>
  )
}

export default function RunHistoryTable({ items, theme, onSelect }: RunHistoryTableProps) {
  const isEvening = theme === 'evening'
  const idIcon = isEvening ? drawerImgs.RUN_HISTORY_ID_DARK : drawerImgs.RUN_HISTORY_ID_LIGHT
  const stateIcon = isEvening ? drawerImgs.RUN_HISTORY_STATE_DARK : drawerImgs.RUN_HISTORY_STATE_LIGHT
  const timeIcon = isEvening ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
  const copyIcon = isEvening ? drawerImgs.COPY_DARK : drawerImgs.COPY_LIGHT
  const completeIcon = drawerImgs.RUN_STATUS_COMPLETE
  const failIcon = drawerImgs.RUN_STATUS_FAIL
  const runningIcon = drawerImgs.RUN_STATUS_RUNNING
  const abortIcon = drawerImgs.RUN_STATUS_ABORT
  const naIcon = drawerImgs.RUN_STATUS_NA

  const getStateIcon = (state: string) => {
    const normalized = normalizeRunState(state)
    if (normalized === 'COMPLETE') return completeIcon
    if (normalized === 'FAIL') return failIcon
    if (normalized === 'RUNNING') return runningIcon
    if (normalized === 'ABORT') return abortIcon
    return naIcon
  }

  const { pageSize, current, setCurrent, onPageSizeChange } = useTablePagination(items.length, 10)

  const pageItems = useMemo(() => {
    const start = (current - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, current, pageSize])

  return (
    <div>
      <Table
        className="tool-run-history-table"
        size="small"
        rowKey="id"
        dataSource={pageItems}
        pagination={false}
        onRow={(record: RunHistoryItemViewModel) => ({
          onClick: () => onSelect(record.id)
        })}
        columns={[
          {
            title: <Th icon={idIcon} label="ID" />,
            dataIndex: 'id',
            render: (v: string) => (
              <span className="dl-table__id-cell">
                <span
                  className="dl-table__id"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  }}
                >
                  {v?.length > 8 ? `${v.slice(0, 8)}...` : v}
                </span>
                <button
                  type="button"
                  aria-label="copy"
                  className="dl-table__copy"
                  onClick={(e) => {
                    e.stopPropagation()
                    v && navigator.clipboard?.writeText(v)
                  }}
                >
                  {copyIcon}
                </button>
              </span>
            )
          },
          {
            title: <Th icon={stateIcon} label="状态" />,
            dataIndex: 'state',
            render: (v: string) => (
              <span className="tool-run-history-table__state-cell">
                <span className={`tool-run-history-table__state-icon ${statusClass(v)}`} aria-hidden="true">
                  {getStateIcon(v)}
                </span>
                <span className="tool-run-history-table__state-text">{fmtRunStateZh(v)}</span>
              </span>
            )
          },
          { title: <Th icon={timeIcon} label="创建时间" />, dataIndex: 'createdAt', render: fmtDate },
          { title: <Th icon={timeIcon} label="开始时间" />, dataIndex: 'startedAt', render: fmtDate },
          { title: <Th icon={timeIcon} label="结束时间" />, dataIndex: 'endedAt', render: fmtDate },
          { title: <Th label="持续时间" />, dataIndex: 'durationMs', render: fmtDuration }
        ]}
      />
      <TablePager total={items.length} pageSize={pageSize} current={current} onChange={setCurrent} onPageSizeChange={onPageSizeChange} />
    </div>
  )
}
