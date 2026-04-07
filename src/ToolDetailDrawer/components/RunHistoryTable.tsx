import type { ReactNode } from 'react'
import { fmtDate, fmtDuration, fmtRunStateZh, normalizeRunState } from '../../common/format'
import drawerImgs from '../../common/DrawerIcons'
import DlTable from '../../common/DlTable'
import type { RunHistoryItemViewModel } from '../data/view-model'
import TablePager from '../../common/TablePager'
import { useMemo } from 'react'
import { useTablePagination } from '../../common/useTablePagination'
import './RunHistoryTable.less'

type RunHistoryTableProps = {
  items: RunHistoryItemViewModel[]
  theme: 'lightday' | 'dark'
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
  const isDark = theme === 'dark'
  const idIcon = isDark ? drawerImgs.RUN_HISTORY_ID_DARK : drawerImgs.RUN_HISTORY_ID_LIGHT
  const stateIcon = isDark ? drawerImgs.RUN_HISTORY_STATE_DARK : drawerImgs.RUN_HISTORY_STATE_LIGHT
  const timeIcon = isDark ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
  const copyIcon = isDark ? drawerImgs.COPY_DARK : drawerImgs.COPY_LIGHT
  const completeIcon = drawerImgs.RUN_STATUS_COMPLETE
  const failIcon = drawerImgs.RUN_STATUS_FAIL
  const runningIcon = drawerImgs.RUN_STATUS_RUNNING
  const abortIcon = drawerImgs.RUN_STATUS_ABORT
  const startIcon = drawerImgs.RUN_STATUS_START
  const otherIcon = drawerImgs.RUN_STATUS_OTHER

  const getStateClass = (state: string) => {
    const normalized = normalizeRunState(state)
    if (normalized === 'START') return 'status-start'
    if (normalized === 'RUNNING') return 'status-running'
    if (normalized === 'COMPLETE') return 'status-completed'
    if (normalized === 'FAIL') return 'status-failed'
    if (normalized === 'ABORT') return 'status-aborted'
    return 'status-other'
  }

  const getStateIcon = (state: string) => {
    const normalized = normalizeRunState(state)
    if (normalized === 'START') return startIcon
    if (normalized === 'COMPLETE') return completeIcon
    if (normalized === 'FAIL') return failIcon
    if (normalized === 'RUNNING') return runningIcon
    if (normalized === 'ABORT') return abortIcon
    return otherIcon
  }

  const { pageSize, current, setCurrent, onPageSizeChange } = useTablePagination(items.length, 10)

  const pageItems = useMemo(() => {
    const start = (current - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, current, pageSize])

  return (
    <div>
      <DlTable
        className="tool-run-history-table"
        columns={[
          {
            key: 'id',
            title: <Th icon={idIcon} label="ID" />,
            width: 180,
            render: (row) => (
              <span className="dl-table__id-cell">
                <span className="dl-table__id">
                  {row.id?.length > 8 ? `${row.id.slice(0, 8)}...` : row.id}
                </span>
                <button
                  type="button"
                  aria-label="copy"
                  className="dl-table__copy"
                  onClick={(e) => {
                    e.stopPropagation()
                    row.id && navigator.clipboard?.writeText(row.id)
                  }}
                >
                  {copyIcon}
                </button>
              </span>
            )
          },
          {
            key: 'state',
            title: <Th icon={stateIcon} label="状态" />,
            width: 120,
            render: (row) => (
              <span className="tool-run-history-table__state-cell">
                <span className={`tool-run-history-table__state-icon ${getStateClass(row.state)}`} aria-hidden="true">
                  {getStateIcon(row.state)}
                </span>
                <span className="tool-run-history-table__state-text">{fmtRunStateZh(row.state)}</span>
              </span>
            )
          },
          { key: 'createdAt', title: <Th icon={timeIcon} label="创建时间" />, width: 200, render: (row) => fmtDate(row.createdAt) },
          { key: 'startedAt', title: <Th icon={timeIcon} label="开始时间" />, width: 200, render: (row) => fmtDate(row.startedAt) },
          { key: 'endedAt', title: <Th icon={timeIcon} label="结束时间" />, width: 200, render: (row) => fmtDate(row.endedAt) },
          { key: 'durationMs', title: <Th label="持续时间" />, width: 140, render: (row) => fmtDuration(row.durationMs) }
        ]}
        dataSource={pageItems}
        rowKey={(row) => row.id}
        onRowClick={(row) => onSelect(row.id)}
      />
      <TablePager total={items.length} pageSize={pageSize} current={current} onChange={setCurrent} onPageSizeChange={onPageSizeChange} />
    </div>
  )
}
