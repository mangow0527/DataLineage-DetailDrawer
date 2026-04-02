import JsonTree from '../../common/JsonTree'
import type { JobDetailViewModel, RunHistoryItemViewModel } from '../data/view-model'
import DetailToolbar from './DetailToolbar'
import SqlBlock from './SqlBlock'

type RunDetailPanelProps = {
  runId: string
  selectedRun: RunHistoryItemViewModel
  jobFacets: JobDetailViewModel['latestRun']['jobFacets']
  theme: 'lightday' | 'evening'
  onBack: () => void
}

export default function RunDetailPanel({ runId, selectedRun, jobFacets, theme, onBack }: RunDetailPanelProps) {
  return (
    <div>
      <DetailToolbar runId={runId} onBack={onBack} />
      {selectedRun.sqlText ? <SqlBlock content={selectedRun.sqlText} /> : null}
      <JsonTree title="JOB FACETS" data={jobFacets} theme={theme} />
      <JsonTree title="RUN FACETS" data={selectedRun.runFacets ?? {}} theme={theme} />
    </div>
  )
}
