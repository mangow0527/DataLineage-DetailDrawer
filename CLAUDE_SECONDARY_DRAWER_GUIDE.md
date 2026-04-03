# 二层抽屉（Secondary Drawer）实现指南（给 Claude Code 的复刻说明）

目标：让 Claude 在“公司项目中不使用 antd”的前提下，使用公司内部组件完整复刻本仓库的二层抽屉交互与视觉层级。

本文档描述的是“行为定义 + 组件契约 + 状态机”，而不是某个 UI 库的写法。实现时请将文中的 `CompanyDrawer / CompanyOverlay / CompanyHeaderBar` 等占位符替换为公司内部的对应组件。

---

## 1. 二层抽屉的定义（必须一致）

二层抽屉 = 在右侧主抽屉（一级抽屉）已打开时，用户点击一级抽屉内部的某一条目（例如运行历史的某次 run、版本历史的某个 version），在右侧再打开一个新的抽屉面板，用于展示该条目的详情。

核心定义（必须满足）：

1) **二层抽屉与一级抽屉是“同级渲染”的两个抽屉（sibling），不是嵌套在一级抽屉 DOM 内的 Drawer。**
- 目的：保证二层抽屉的位置、层级、遮罩行为与一级抽屉一致，且不受一级抽屉滚动容器/overflow 影响。

2) **二层抽屉的关闭只回到一级抽屉，不允许关闭一级抽屉。**
- 关闭来源包含：点击遮罩、点击返回按钮、（如有）ESC 触发关闭。

3) **二层抽屉需要“可点击遮罩，但视觉上遮罩透明”。**
- 也就是说：用户点击二层抽屉外侧区域应该返回一级抽屉，但不能出现变暗蒙版遮挡一级抽屉内容。
- 表现：`mask = true` 且 mask 背景为 `transparent`（或用公司内部 overlay 实现同等效果）。

4) **二层抽屉标题栏只保留“返回按钮”，不出现“更多操作/删除”与“右上角关闭 X”。**
- 返回按钮与关闭 X 功能重复，本仓库最终选择移除 X。

---

## 2. 当前仓库的参考实现（用于理解行为）

这两处就是“二层抽屉逻辑”本体（仅用于理解，不要求照搬 antd）：

- Tool 二层抽屉：`src/ToolDetailDrawer/ToolDetailDrawer.tsx`
  - 二层 Drawer：第二个 `<Drawer />`（open 由 `selectedRunId` 驱动）
  - 关闭只清空 `selectedRunId`

- Table 二层抽屉：`src/TableDetailDrawer/TableDetailDrawer.tsx`
  - 二层 Drawer：第二个 `<Drawer />`（open 由 `selectedVersionId` 驱动）
  - 关闭只清空 `selectedVersionId`

二层抽屉的“透明遮罩 + 可点击返回”写法在这两处一致：开启 mask，但设置 mask 背景透明。

---

## 3. 组件契约（公司内部组件需要满足的能力）

你必须使用公司内部组件，但内部组件至少要具备以下能力（如不具备，需要用内部 Overlay 组件组合出来）：

### 3.1 Drawer 能力（CompanyDrawer）

需要支持（概念上的）props：

- `open: boolean`
- `placement: 'right'`（右侧）
- `width: number`（本仓库为 896，可按公司规范调整，但一二层需一致）
- `zIndex: number`（二层必须高于一层）
- `mask: boolean`
- `maskClosable: boolean`（点击遮罩关闭；如果公司组件没有该 prop，则由 overlay 捕获 click 实现）
- `onClose: () => void`（二层：只回到一级）
- `closable: boolean`（二层 false；不要内置 X）
- `header` 或 `title` 插槽（用于放标题栏组件）
- `body` 样式控制：支持 `padding: 0`、`height: 100%`、`overflow: hidden` 等

### 3.2 透明遮罩能力（CompanyOverlay / Drawer 的 mask 样式）

二层抽屉必须实现：

- **视觉透明**：遮罩背景 `transparent`
- **可点击**：点击遮罩触发二层 `onClose`
- **层级在一层之上**：zIndex 比一层高（遮罩 + panel 都高）

如果公司 Drawer 的 mask 无法单独设透明：

- 用公司 Overlay 组件在二层 Drawer 打开时渲染一个全屏透明层，`onClick` 调用二层 `onClose`，并将该 overlay 的层级置于一层之上、二层 panel 之下或同级（取决于公司组件体系）。

