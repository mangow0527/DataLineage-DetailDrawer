# Data Lineage Detail (PIU)

一个以 PIU 模式运行的 Job/Dataset 详情界面，支持宿主驱动加载与主题联动。代码遵循 SOLID 与 Clean Code 原则，界面库通过适配层统一管理，便于切换至公司内部组件库。

## 功能
- Job 详情：LATEST RUN（SQL + JOB/RUN FACETS）、RUN HISTORY（列表/详情）
- Dataset 详情：LATEST SCHEMA（字段表 + FACETS）、VERSION HISTORY（列表/详情）
- JsonTree：树形 JSON，默认全展开，逐层复制
- 主题联动：宿主 `$stateChange.theme` → `data-theme`
- 无图标：统一使用文本按钮（Back / Copy / Close）

## 运行
- 安装依赖：`npm install`
- 开发：`npm run dev -- --port=5174 --strictPort`
- 宿主演示：打开 `http://localhost:5174/host-demo.html`
- 构建：`npm run build` → 预览 `npm run preview -- --port=5174`

## 目录结构
- `pius/data_lineage_detail/index.ts`（聚合）
- `pius/data_lineage_detail/src/`
  - `adapter.tsx`（适配层：`initGraphic`/`attachPiu`/`getAppId`/`updateColorTheme`）
  - `pages/`（Job/Dataset）
  - `components/`（JsonTree/InfoGrid）
  - `ui/`（适配层：Drawer/Tabs/Table + antd re-export）
  - `models/`（mock 数据与格式化）
  - `styles.css`
- `pius/data_lineage_detail_logic_view/index.js`（宿主入口）
- `host-demo.html`（最小宿主）
- `docs/`
  - `DeveloperGuide.md`（开发者指南）
  - `ComponentsInventory.md`（组件清单）
  - `MigrationPlaybook.md`（迁移手册）
  - `ComponentMapping.json`（组件映射）

## 设计原则
- SRP/OCP/DIP：页面依赖 `./ui` 抽象，适配层可自由替换具体组件库
- 类型明确：避免隐式 any；统一回调签名
- 一致交互：Drawer 受控关闭；Tabs/Table/Tooltip 行为与设计一致
- 文档名副其实：指南/清单/手册/映射按职责分类至 `docs/`

## 迁移到公司内部组件库
- 仅改动：`pius/data_lineage_detail/src/ui/*`
- 参照：`docs/ComponentMapping.json` 与 `docs/MigrationPlaybook.md`
- 验证：`host-demo.html` 可 Render Dataset/Job；Close 卸载视图；JsonTree 复制不触发展开

## 参考
- Job 页面：[JobDetailDrawer.tsx](file:///d:/code/marquez/job-detail-ui/pius/data_lineage_detail/src/pages/job/JobDetailDrawer.tsx)
- Dataset 页面：[DatasetApp.tsx](file:///d:/code/marquez/job-detail-ui/pius/data_lineage_detail/src/DatasetApp.tsx)
- 适配层：[adapter.tsx](file:///d:/code/marquez/job-detail-ui/pius/data_lineage_detail/src/adapter.tsx)
- 宿主入口：[index.js](file:///d:/code/marquez/job-detail-ui/pius/data_lineage_detail_logic_view/index.js)

