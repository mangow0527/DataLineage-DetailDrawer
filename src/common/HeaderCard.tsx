import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Tooltip } from 'antd'
import drawerImgs from './DrawerImgs'
import { fmtDate } from './format'
import './HeaderCard.less'

export type HeaderCardProps = {
  variant: 'tool' | 'table'
  theme: 'lightday' | 'evening'
  title: string
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

function useTextOverflow(value: string) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setIsOverflowing(el.scrollWidth > el.clientWidth)
  }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const recalc = () => setIsOverflowing(el.scrollWidth > el.clientWidth)
    recalc()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => recalc())
      ro.observe(el)
      return () => ro.disconnect()
    }

    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [value])

  return { ref, isOverflowing }
}

export default function HeaderCard({
  variant,
  theme,
  title,
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
  const { ref: titleRef, isOverflowing: isTitleOverflowing } = useTextOverflow(title)
  const tooltipColor = theme === 'lightday' ? '#ffffff' : '#000000'
  const tooltipInnerStyle = theme === 'lightday' ? { color: '#000000' } : { color: '#ffffff' }
  const categoryValue = variant === 'tool' ? 'Tool' : 'Table'
  const isLight = theme === 'lightday'
  const defaultCategoryIcon = isLight ? drawerImgs.HEADER_CARD_CATEGORY_LIGHT : drawerImgs.HEADER_CARD_CATEGORY_DARK
  const defaultTimeIcon = isLight ? drawerImgs.HEADER_CARD_TIME_LIGHT : drawerImgs.HEADER_CARD_TIME_DARK
  const defaultColumnsIcon = isLight ? drawerImgs.HEADER_CARD_COLUMNS_LIGHT : drawerImgs.HEADER_CARD_COLUMNS_DARK

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
        <Tooltip
          title={isTitleOverflowing ? title : null}
          color={tooltipColor}
          overlayInnerStyle={tooltipInnerStyle}
        >
          <div ref={titleRef} className="job-header-card__title">
            {title}
          </div>
        </Tooltip>
        <div className="job-header-card__meta">
          <div className="job-header-card__meta-item">
            <span className="job-header-card__meta-icon" aria-hidden="true">
              {categoryIcon ?? defaultCategoryIcon}
            </span>
            <div className="job-header-card__meta-text">
              <div className="job-header-card__meta-value">{categoryValue}</div>
              <div className="job-header-card__meta-label">类别</div>
            </div>
          </div>
          {variant === 'tool' ? (
            <>
              <div className="job-header-card__meta-item">
                <span className="job-header-card__meta-icon" aria-hidden="true">
                  {createdAtIcon ?? defaultTimeIcon}
                </span>
                <div className="job-header-card__meta-text">
                  <div className="job-header-card__meta-value">{fmtDate(createdAt ?? null)}</div>
                  <div className="job-header-card__meta-label">创建时间</div>
                </div>
              </div>
              <div className="job-header-card__meta-item">
                <span className="job-header-card__meta-icon" aria-hidden="true">
                  {updatedAtIcon ?? defaultTimeIcon}
                </span>
                <div className="job-header-card__meta-text">
                  <div className="job-header-card__meta-value">{fmtDate(updatedAt ?? null)}</div>
                  <div className="job-header-card__meta-label">最后修改时间</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="job-header-card__meta-item">
                <span className="job-header-card__meta-icon" aria-hidden="true">
                  {updatedAtIcon ?? defaultTimeIcon}
                </span>
                <div className="job-header-card__meta-text">
                  <div className="job-header-card__meta-value">{fmtDate(updatedAt ?? null)}</div>
                  <div className="job-header-card__meta-label">最后修改时间</div>
                </div>
              </div>
              <div className="job-header-card__meta-item">
                <span className="job-header-card__meta-icon" aria-hidden="true">
                  {columnCountIcon ?? defaultColumnsIcon}
                </span>
                <div className="job-header-card__meta-text">
                  <div className="job-header-card__meta-value">{columnCount ?? 'N/A'}</div>
                  <div className="job-header-card__meta-label">列数量</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
