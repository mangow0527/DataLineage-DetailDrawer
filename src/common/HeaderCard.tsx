import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Tooltip } from 'antd'
import drawerImgs from './DrawerIcons'
import { fmtDate } from './format'
import './HeaderCard.less'
import HEADER_CARD_TOOL_LIGHT_SVG from './assets/header-card-tool-lightday.svg?raw'
import HEADER_CARD_TABLE_LIGHT_SVG from './assets/header-card-table-lightday.svg?raw'
import HEADER_CARD_TOOL_DARK_SVG from './assets/header-card-tool-dark.svg?raw'
import HEADER_CARD_TABLE_DARK_SVG from './assets/header-card-table-dark.svg?raw'

export type HeaderCardProps = {
  variant: 'tool' | 'table'
  theme: 'lightday' | 'dark'
  title: string
  createdAt?: string | null
  updatedAt?: string | null
  columnCount?: number | null
  categoryIcon?: ReactNode
  createdAtIcon?: ReactNode
  updatedAtIcon?: ReactNode
  columnCountIcon?: ReactNode
  backgroundColor?: string
  backgroundImage?: string
}

function toCssUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'none'
  if (trimmed === 'none') return 'none'
  if (trimmed.startsWith('url(')) return trimmed
  return `url(${trimmed})`
}

function svgToCssUrl(svg: string) {
  const normalized = svg.replace(/[\r\n]+/g, '').trim()
  const encoded = encodeURIComponent(normalized)
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
  return `url("data:image/svg+xml,${encoded}")`
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
  backgroundColor,
  backgroundImage
}: HeaderCardProps) {
  const defaultBgSvg =
    variant === 'tool'
      ? theme === 'lightday'
        ? HEADER_CARD_TOOL_LIGHT_SVG
        : HEADER_CARD_TOOL_DARK_SVG
      : theme === 'lightday'
        ? HEADER_CARD_TABLE_LIGHT_SVG
        : HEADER_CARD_TABLE_DARK_SVG
  const resolvedBgImage = backgroundImage ? toCssUrl(backgroundImage) : svgToCssUrl(defaultBgSvg)
  const { ref: titleRef, isOverflowing: isTitleOverflowing } = useTextOverflow(title)
  const tooltipColor = theme === 'lightday' ? '#ffffff' : '#000000'
  const tooltipInnerStyle = theme === 'lightday' ? { color: '#000000' } : { color: '#ffffff' }
  const categoryValue = variant === 'tool' ? 'Tool' : 'Table'
  const isLight = theme === 'lightday'
  const defaultCategoryIcon =
    variant === 'tool'
      ? isLight
        ? drawerImgs.HEADER_CARD_TOOL_CATEGORY_LIGHT
        : drawerImgs.HEADER_CARD_TOOL_CATEGORY_DARK
      : isLight
        ? drawerImgs.HEADER_CARD_CATEGORY_LIGHT
        : drawerImgs.HEADER_CARD_CATEGORY_DARK
  const defaultTimeIcon =
    variant === 'tool'
      ? isLight
        ? drawerImgs.HEADER_CARD_TOOL_TIME_LIGHT
        : drawerImgs.HEADER_CARD_TOOL_TIME_DARK
      : isLight
        ? drawerImgs.HEADER_CARD_TIME_LIGHT
        : drawerImgs.HEADER_CARD_TIME_DARK
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
          <div className="job-header-card__title">
            <div ref={titleRef} className="job-header-card__title-text">
              {title}
            </div>
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
