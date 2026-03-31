import { fmtDate } from '../../common/format'

type HeaderBarProps = {
  title: string
  type: string | null | undefined
  createdAt: string | null | undefined
  updatedAt: string | null | undefined
}

function GridSvgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function CalendarSvgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function HeaderBar({ title, type, createdAt, updatedAt }: HeaderBarProps) {
  return (
    <div className="job-header-card">
      <div className="job-header-card__group">
        <div className="job-header-card__title">{title}</div>
        <div className="job-header-card__meta">
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              <GridSvgIcon />
            </span>
            <div className="job-header-card__meta-text">
              <div className="job-header-card__meta-label">类别</div>
              <div className="job-header-card__meta-value">{type || 'N/A'}</div>
            </div>
          </div>
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              <CalendarSvgIcon />
            </span>
            <div className="job-header-card__meta-text">
              <div className="job-header-card__meta-label">创建时间</div>
              <div className="job-header-card__meta-value">{fmtDate(createdAt ?? null)}</div>
            </div>
          </div>
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              <CalendarSvgIcon />
            </span>
            <div className="job-header-card__meta-text">
              <div className="job-header-card__meta-label">最后修改时间</div>
              <div className="job-header-card__meta-value">{fmtDate(updatedAt ?? null)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