### 3.3 标题栏能力（CompanyHeaderBar）

二层标题栏必须支持：

- 左侧：返回按钮（onBack）
- 中间：标题文本（通常是选中条目的 id 或 name）
- 右侧：不显示更多操作、不显示关闭按钮（showMoreAction=false, showCloseAction=false）

---

## 4. 状态机（最重要，必须照此实现）

二层抽屉不要维护一个独立的 `open` 状态；它应由“是否选中了条目”推导出来。

### 4.1 Tool 场景状态（示例）

- `selectedRunId: string | null`
- `selectedRun: Run | null`（由 selectedRunId 从 viewModel 中查出来）
- `runDetailOpen = Boolean(selectedRunId && selectedRun && viewModel)`

状态转移：

- 点击列表行：`selectedRunId = runId` → `runDetailOpen = true` → 二层打开
- 点击遮罩 / 点击返回：`selectedRunId = null` → `runDetailOpen = false` → 二层关闭
- 切换一级 tabs / 一级 close：需要主动 `selectedRunId = null`（防止二层残留）

### 4.2 Table 场景状态（示例）

- `selectedVersionId: string | null`
- `selectedVersion: Version | null`
- `versionDetailOpen = Boolean(selectedVersionId && selectedVersion)`

转移同上。

---

## 5. 布局与层级（避免“位置不对”的关键点）

二层抽屉必须满足以下渲染结构（概念示意）：

```tsx
return (
  <>
    <CompanyDrawer open={primaryOpen} zIndex={1000} ...>
      {/* 一级内容：列表、tabs 等 */}
    </CompanyDrawer>

    <CompanyDrawer open={secondaryOpen} zIndex={1100} mask maskTransparent ...>
      {/* 二级内容：详情 */}
    </CompanyDrawer>
  </>
)
```

注意点：

- **不要把二层 Drawer 渲染在一级 Drawer 的 children 内**（嵌套会导致定位/遮罩/滚动/portal 不一致）。
- 二层 `zIndex` 必须高于一级（本仓库使用 1100 vs 默认层级）。
- 二层 body 一般用 `height: 100%`（一级用了 `100vh`，二级用 `100%` 更合理，避免重复撑高）。

---

## 6. 二层标题栏规范（必须一致）

二层标题栏建议参数：

- `title = selectedId`（例如 runId / versionId）
- `showMoreAction = false`
- `showCloseAction = false`
- `onBack = () => setSelectedId(null)`
- `onClose = () => setSelectedId(null)`（如公司抽屉仍会触发 onClose，务必同样只清空 selectedId）

二层“关闭按钮 X”必须不出现（公司组件默认提供的话需要关闭）。

---

## 7. 透明遮罩点击策略（必须一致）

二层抽屉的遮罩点击逻辑要做到：

- 视觉：遮罩透明（一级抽屉仍可见）
- 交互：点击遮罩关闭二层（回到一级）
- 防穿透：遮罩存在时，点击应由遮罩接管，避免直接点到一级内容触发其它交互

如果公司组件做不到“透明但拦截点击”，建议：

- overlay 必须有 `pointer-events: auto`，并覆盖全屏；
- overlay 的背景色为 `transparent`；
- overlay 的点击只执行 `closeSecondary()`；
- 二层 panel 区域需阻止冒泡（避免点击 panel 内部触发 overlay）。

---

## 8. 可访问性（建议但尽量做）

- 返回按钮 `aria-label="Back"`（或公司规范）
- 遮罩关闭支持 `Esc`（若公司抽屉支持）
- 焦点管理：二层打开后，焦点应进入二层；二层关闭后，焦点回到触发入口（若公司组件体系支持）

---

## 9. Claude 实现检查清单（逐条对照）

Claude 在公司项目落地时，提交前必须自检：

- [ ] 二层抽屉是 sibling 渲染，不嵌套在一级内部
- [ ] 二层 open 由 selectedId 推导，不是单独 boolean 状态
- [ ] 二层关闭只清空 selectedId，不会关闭一级
- [ ] 点击遮罩返回一级（关闭二层），且遮罩视觉透明
- [ ] 二层标题栏只显示返回按钮（无更多、无关闭 X）
- [ ] 二层 zIndex 高于一级
- [ ] 切换一级 tab / 关闭一级时会清空 selectedId，避免残留

