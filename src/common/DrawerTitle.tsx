import drawerImgs from './DrawerImgs'

type DrawerTitleProps = {
  currentTheme: string
  onClose: () => void
}

export default function DrawerTitle({ currentTheme, onClose }: DrawerTitleProps) {
  const isLight = currentTheme === 'lightday'
  const theme = isLight ? 'lightday' : 'evening'
  const closeIcon = isLight ? drawerImgs.CLOSE_LIGHT : drawerImgs.CLOSE_DARK
  const deleteIcon = isLight ? drawerImgs.DELETE_LIGHT : drawerImgs.DELETE_DARK

  return (
    <div className="drawer-title-bar" data-theme={theme}>
      <div className="drawer-title-bar__title">详情</div>
      <div className="drawer-title-bar__actions">
        <div className="drawer-menu-anchor">
          <button
            type="button"
            className="drawer-icon-button drawer-icon-button--danger"
            aria-label="Delete"
            onClick={() => {
              const menu = document.getElementById('drawer-delete-menu')
              if (!menu) return
              const isOpen = menu.classList.contains('drawer-menu--open')
              if (isOpen) {
                menu.classList.remove('drawer-menu--open')
              } else {
                menu.classList.add('drawer-menu--open')
              }
            }}
          >
            {deleteIcon}
          </button>
          <div id="drawer-delete-menu" className="drawer-menu">
            <div
              className="drawer-menu__item"
              onClick={() => {
                const menu = document.getElementById('drawer-delete-menu')
                menu?.classList.remove('drawer-menu--open')
                void 0
              }}
            >
              删除
            </div>
          </div>
        </div>
        <button type="button" className="drawer-icon-button drawer-icon-button--close" aria-label="Close" onClick={onClose}>
          {closeIcon}
        </button>
      </div>
    </div>
  )
}
