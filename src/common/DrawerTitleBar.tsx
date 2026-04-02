import drawerImgs from './DrawerImgs'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const BACK_ICON = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path d="M14.5 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type DrawerTitleBarProps = {
  currentTheme: 'lightday' | 'evening'
  title?: ReactNode
  onBack?: () => void
  showMoreAction?: boolean
  showCloseAction?: boolean
  onClose: () => void
}

export default function DrawerTitleBar({
  currentTheme,
  title,
  onBack,
  showMoreAction = true,
  showCloseAction = true,
  onClose
}: DrawerTitleBarProps) {
  const isLight = currentTheme === 'lightday'
  const closeIcon = isLight ? drawerImgs.CLOSE_LIGHT : drawerImgs.CLOSE_DARK
  const moreActionsIcon = isLight ? drawerImgs.MORE_ACTIONS_LIGHT : drawerImgs.MORE_ACTIONS_DARK
  const [menuOpen, setMenuOpen] = useState(false)
  const menuAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const anchor = menuAnchorRef.current
      if (!anchor) return
      if (anchor.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (showMoreAction) return
    setMenuOpen(false)
  }, [showMoreAction])

  return (
    <div className="drawer-title-bar" data-theme={currentTheme}>
      <div className="drawer-title-bar__title">
        {onBack ? (
          <button type="button" className="drawer-icon-button drawer-icon-button--back" aria-label="Back" onClick={onBack}>
            {BACK_ICON}
          </button>
        ) : null}
        <span className="drawer-title-bar__title-text">{title ?? '详情'}</span>
      </div>
      <div className="drawer-title-bar__actions">
        {showMoreAction ? (
          <div className="drawer-menu-anchor" ref={menuAnchorRef}>
            <button
              type="button"
              className="drawer-icon-button drawer-icon-button--danger"
              aria-label="Actions"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {moreActionsIcon}
            </button>
            <div className={`drawer-menu${menuOpen ? ' drawer-menu--open' : ''}`}>
              <div
                className="drawer-menu__item"
                onClick={() => {
                  setMenuOpen(false)
                  void 0
                }}
              >
                删除
              </div>
            </div>
          </div>
        ) : null}
        {showCloseAction ? (
          <button type="button" className="drawer-icon-button drawer-icon-button--close" aria-label="Close" onClick={onClose}>
            {closeIcon}
          </button>
        ) : null}
      </div>
    </div>
  )
}
