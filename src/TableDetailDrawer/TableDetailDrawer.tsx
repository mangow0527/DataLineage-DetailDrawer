import { useEffect, useMemo, useState } from 'react'
import { Button, Collapse, Drawer, Input, Table, Tag, Tooltip } from 'antd'
import '../ToolDetailDrawer/style.less'
import JsonTree from '../common/JsonTree'
import { fmtDate } from '../common/format'
import drawerImgs from '../common/DrawerImgs'
import TablePager from '../common/TablePager'
import DrawerTitle from '../common/DrawerTitle'
import HeaderCard from '../common/HeaderCard'
import DrawerTabs from '../common/DrawerTabs'
import { loadDatasetDetail } from './data/data-extractor'
import type { DatasetDetailViewModel, DatasetVersionViewModel } from './data/view-model'
import { useTablePagination } from '../common/useTablePagination'

function Th({
  icon,
  label
}: {
  icon?: React.ReactNode
  label: string
}) {
  return (
    <span className="dl-table__th">
      <span>{label}</span>
      {icon ? <span className="dl-table__th-icon">{icon}</span> : null}
    </span>
  )
}

export default function App() {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'latestSchema' | 'versionHistory'>('latestSchema')
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
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

  const ver = useMemo(() => {
    if (!selectedVersion) return null
    return viewModel?.versions.find((v) => v.version === selectedVersion) ?? null
  }, [selectedVersion, viewModel])

  const facetsData = (selectedVersion ? ver : head)?.facets ?? viewModel?.facets ?? {}
  const hasFacets = (() => {
    if (Array.isArray(facetsData)) return facetsData.length > 0
    if (facetsData && typeof facetsData === 'object') return Object.keys(facetsData as object).length > 0
    return Boolean(facetsData)
  })()

  const fieldsData = (selectedVersion ? ver : head)?.fields ?? []
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
            <DrawerTitle currentTheme={currentTheme} onClose={() => setOpen(false)} />
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
                  if (next === 'versionHistory') {
                    setSelectedVersion(null)
                  }
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
                    {selectedVersion ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <Button type="text" size="small" onClick={() => setSelectedVersion(null)}>
                          ‹
                        </Button>
                        <Input
                          size="small"
                          value={selectedVersion}
                          readOnly
                          style={{ maxWidth: 520 }}
                          addonAfter={
                            <Tooltip title="Copy Version ID">
                              <Button
                                type="text"
                                size="small"
                                onClick={() => selectedVersion && navigator.clipboard?.writeText(selectedVersion)}
                              >
                                Copy
                              </Button>
                            </Tooltip>
                          }
                        />
                      </div>
                    ) : null}

                    <Table
                      className="dl-themed-table"
                      size="small"
                      rowKey="name"
                      dataSource={pagedFields}
                      pagination={false}
                      columns={[
                        {
                          title: (
                            <Th
                              icon={
                                currentTheme === 'evening' ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
                              }
                              label="名称"
                            />
                          ),
                          dataIndex: 'name',
                          render: (v: string) => (
                            <span
                              style={{
                                fontFamily:
                                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                              }}
                            >
                              {v}
                            </span>
                          )
                        },
                        {
                          title: (
                            <Th
                              icon={
                                currentTheme === 'evening' ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT
                              }
                              label="数据类型"
                            />
                          ),
                          dataIndex: 'type',
                          render: (v: string) => <Tag>{v}</Tag>
                        },
                        { title: <Th label="描述" />, dataIndex: 'description', ellipsis: true }
                      ]}
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
                        setSelectedVersion(record.version)
                        setActiveTab('latestSchema')
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
    </>
  )
}
