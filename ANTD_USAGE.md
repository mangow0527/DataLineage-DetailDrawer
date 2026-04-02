# Ant Design 使用清单（用于重构计划）

本文档用于汇总当前项目中已使用的 Ant Design 组件及其所在文件位置，便于后续制定/拆解重构计划与替换策略。

## 组件清单（按组件）

| 组件 | 使用位置 |
| --- | --- |
| Drawer | [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2), [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) |
| Collapse | [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2), [src/ToolDetailDrawer/components/LatestRunPanel.tsx](src/ToolDetailDrawer/components/LatestRunPanel.tsx#L1), [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) |
| Table | [src/ToolDetailDrawer/components/RunHistoryTable.tsx](src/ToolDetailDrawer/components/RunHistoryTable.tsx#L2), [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) |
| Tabs | [src/common/DrawerTabs.tsx](src/common/DrawerTabs.tsx#L1) |
| Tooltip | [src/common/HeaderCard.tsx](src/common/HeaderCard.tsx#L2) |
| Tree | [src/common/JsonTree.tsx](src/common/JsonTree.tsx#L2) |
| Pagination | [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) |
| Input | [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) |
| Button | [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) |

## 组件清单（按文件）

| 文件 | antd 组件 |
| --- | --- |
| [src/ToolDetailDrawer/ToolDetailDrawer.tsx](src/ToolDetailDrawer/ToolDetailDrawer.tsx#L2) | Collapse、Drawer |
| [src/ToolDetailDrawer/components/LatestRunPanel.tsx](src/ToolDetailDrawer/components/LatestRunPanel.tsx#L1) | Collapse |
| [src/ToolDetailDrawer/components/RunHistoryTable.tsx](src/ToolDetailDrawer/components/RunHistoryTable.tsx#L2) | Table |
| [src/TableDetailDrawer/TableDetailDrawer.tsx](src/TableDetailDrawer/TableDetailDrawer.tsx#L2) | Button、Collapse、Drawer、Table |
| [src/common/HeaderCard.tsx](src/common/HeaderCard.tsx#L2) | Tooltip |
| [src/common/JsonTree.tsx](src/common/JsonTree.tsx#L2) | Tree |
| [src/common/DrawerTabs.tsx](src/common/DrawerTabs.tsx#L1) | Tabs |
| [src/common/TablePager.tsx](src/common/TablePager.tsx#L1) | Input、Pagination |

## 重构计划建议（拆解方向）

以下为基于“可逐步替换/可控风险”的拆解方向，便于你在同步修改时作为任务列表使用。

### 1) 抽象封装层（优先级高）

- Drawer：抽出统一的 `AppDrawer`（处理 closable/mask/maskClosable/层级、宽度、styles.body 等一致性）
- Table：抽出统一的 `AppTable`（统一 rowKey、空态、列头 icon 的写法、分页策略）
- Collapse / Tabs：抽出轻量 wrapper（统一 theme data-attrs / className 规则）

### 2) 主题一致性（优先级中）

- Tooltip：统一暗色/亮色的 tooltipColor/innerStyle，避免在业务组件内散落配置
- Tree：统一节点内容渲染、展开/选择交互、复制按钮样式

### 3) 组件依赖边界（优先级中）

- common 下的“组合组件”（如 HeaderCard / DrawerTitleBar / JsonTree / TablePager）保持只依赖通用数据结构，避免反向依赖业务目录
- 业务目录只通过 common 的 wrapper 使用 antd，减少直接 import antd 的散点
