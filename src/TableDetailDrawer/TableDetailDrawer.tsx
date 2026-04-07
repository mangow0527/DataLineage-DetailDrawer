import { useEffect, useMemo, useState } from 'react'
import { Drawer } from 'antd'
import '../common/DrawerShell.less'
import '../common/LatestInfoPanels.less'
import DrawerTitleBar from '../common/DrawerTitleBar'
import HeaderCard from '../common/HeaderCard'
import DrawerTabs from '../common/DrawerTabs'
import { loadDatasetDetail } from './data/data-extractor'
import type { DatasetDetailViewModel } from './data/view-model'
import LatestSchemaPanel from './components/LatestSchemaPanel'
import VersionDetailPanel from './components/VersionDetailPanel'
import VersionHistoryPanel from './components/VersionHistoryPanel'

export type TableDetailDrawerProps = {
  visible: boolean
  onClose: () => void
  currentTheme?: 'lightday' | 'dark'
  nodeData: { namespace?: string; name?: string; datasetName?: string } | null
  baseUrl?: string
}

export default function TableDetailDrawer({
  visible,
  onClose,
  currentTheme = 'lightday',
  nodeData,
  baseUrl
}: TableDetailDrawerProps) {
  const resolvedTheme: 'lightday' | 'dark' = currentTheme === 'dark' ? 'dark' : 'lightday'
  const [activeTab, setActiveTab] = useState<'latestSchema' | 'versionHistory'>('latestSchema')
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  const [viewModel, setViewModel] = useState<DatasetDetailViewModel | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    let alive = true
    setLoading(true)
    const nodeNamespace = nodeData?.namespace ?? 'my-namespace'
    const nodeName = nodeData?.datasetName ?? nodeData?.name ?? 'restaurants'
    loadDatasetDetail({ namespace: nodeNamespace, name: nodeName }, baseUrl ? { baseUrl } : undefined)
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
  }, [baseUrl, nodeData, visible])

  const head = viewModel?.versions[0] ?? null

  useEffect(() => {
    if (!visible) return
    setActiveTab('latestSchema')
    setSelectedVersionId(null)
  }, [visible])

  const selectedVersion = useMemo(() => {
    if (!selectedVersionId) return null
    return viewModel?.versions.find((v) => v.version === selectedVersionId) ?? null
  }, [selectedVersionId, viewModel])

  const facetsData = head?.facets ?? viewModel?.facets ?? {}

  if (!visible) return null

  return (
    <>
      <Drawer
        placement="right"
        width={896}
        open={visible}
        closable={false}
        onClose={onClose}
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
        <div className="drawer-shell" data-theme={resolvedTheme}>
          <div className="drawer-title-section">
            <DrawerTitleBar currentTheme={resolvedTheme} onClose={onClose} />
          </div>

          <div className="drawer-content">
            {viewModel ? (
              <HeaderCard
                variant="table"
                theme={resolvedTheme}
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
                  <LatestSchemaPanel
                    theme={resolvedTheme}
                    loading={loading}
                    fields={head?.fields ?? []}
                    facetsData={facetsData}
                  />
                </DrawerTabs.Item>

                <DrawerTabs.Item tabKey="versionHistory" label="历史版本">
                  <VersionHistoryPanel
                    theme={resolvedTheme}
                    versions={viewModel?.versions ?? []}
                    onSelectVersion={(versionId) => setSelectedVersionId(versionId)}
                  />
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
          <div className="drawer-shell" data-theme={resolvedTheme}>
            <div className="drawer-title-section">
              <DrawerTitleBar
                currentTheme={resolvedTheme}
                title={selectedVersionId}
                showMoreAction={false}
                showCloseAction={false}
                onBack={() => setSelectedVersionId(null)}
                onClose={() => setSelectedVersionId(null)}
              />
            </div>

            <div className="drawer-content">
              <VersionDetailPanel theme={resolvedTheme} version={selectedVersion} />
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}
