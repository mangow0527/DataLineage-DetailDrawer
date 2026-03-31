import type { JobDetailViewModel, RunHistoryItemViewModel } from '../data/view-model'
import RunDetailPanel from './RunDetailPanel'
import RunHistoryTable from './RunHistoryTable'

type RunHistoryPanelProps = {
  selectedRunId: string | null
  selectedRun: RunHistoryItemViewModel | null
  items: JobDetailViewModel['runHistory']['items']
  jobFacets: JobDetailViewModel['latestRun']['jobFacets']
  onSelectRun: (runId: string) => void
  onBack: () => void
}

export default function RunHistoryPanel({
  selectedRunId,
  selectedRun,
  items,
  jobFacets,
  onSelectRun,
  onBack
}: RunHistoryPanelProps) {
  if (selectedRunId && selectedRun) {
    return <RunDetailPanel runId={selectedRunId} selectedRun={selectedRun} jobFacets={jobFacets} onBack={onBack} />
  }

  return <RunHistoryTable items={items} onSelect={onSelectRun} />
}
