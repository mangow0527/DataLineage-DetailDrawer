import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Button, Collapse, Drawer, Table } from 'antd'
import '../ToolDetailDrawer/style.less'
import JsonTree from '../common/JsonTree'
import { fmtDate } from '../common/format'
import drawerImgs from '../common/DrawerImgs'
import TablePager from '../common/TablePager'
import DrawerTitleBar from '../common/DrawerTitleBar'
import HeaderCard from '../common/HeaderCard'
import DrawerTabs from '../common/DrawerTabs'
import { loadDatasetDetail } from './data/data-extractor'
import type { DatasetDetailViewModel, DatasetVersionViewModel } from './data/view-model'
import { useTablePagination } from '../common/useTablePagination'

function Th({
  icon,
  label
}: {
  icon?: ReactNode
  label: string
}) {
  return (
    <span className="dl-table__th">
      <span>{label}</span>
      {icon ? <span className="dl-table__th-icon">{icon}</span> : null}
    </span>
  )
}

const MONO_STYLE = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
} as const

const renderMonoText = (v: string) => <span style={MONO_STYLE}>{v}</span>

export default function App() {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'latestSchema' | 'versionHistory'>('latestSchema')
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<'lightday' | 'evening'>('lightday')
  const [viewModel, setViewModel] = useState<DatasetDetailViewModel | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    let alive = true
    setLoading(true)
    loadDatasetDetail({ namespace: 'public', name: 'restaurants' })
      .then((vm) => {
        if (!alive) return
        setViewModel(vm)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [open])

  const head = viewModel?.versions[0] ?? null

  const isEvening = currentTheme === 'evening'

  const selectedVersion = useMemo(() => {
    if (!selectedVersionId) return null
    return viewModel?.versions.find((v) => v.version === selectedVersionId) ?? null
  }, [selectedVersionId, viewModel])

  const facetsData = head?.facets ?? viewModel?.facets ?? {}
  const hasFacets = (() => {
    if (Array.isArray(facetsData)) return facetsData.length > 0
    if (facetsData && typeof facetsData === 'object') return Object.keys(facetsData as object).length > 0
    return Boolean(facetsData)
  })()

  const fieldsData = head?.fields ?? []
  const {
    pageSize: pageSizeFields,
    current: currentFields,
    setCurrent: setCurrentFields,
    onPageSizeChange: onFieldsPageSizeChange
  } = useTablePagination(fieldsData.length, 10)
  const pagedFields = useMemo(() => {
    const start = (currentFields - 1) * pageSizeFields
    return fieldsData.slice(start, start + pageSizeFields)
  }, [fieldsData, currentFields, pageSizeFields])

  const versions = viewModel?.versions ?? []
  const {
    pageSize: pageSizeVersions,
    current: currentVersions,
    setCurrent: setCurrentVersions,
    onPageSizeChange: onVersionsPageSizeChange
  } = useTablePagination(versions.length, 10)
  const pagedVersions = useMemo(() => {
    const start = (currentVersions - 1) * pageSizeVersions
    return versions.slice(start, start + pageSizeVersions)
  }, [versions, currentVersions, pageSizeVersions])

  const copyIcon = currentTheme === 'evening' ? drawerImgs.COPY_DARK : drawerImgs.COPY_LIGHT

  const selectedVersionFields = selectedVersion?.fields ?? []
  const {
    pageSize: pageSizeSelectedFields,
    current: currentSelectedFields,
    setCurrent: setCurrentSelectedFields,
    onPageSizeChange: onSelectedFieldsPageSizeChange
  } = useTablePagination(selectedVersionFields.length, 10)
  const pagedSelectedFields = useMemo(() => {
    const start = (currentSelectedFields - 1) * pageSizeSelectedFields
    return selectedVersionFields.slice(start, start + pageSizeSelectedFields)
  }, [selectedVersionFields, currentSelectedFields, pageSizeSelectedFields])

  const fieldColumns = useMemo(() => {
    const timeIcon = isEvening ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
    return [
      {
        title: <Th icon={timeIcon} label="名称" />,
        dataIndex: 'name',
        render: renderMonoText
      },
      {
        title: <Th icon={timeIcon} label="数据类型" />,
        dataIndex: 'type',
        render: renderMonoText
      },
      { title: <Th label="描述" />, dataIndex: 'description', ellipsis: true }
    ]
  }, [isEvening])

  if (!open) {
    return (
      <div style={{ padding: 16 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Table Detail
        </Button>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentTheme((t) => (t === 'lightday' ? 'evening' : 'lightday'))}
          style={{
            appearance: 'none',
            border: '1px solid #d9d9d9',
            background: '#fff',
            color: '#000',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 12,
            lineHeight: '20px',
            cursor: 'pointer'
          }}
          aria-label="toggle theme"
          title="切换主题"
        >
          {currentTheme === 'lightday' ? '切换深色' : '切换浅色'}
        </button>
      </div>
      <Drawer
        placement="right"
        width={896}
        open={open}
        closable={false}
        onClose={() => setOpen(false)}
        styles={{
          body: {
            padding: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        <div className="drawer-shell" data-theme={currentTheme}>
          <div className="drawer-title-section">
            <DrawerTitleBar currentTheme={currentTheme} onClose={() => setOpen(false)} />
          </div>

          <div className="drawer-content">
            {viewModel ? (
              <HeaderCard
                variant="table"
                theme={currentTheme}
                title={viewModel.header.title}
                updatedAt={viewModel.header.updatedAt}
                columnCount={viewModel.header.columnCount}
              />
            ) : null}
            <div style={{ marginTop: 16 }}>
              <DrawerTabs
                activeKey={activeTab}
                onChange={(k) => {
                  const next = k === 'versionHistory' ? 'versionHistory' : 'latestSchema'
                  setActiveTab(next)
                }}
              >
                <DrawerTabs.Item tabKey="latestSchema" label="最新信息">
                  <div>
                    {loading ? (
                      <div
                        style={{
                          fontSize: 14,
                          lineHeight: '22px',
                          color: currentTheme === 'evening' ? 'rgba(230, 230, 230, 0.85)' : 'rgba(0, 0, 0, 0.65)'
                        }}
                      >
                        Loading...
                      </div>
                    ) : null}
                    <Table
                      className="dl-themed-table"
                      size="small"
                      rowKey="name"
                      dataSource={pagedFields}
                      pagination={false}
                      columns={fieldColumns}
                    />
                    <div style={{ marginTop: 8 }}>
                      <TablePager
                        total={fieldsData.length}
                        pageSize={pageSizeFields}
                        current={currentFields}
                        onChange={setCurrentFields}
                        onPageSizeChange={onFieldsPageSizeChange}
                      />
                    </div>

                    {hasFacets ? (
                      <div style={{ marginTop: 16 }}>
                        <div className="latest-info-panels">
                          <Collapse ghost defaultActiveKey={['facets']}>
                            <Collapse.Panel header="Facets" key="facets">
                              <div className="latest-info-panels__body latest-info-panels__body--tree">
                                <JsonTree data={facetsData} theme={currentTheme} />
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </DrawerTabs.Item>

                <DrawerTabs.Item tabKey="versionHistory" label="历史版本">
                  <Table
                    className="dl-themed-table"
                    size="small"
                    rowKey="version"
                    dataSource={pagedVersions}
                    pagination={false}
                    tableLayout="fixed"
                    onRow={(record: DatasetVersionViewModel) => ({
                      onClick: () => {
                        setSelectedVersionId(record.version)
                      }
                    })}
                    columns={[
                      {
                        title: (
                          <Th
                            icon={currentTheme === 'evening' ? drawerImgs.RUN_HISTORY_ID_DARK : drawerImgs.RUN_HISTORY_ID_LIGHT}
                            label="版本"
                          />
                        ),
                        dataIndex: 'version',
                        width: 260,
                        render: (v: string) => (
                          <span className="dl-table__id-cell">
                            <span
                              className="dl-table__id"
                              style={{
                                fontFamily:
                                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                              }}
                            >
                              {v}
                            </span>
                            <button
                              type="button"
                              aria-label="copy"
                              className="dl-table__copy"
                              onClick={(e) => {
                                e.stopPropagation()
                                v && navigator.clipboard?.writeText(v)
                              }}
                            >
                              {copyIcon}
                            </button>
                          </span>
                        )
                      },
                      {
                        title: (
                          <Th
                            icon={
                              currentTheme === 'evening' ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
                            }
                            label="创建时间"
                          />
                        ),
                        dataIndex: 'createdAt',
                        width: 220,
                        render: fmtDate
                      },
                      { title: <Th label="字段" />, dataIndex: 'fields', width: 90, render: (f: any[]) => f?.length ?? 0 },
                      {
                        title: (
                          <Th
                            icon={currentTheme === 'evening' ? drawerImgs.RUN_HISTORY_ID_DARK : drawerImgs.RUN_HISTORY_ID_LIGHT}
                            label="创建来源"
                          />
                        ),
                        dataIndex: 'createdByRun',
                        width: 260,
                        render: (v: { id: string } | null) =>
                          v?.id ? (
                            <span className="dl-table__id-cell">
                              <span
                                className="dl-table__id"
                                style={{
                                  fontFamily:
                                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                                }}
                              >
                                {v.id}
                              </span>
                              <button
                                type="button"
                                aria-label="copy"
                                className="dl-table__copy"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard?.writeText(v.id)
                                }}
                              >
                                {copyIcon}
                              </button>
                            </span>
                          ) : (
                            'N/A'
                          )
                      }
                    ]}
                  />
                  <div style={{ marginTop: 8 }}>
                    <TablePager
                      total={versions.length}
                      pageSize={pageSizeVersions}
                      current={currentVersions}
                      onChange={setCurrentVersions}
                      onPageSizeChange={onVersionsPageSizeChange}
                    />
                  </div>
                </DrawerTabs.Item>
              </DrawerTabs>
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        placement="right"
        width={896}
        open={Boolean(selectedVersionId && selectedVersion)}
        closable={false}
        onClose={() => setSelectedVersionId(null)}
        mask
        zIndex={1100}
        styles={{
          mask: { backgroundColor: 'transparent' },
          body: {
            padding: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        {selectedVersionId && selectedVersion ? (
          <div className="drawer-shell" data-theme={currentTheme}>
            <div className="drawer-title-section">
              <DrawerTitleBar
                currentTheme={currentTheme}
                title={selectedVersionId}
                showMoreAction={false}
                showCloseAction={false}
                onBack={() => setSelectedVersionId(null)}
                onClose={() => setSelectedVersionId(null)}
              />
            </div>

            <div className="drawer-content">
              <div className="drawer-body">
                <Table
                  className="dl-themed-table"
                  size="small"
                  rowKey="name"
                  dataSource={pagedSelectedFields}
                  pagination={false}
                  columns={fieldColumns}
                />
                <div style={{ marginTop: 8 }}>
                  <TablePager
                    total={selectedVersionFields.length}
                    pageSize={pageSizeSelectedFields}
                    current={currentSelectedFields}
                    onChange={setCurrentSelectedFields}
                    onPageSizeChange={onSelectedFieldsPageSizeChange}
                  />
                </div>

                {Object.keys(selectedVersion.facets ?? {}).length > 0 ? (
                  <div style={{ marginTop: 16 }}>
                    <div className="latest-info-panels">
                      <Collapse ghost defaultActiveKey={['facets']}>
                        <Collapse.Panel header="Facets" key="facets">
                          <div className="latest-info-panels__body latest-info-panels__body--tree">
                            <JsonTree data={selectedVersion.facets ?? {}} theme={currentTheme} />
                          </div>
                        </Collapse.Panel>
                      </Collapse>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}
