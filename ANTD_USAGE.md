# Ant Design 使用清单（用于重构计划）

本文档用于汇总当前项目中已使用的 Ant Design 组件及其所在文件位置，便于后续制定/拆解重构计划与替换策略。

## 组件清单（按组件）

| 组件 | 使用位置 |
| --- | --- |
| Drawer | [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2), [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) |
| Collapse | [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2), [src/ToolDetailDrawer/components/LatestRunPanel.tsx](src/ToolDetailDrawer/components/LatestRunPanel.tsx#L1), [src/TableDetailDrawer/components/LatestSchemaPanel.tsx](src/TableDetailDrawer/components/LatestSchemaPanel.tsx#L1), [src/TableDetailDrawer/components/VersionDetailPanel.tsx](src/TableDetailDrawer/components/VersionDetailPanel.tsx#L1) |
| Tabs | [src/common/DrawerTabs.tsx](src/common/DrawerTabs.tsx#L1) |
| Tooltip | [src/common/HeaderCard.tsx](src/common/HeaderCard.tsx#L2), [src/common/DlTable.tsx](src/common/DlTable.tsx#L1) |
| Pagination | [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) |
| Input | [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) |
| ConfigProvider | [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) |

## 组件清单（按文件）

| 文件 | antd 组件 |
| --- | --- |
| [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2) | Collapse、Drawer |
| [src/ToolDetailDrawer/components/LatestRunPanel.tsx](src/ToolDetailDrawer/components/LatestRunPanel.tsx#L1) | Collapse |
| [src/TableDetailDrawer/components/LatestSchemaPanel.tsx](src/TableDetailDrawer/components/LatestSchemaPanel.tsx#L1) | Collapse |
| [src/TableDetailDrawer/components/VersionDetailPanel.tsx](src/TableDetailDrawer/components/VersionDetailPanel.tsx#L1) | Collapse |
| [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) | Drawer |
| [src/common/HeaderCard.tsx](src/common/HeaderCard.tsx#L2) | Tooltip |
| [src/common/DlTable.tsx](src/common/DlTable.tsx#L1) | Tooltip |
| [src/common/DrawerTabs.tsx](src/common/DrawerTabs.tsx#L1) | Tabs |
| [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) | ConfigProvider、Input、Pagination |

## 重构计划建议（拆解方向）

以下内容是给 Claude Code 的可执行提示词（Prompt）。目标是把本仓库当前仍在使用的 antd 组件，直接替换为 eview-ui 的对应组件（不新增“适配层”/wrapper），并保持现有交互与样式不回退。

> eview-ui 包路径占位符（你后续替换为真实包名/入口）：
> - `<<EVIEW_UI_PACKAGE>>`（例如 `eview-ui` 或 monorepo 内部入口）

### Claude Code 提示词（请按顺序执行）

1) 在 `src` 全局搜索 `from 'antd'`，确保只替换这些文件里的 antd import（不要引入新的 antd 用法）：

- `src/ToolDetailDrawer/ToolDetailDrawer.tsx`：`Drawer`、`Collapse`
- `src/TableDetailDrawer/TableDetailDrawer.tsx`：`Drawer`
- `src/ToolDetailDrawer/components/LatestRunPanel.tsx`：`Collapse`
- `src/TableDetailDrawer/components/LatestSchemaPanel.tsx`：`Collapse`
- `src/TableDetailDrawer/components/VersionDetailPanel.tsx`：`Collapse`
- `src/common/DrawerTabs.tsx`：`Tabs`
- `src/common/HeaderCard.tsx`：`Tooltip`
- `src/common/DlTable.tsx`：`Tooltip`
- `src/common/TablePager.tsx`：`ConfigProvider`、`Pagination`、`Input`

2) 逐文件替换 antd → eview-ui（保持导出 API 不变）：

- `src/common/DrawerTabs.tsx`
  - 将 antd `Tabs` 替换为 eview-ui `Tabs`
  - 需要保持：`activeKey`、`onChange`、`DrawerTabs.Item(tabKey/label)` 的行为一致
  - 注意：`DrawerTabs.less` 使用的是 `[role=tab]` 选择器；替换后如果 eview-ui 的 DOM 不带 role，需要在渲染层补齐 role 属性（不要改 CSS 变量体系）

- `src/common/TablePager.tsx`
  - 将 antd `Pagination/Input/ConfigProvider` 替换为 eview-ui 对应组件
  - 需要保持：pageSize 切换、页码切换、“前往”输入 Enter 跳转
  - 关键注意：下拉弹层必须挂在 `.drawer-shell` 内（当前通过 getPopupContainer 保证 dark 模式样式生效）；若 eview-ui 的下拉组件支持 `getPopupContainer/teleport/appendTo/container`，必须设置到 `.drawer-shell`（否则深色样式会丢）
  - `TablePager.less` 里存在少量对下拉/分页的暗色样式选择器；替换后如 class 不同，需要同步调整选择器以保证 dark 模式一致

- `src/common/HeaderCard.tsx` 与 `src/common/DlTable.tsx`
  - 将 antd `Tooltip` 替换为 eview-ui `Tooltip`
  - 需要保持：仅溢出时显示 tooltip 的逻辑不变（title 为 null 时不显示）
  - 注意：HeaderCard 里 tooltip 的 `color/overlayInnerStyle` 属于 antd 细节；替换后需要用 eview-ui 的等价 API 实现同样视觉（lightday 白底黑字、dark 黑底白字）

- `src/ToolDetailDrawer/ToolDetailDrawer.tsx` 与 `src/TableDetailDrawer/TableDetailDrawer.tsx`
  - 将 antd `Drawer` 替换为 eview-ui `Drawer`
  - 需要保持：受控 props `visible/onClose/currentTheme` 的行为不变（`visible=false` 时组件 return null）
  - 需要保持：二级抽屉（run/version detail）叠层、mask（透明）、zIndex 层级策略一致
  - 注意：当前 Drawer 使用了 `styles={{ body: ... }}`；eview-ui 若 API 不同，需要等价实现“body 满高、flex 布局、禁止溢出”这些布局效果

- `src/ToolDetailDrawer/ToolDetailDrawer.tsx`、`src/ToolDetailDrawer/components/LatestRunPanel.tsx`、`src/TableDetailDrawer/components/LatestSchemaPanel.tsx`、`src/TableDetailDrawer/components/VersionDetailPanel.tsx`
  - 将 antd `Collapse` 替换为 eview-ui `Collapse`
  - 需要保持：`ghost`、`defaultActiveKey` 行为与当前一致
  - 注意：`LatestInfoPanels.less` 仍然有少量针对 `.dl-collapse > .ant-collapse-*` 的选择器；替换后必须调整这些选择器到 eview-ui 的 DOM/class，否则 Collapse 的间距/暗色 header 颜色会回退

3) 全局注意事项（必须遵守）
- 主题字段：只允许 `lightday | dark`；dark 模式依赖 `.drawer-shell[data-theme='dark']`，替换组件不允许引入新的主题上下文
- 已有交互不回退：复制按钮 hover 仅在对应字段出现、tooltip 仅溢出出现、表格表头 icon hover 变蓝等
- 运行并保证通过：`npx tsc --noEmit` 与 `npm run build`
- 替换完成后回写本文档：
  - `## 组件清单（按组件）` 与 `## 组件清单（按文件）` 中的 antd 组件应为 0（或仅保留你明确允许暂时不替换的组件）
