import { fmtDateTime, fmtDurationHmsMs, fmtRunStateZh } from '../../common/format'
import type { SummaryViewModel } from '../data/view-model'

type ToolHeaderBarProps = {
  summary: SummaryViewModel
}

function fmtJobType(type: SummaryViewModel['type']) {
  if (type === 'BATCH') return 'Batch'
  if (type === 'STREAM') return 'Stream'
  return 'N/A'
}

export default function ToolHeaderBar({ summary }: ToolHeaderBarProps) {
  const items = [
    { label: '最后运行时间', value: fmtDurationHmsMs(summary.lastRuntimeMs) },
    { label: '最新开始时间', value: fmtDateTime(summary.lastStartedAt) },
    { label: '最新结束时间', value: fmtDateTime(summary.lastFinishedAt) },
    { label: '类型', value: fmtJobType(summary.type) },
    { label: '运行状态', value: fmtRunStateZh(summary.runningStatus) }
  ]

  return (
    <div className="tool-header-bar" role="group" aria-label="工具任务摘要">
      {items.map((item) => (
        <div key={item.label} className="tool-header-bar__item">
          <div className="tool-header-bar__label">{item.label}</div>
          <div className="tool-header-bar__value">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
