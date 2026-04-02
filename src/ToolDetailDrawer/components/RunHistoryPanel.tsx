import type { JobDetailViewModel, RunHistoryItemViewModel } from '../data/view-model'
import RunDetailPanel from './RunDetailPanel'
import RunHistoryTable from './RunHistoryTable'

type RunHistoryPanelProps = {
  selectedRunId: string | null
  selectedRun: RunHistoryItemViewModel | null
  items: JobDetailViewModel['runHistory']['items']
  jobFacets: JobDetailViewModel['latestRun']['jobFacets']
  theme: 'lightday' | 'evening'
  onSelectRun: (runId: string) => void
  onBack: () => void
}

export default function RunHistoryPanel({
  selectedRunId,
  selectedRun,
  items,
  jobFacets,
  theme,
  onSelectRun,
  onBack
}: RunHistoryPanelProps) {
  if (selectedRunId && selectedRun) {
    return (
      <RunDetailPanel
        runId={selectedRunId}
        selectedRun={selectedRun}
        jobFacets={jobFacets}
        theme={theme}
        onBack={onBack}
      />
    )
  }

  return <RunHistoryTable items={items} onSelect={onSelectRun} />
}
