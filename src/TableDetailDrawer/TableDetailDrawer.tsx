import { useMemo, useState } from 'react'
import { Button, Drawer, Input, Table, Tabs, Tag, Tooltip, Typography } from 'antd'
import './style.css'
import JsonTree from '../common/JsonTree'
import { fmtDate } from '../common/format'
import { mockDatasetVersions, DatasetVersion } from './mock'

export default function App() {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'latestSchema' | 'versionHistory'>('latestSchema')
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<'lightday' | 'darknight'>('lightday')

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
          onClick={() => setCurrentTheme((t) => (t === 'lightday' ? 'darknight' : 'lightday'))}
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
        width={800}
        open={open}
        closable={false}
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        <div className="drawer-shell" data-theme={currentTheme}>
          <div style={{ borderBottom: '1px solid #f0f0f0', padding: 16, flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: '#1677ff',
                    flex: '0 0 auto'
                  }}
                />
                <Typography.Title level={4} style={{ margin: 0, minWidth: 0 }}>
                  {head.physicalName ?? `${head.namespace}.${head.name}`}
                </Typography.Title>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button danger onClick={() => {}}>
                  DELETE
                </Button>
                <Button type="text" onClick={() => setOpen(false)} aria-label="Close">
                  ×
                </Button>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <div>UPDATED AT</div>
                <div>{fmtDate(head.createdAt)}</div>
              </div>
              <div>
                <div>DATASET TYPE</div>
                <div>{head.type}</div>
              </div>
              <div>
                <div>FIELDS</div>
                <div>{`${head.fields.length} columns`}</div>
              </div>
              <div>
                <div>QUALITY</div>
                <div>N/A</div>
              </div>
            </div>

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
