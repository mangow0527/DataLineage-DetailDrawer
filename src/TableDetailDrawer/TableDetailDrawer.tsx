import { useMemo, useState } from 'react'
import { Button, Drawer, Input, Table, Tabs, Tag, Tooltip, Typography } from 'antd'
import '../ToolDetailDrawer/style.less'
import JsonTree from '../common/JsonTree'
import { fmtDate } from '../common/format'
import DrawerTitle from '../common/DrawerTitle'
import HeaderCard from '../common/HeaderCard'
import { mockDatasetVersions, DatasetVersion } from './mock'

export default function App() {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'latestSchema' | 'versionHistory'>('latestSchema')
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<'lightday' | 'evening'>('lightday')

  const list = useMemo(() => mockDatasetVersions, [])
  const head = list.versions[0]

  const ver = useMemo(() => {
    if (!selectedVersion) return null
    return list.versions.find((v) => v.version === selectedVersion) ?? null
  }, [list, selectedVersion])

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
            <HeaderCard
              variant="table"
              theme={currentTheme}
              title={`${head.physicalName ?? `${head.namespace}.${head.name}`} - extremely-long-dataset-title-for-overflow-preview-abcdefghijklmnopqrstuvwxyz-0123456789-abcdefghijklmnopqrstuvwxyz-0123456789-abcdefghijklmnopqrstuvwxyz`}
              updatedAt={head.createdAt}
              columnCount={head.fields.length}
            />
            <div style={{ marginTop: 16 }}>
              <Tabs
                activeKey={activeTab}
                onChange={(k) => {
                  const next = k === 'versionHistory' ? 'versionHistory' : 'latestSchema'
                  setActiveTab(next)
                  if (next === 'versionHistory') {
                    setSelectedVersion(null)
                  }
                }}
                items={[
                  {
                    key: 'latestSchema',
                    label: 'LATEST SCHEMA',
                    children: (
                      <div>
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
                          size="small"
                          rowKey="name"
                          dataSource={(selectedVersion ? ver : head)?.fields ?? []}
                          pagination={false}
                          columns={[
                            {
                              title: 'NAME',
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
                            { title: 'TYPE', dataIndex: 'type', render: (v: string) => <Tag>{v}</Tag> },
                            { title: 'DESCRIPTION', dataIndex: 'description', ellipsis: true }
                          ]}
                        />

                        <div style={{ marginTop: 16 }}>
                          <Typography.Text strong>FACETS</Typography.Text>
                          <JsonTree data={(selectedVersion ? ver : head)?.facets ?? {}} />
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'versionHistory',
                    label: 'VERSION HISTORY',
                    children: (
                      <Table
                        size="small"
                        rowKey="version"
                        dataSource={list.versions}
                        pagination={false}
                        onRow={(record: DatasetVersion) => ({
                          onClick: () => {
                            setSelectedVersion(record.version)
                            setActiveTab('latestSchema')
                          }
                        })}
                        columns={[
                          {
                            title: 'VERSION',
                            dataIndex: 'version',
                            render: (v: string) => (
                              <span
                                style={{
                                  fontFamily:
                                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                                }}
                              >
                                {v.slice(0, 8)}...
                              </span>
                            )
                          },
                          { title: 'CREATED AT', dataIndex: 'createdAt', render: fmtDate },
                          { title: 'FIELDS', dataIndex: 'fields', render: (f: any[]) => f?.length ?? 0 },
                          {
                            title: 'CREATED BY RUN',
                            dataIndex: 'createdByRun',
                            render: (v: { id: string } | null) => (v?.id ? `${v.id.slice(0, 8)}...` : 'N/A')
                          },
                          { title: 'LIFECYCLE STATE', dataIndex: 'lifecycleState', render: (v: string) => v || 'N/A' }
                        ]}
                      />
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
