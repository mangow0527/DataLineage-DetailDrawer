import { fmtDate, fmtDuration, statusClass } from '../../common/format'
import type { SummaryViewModel } from '../data/view-model'

type SummaryGridProps = {
  summary: SummaryViewModel
}

export default function SummaryGrid({ summary }: SummaryGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <div>
        <div>CREATED AT</div>
        <div>{fmtDate(summary.createdAt)}</div>
      </div>
      <div>
        <div>UPDATED AT</div>
        <div>{fmtDate(summary.updatedAt)}</div>
      </div>
      <div>
        <div>LAST RUNTIME</div>
        <div>{fmtDuration(summary.lastRuntimeMs)}</div>
      </div>
      <div>
        <div>TYPE</div>
        <div>{summary.type || 'N/A'}</div>
      </div>
      <div>
        <div>LAST STARTED</div>
        <div>{fmtDate(summary.lastStartedAt)}</div>
      </div>
      <div>
        <div>LAST FINISHED</div>
        <div>{fmtDate(summary.lastFinishedAt)}</div>
      </div>
      <div>
        <div>RUNNING STATUS</div>
        <div>
          {summary.runningStatus ? (
            <span className={`status-pill ${statusClass(summary.runningStatus)}`}>{summary.runningStatus}</span>
          ) : (
            'N/A'
          )}
        </div>
      </div>
      <div>
        <div>PARENT JOB</div>
        <div>{summary.parentJobName || 'N/A'}</div>
      </div>
    </div>
  )
}
