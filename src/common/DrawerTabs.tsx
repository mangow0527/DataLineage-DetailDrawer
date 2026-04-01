import { Tabs } from 'antd'
import { Children, isValidElement, type ReactNode } from 'react'

export type DrawerTabsProps = {
  activeKey: string
  onChange: (key: string) => void
  children: ReactNode
}

export type DrawerTabsItemProps = {
  tabKey: string
  label: ReactNode
  children: ReactNode
}

function DrawerTabsItem(_props: DrawerTabsItemProps) {
  return null
}

const DrawerTabs = Object.assign(function DrawerTabs({ activeKey, onChange, children }: DrawerTabsProps) {
  const panes = Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return []
    if (child.type !== DrawerTabsItem) return []
    const { tabKey, label, children: paneChildren } = child.props as DrawerTabsItemProps
    return [
      // antd Tabs.TabPane: 用 key 标识页签，用 tab 传入标题（未来替换为公司 TabItem 的 key/label）
      <Tabs.TabPane key={tabKey} tab={label}>
        {paneChildren}
      </Tabs.TabPane>
    ]
  })

  return (
    <Tabs
      // antd Tabs: 当前激活的页签 key（未来替换为公司 Tab 的 “activeKey/selectedKey” 之类的受控值）
      activeKey={activeKey}
      // antd Tabs: 切换页签回调 (key: string)（未来替换为公司 Tab 的 onChange/onSelect 等）
      onChange={onChange}
    >
      {panes}
    </Tabs>
  )
}, { Item: DrawerTabsItem })

export default DrawerTabs
