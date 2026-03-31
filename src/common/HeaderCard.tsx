import type { ReactNode } from 'react'
import { fmtDate } from './format'
import './HeaderCard.less'

export type HeaderCardProps = {
  variant: 'tool' | 'table'
  theme: 'lightday' | 'darknight'
  title: string
  type?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  columnCount?: number | null
  categoryIcon?: ReactNode
  createdAtIcon?: ReactNode
  updatedAtIcon?: ReactNode
  columnCountIcon?: ReactNode
  assetBasePath?: string
  backgroundColor?: string
  backgroundImage?: string
}

function getAssetBasePath() {
  const w = globalThis as any
  const fromGlobal = w?.PUBLIC_PATH ?? w?.__PUBLIC_PATH__ ?? w?.publicPath ?? null
  const fromBaseTag =
    typeof document !== 'undefined' ? (document.querySelector('base') as HTMLBaseElement | null)?.href ?? null : null
  const raw = (fromGlobal ?? fromBaseTag ?? '') as string
  if (!raw) return ''
  if (raw.endsWith('/')) return raw
  return `${raw}/`
}

function toCssUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'none'
  if (trimmed === 'none') return 'none'
  if (trimmed.startsWith('url(')) return trimmed
  return `url(${trimmed})`
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

function ColumnsSvgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function HeaderCard({
  variant,
  theme,
  title,
  type,
  createdAt,
  updatedAt,
  columnCount,
  categoryIcon,
  createdAtIcon,
  updatedAtIcon,
  columnCountIcon,
  assetBasePath,
  backgroundColor,
  backgroundImage
}: HeaderCardProps) {
  const themeFolder = theme === 'lightday' ? 'lightday' : 'evening'
  const defaultBgPath = `images/${themeFolder}/header-card-${variant}.svg`
  const basePath = assetBasePath ?? getAssetBasePath()
  const defaultBgUrl = basePath ? `${basePath}${defaultBgPath}` : `/${defaultBgPath}`
  const resolvedBgImage = toCssUrl(backgroundImage ?? defaultBgUrl)
  return (
    <div
      className="job-header-card"
      data-variant={variant}
      data-theme={theme}
      style={{
        ...(backgroundColor ? ({ ['--job-header-card-bg-color']: backgroundColor } as Record<string, string>) : null),
        ...({ ['--job-header-card-bg-image']: resolvedBgImage } as Record<string, string>)
      }}
    >
      <div className="job-header-card__group">
        <div className="job-header-card__title">{title}</div>
        <div className="job-header-card__meta">
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              {categoryIcon ?? <GridSvgIcon />}
            </span>
            <div className="job-header-card__meta-text">
              <div className="job-header-card__meta-label">类别</div>
              <div className="job-header-card__meta-value">{type || 'N/A'}</div>
            </div>
          </div>
          {variant === 'tool' ? (
            <div className="job-header-card__meta-item">
              <span className="job-header-card__meta-icon" aria-hidden="true">
                {createdAtIcon ?? <CalendarSvgIcon />}
              </span>
              <div className="job-header-card__meta-text">
                <div className="job-header-card__meta-label">创建时间</div>
                <div className="job-header-card__meta-value">{fmtDate(createdAt ?? null)}</div>
              </div>
            </div>
          ) : (
            <div className="job-header-card__meta-item">
              <span className="job-header-card__meta-icon" aria-hidden="true">
                {columnCountIcon ?? <ColumnsSvgIcon />}
              </span>
              <div className="job-header-card__meta-text">
                <div className="job-header-card__meta-label">列数量</div>
                <div className="job-header-card__meta-value">{columnCount ?? 'N/A'}</div>
              </div>
            </div>
          )}
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              {updatedAtIcon ?? <CalendarSvgIcon />}
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
