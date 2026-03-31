import { useEffect, useMemo, useState } from 'react'
import { Drawer, Typography } from 'antd'
import DrawerTitle from '../common/DrawerTitle'
import HeaderBar from './components/HeaderBar'
import JobTabs from './components/JobTabs'
import LatestRunPanel from './components/LatestRunPanel'
import RunHistoryPanel from './components/RunHistoryPanel'
import SummaryGrid from './components/SummaryGrid'
import { loadToolDetail } from './data/data-extractor'
import type { JobDetailViewModel } from './data/view-model'

export type ToolNodeDrawerProps = {
  visible: boolean
  onClose: () => void
  nodeData: { namespace?: string; name?: string; jobName?: string } | null
  baseUrl?: string
  pageNo?: number
  pageSize?: number
  currentTheme?: 'lightday' | 'darknight'
}

export default function ToolNodeDrawer({
  visible,
  onClose,
  nodeData,
  baseUrl,
  pageNo,
  pageSize,
  currentTheme = 'lightday'
}: ToolNodeDrawerProps) {
  const [activeTab, setActiveTab] = useState<'latestRun' | 'runHistory'>('latestRun')
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [viewModel, setViewModel] = useState<JobDetailViewModel | null>(null)
  const [loading, setLoading] = useState(false)

  const nodeNamespace = nodeData?.namespace ?? 'my-namespace'
  const nodeJobName = nodeData?.jobName ?? nodeData?.name ?? 'test-job-01'

  useEffect(() => {
    if (!visible) return
    if (!nodeJobName) return
    let alive = true
    setLoading(true)
    loadToolDetail(
      { namespace: nodeNamespace, jobName: nodeJobName },
      baseUrl ? { baseUrl, pageNo, pageSize } : undefined
    )
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
  }, [baseUrl, nodeJobName, nodeNamespace, pageNo, pageSize, visible])

  useEffect(() => {
    if (!visible) return
    setActiveTab('latestRun')
    setSelectedRunId(null)
  }, [nodeJobName, visible])

  const selectedRun = useMemo(() => {
    if (!selectedRunId) return null
    return viewModel?.runHistory.items.find((item) => item.id === selectedRunId) ?? null
  }, [selectedRunId, viewModel])

  if (!visible) return null

  return (
    <Drawer
      placement="right"
      width={896}
      open={visible}
      closable={false}
      onClose={onClose}
      styles={{ body: { padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' } }}
    >
      <div className="drawer-shell" data-theme={currentTheme}>
        <div className="job-header-section">
          <DrawerTitle currentTheme={currentTheme} onClose={onClose} />
          <HeaderBar
            title={viewModel?.header.title ?? nodeJobName}
            type={viewModel?.header.type}
            createdAt={viewModel?.header.createdAt}
            updatedAt={viewModel?.header.updatedAt}
          />
        </div>

        <div style={{ padding: 16 }}>
          {loading ? (
            <Typography.Text>Loading...</Typography.Text>
          ) : !viewModel ? (
            <Typography.Text type="danger">加载失败：未获取到 Job 详情数据</Typography.Text>
          ) : (
            <>
              <SummaryGrid summary={viewModel.summary} />

              <div style={{ marginTop: 16 }}>
                <JobTabs
                  activeTab={activeTab}
                  onChange={(tab) => {
                    setActiveTab(tab)
                    setSelectedRunId(null)
                  }}
                />

                {activeTab === 'latestRun' ? (
                  <LatestRunPanel latestRun={viewModel.latestRun} />
                ) : (
                  <RunHistoryPanel
                    selectedRunId={selectedRunId}
                    selectedRun={selectedRun}
                    items={viewModel.runHistory.items}
                    jobFacets={viewModel.latestRun.jobFacets}
                    onSelectRun={setSelectedRunId}
                    onBack={() => setSelectedRunId(null)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Drawer>
  )
}
