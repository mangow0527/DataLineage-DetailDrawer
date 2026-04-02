import { useEffect, useMemo, useState } from 'react'
import { Collapse, Drawer } from 'antd'
import './style.less'
import DrawerTitleBar from '../common/DrawerTitleBar'
import HeaderCard from '../common/HeaderCard'
import DrawerTabs from '../common/DrawerTabs'
import LatestRunPanel from './components/LatestRunPanel'
import RunHistoryPanel from './components/RunHistoryPanel'
import ToolHeaderBar from './components/ToolHeaderBar'
import SqlBlock from './components/SqlBlock'
import SourceCodeBlock from './components/SourceCodeBlock'
import JsonTree from '../common/JsonTree'
import { loadToolDetail } from './data/data-extractor'
import type { JobDetailViewModel } from './data/view-model'

export type ToolDetailDrawerProps = {
  visible: boolean
  onClose: () => void
  nodeData: { namespace?: string; name?: string; jobName?: string } | null
  baseUrl?: string
  pageNo?: number
  pageSize?: number
  currentTheme?: 'lightday' | 'evening'
}

export default function ToolDetailDrawer({
  visible,
  onClose,
  nodeData,
  baseUrl,
  pageNo,
  pageSize,
  currentTheme = 'lightday'
}: ToolDetailDrawerProps) {
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

  const runDetailOpen = Boolean(selectedRunId && selectedRun && viewModel)

  const runSummary = (() => {
    if (!viewModel || !selectedRun) return null
    return {
      ...viewModel.summary,
      lastRuntimeMs: selectedRun.durationMs,
      lastStartedAt: selectedRun.startedAt,
      lastFinishedAt: selectedRun.endedAt,
      runningStatus: selectedRun.state
    }
  })()

  const jobFacetsForDisplay = (() => {
    const obj = viewModel?.latestRun.jobFacets ?? {}
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'sql') continue
      if (k === 'sourceCode') continue
      out[k] = v
    }
    return out
  })()

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
        <div className="drawer-shell" data-theme={currentTheme}>
          <div className="drawer-title-section">
            <DrawerTitleBar currentTheme={currentTheme} onClose={onClose} />
          </div>

          <div className="drawer-content">
            <HeaderCard
              variant="tool"
              theme={currentTheme}
              title={viewModel?.header.title ?? nodeJobName}
              createdAt={viewModel?.header.createdAt}
              updatedAt={viewModel?.header.updatedAt}
            />
            {loading ? (
              <div
                style={{
                  fontSize: 14,
                  lineHeight: '22px',
                  color:
                    currentTheme === 'evening' ? 'rgba(230, 230, 230, 0.85)' : 'rgba(0, 0, 0, 0.65)'
                }}
              >
                Loading...
              </div>
            ) : !viewModel ? (
              <div
                style={{
                  fontSize: 14,
                  lineHeight: '22px',
                  color: currentTheme === 'evening' ? '#ff7875' : '#ff4d4f'
                }}
              >
                加载失败：未获取到 Job 详情数据
              </div>
            ) : (
              <>
                <ToolHeaderBar summary={viewModel.summary} />

                <div className="drawer-body">
                  <DrawerTabs
                    activeKey={activeTab}
                    onChange={(k) => {
                      const next = k === 'runHistory' ? 'runHistory' : 'latestRun'
                      setActiveTab(next)
                      setSelectedRunId(null)
                    }}
                  >
                    <DrawerTabs.Item tabKey="latestRun" label="最新信息">
                      <LatestRunPanel latestRun={viewModel.latestRun} theme={currentTheme} />
                    </DrawerTabs.Item>
                    <DrawerTabs.Item tabKey="runHistory" label="运行历史">
                      <RunHistoryPanel
                        items={viewModel.runHistory.items}
                        theme={currentTheme}
                        onSelectRun={setSelectedRunId}
                      />
                    </DrawerTabs.Item>
                  </DrawerTabs>
                </div>
              </>
            )}
          </div>
        </div>
      </Drawer>

      <Drawer
        placement="right"
        width={896}
        open={runDetailOpen}
        closable={false}
        onClose={() => setSelectedRunId(null)}
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
        {runDetailOpen && selectedRunId && selectedRun && viewModel && runSummary ? (
          <div className="drawer-shell" data-theme={currentTheme}>
            <div className="drawer-title-section">
              <DrawerTitleBar
                currentTheme={currentTheme}
                title={selectedRunId}
                showMoreAction={false}
                showCloseAction={false}
                onBack={() => setSelectedRunId(null)}
                onClose={() => setSelectedRunId(null)}
              />
            </div>
            <div className="drawer-content">
              <ToolHeaderBar summary={runSummary} />
              <div className="drawer-body">
                <div className="latest-info-panels">
                  <Collapse ghost defaultActiveKey={['sql', 'sourceCode', 'jobFacets', 'runFacets']}>
                    {selectedRun.sqlText?.trim() ? (
                      <Collapse.Panel header="SQL" key="sql">
                        <div className="latest-info-panels__body">
                          <SqlBlock content={selectedRun.sqlText ?? ''} theme={currentTheme} />
                        </div>
                      </Collapse.Panel>
                    ) : null}

                    {viewModel.latestRun.sourceCodeText?.trim() ? (
                      <Collapse.Panel header="Source Code" key="sourceCode">
                        <div className="latest-info-panels__body">
                          <SourceCodeBlock
                            content={viewModel.latestRun.sourceCodeText ?? ''}
                            language={viewModel.latestRun.sourceCodeLanguage}
                            theme={currentTheme}
                          />
                        </div>
                      </Collapse.Panel>
                    ) : null}

                    {Object.keys(jobFacetsForDisplay).length > 0 ? (
                      <Collapse.Panel header="Job Facets" key="jobFacets">
                        <div className="latest-info-panels__body latest-info-panels__body--tree">
                          <JsonTree data={jobFacetsForDisplay} theme={currentTheme} />
                        </div>
                      </Collapse.Panel>
                    ) : null}

                    {Object.keys(selectedRun.runFacets ?? {}).length > 0 ? (
                      <Collapse.Panel header="Run Facets" key="runFacets">
                        <div className="latest-info-panels__body latest-info-panels__body--tree">
                          <JsonTree data={selectedRun.runFacets ?? {}} theme={currentTheme} />
                        </div>
                      </Collapse.Panel>
                    ) : null}
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}
