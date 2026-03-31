import JsonTree from '../../common/JsonTree'
import type { JobDetailViewModel } from '../data/view-model'
import SqlBlock from './SqlBlock'

type LatestRunPanelProps = {
  latestRun: JobDetailViewModel['latestRun']
}

export default function LatestRunPanel({ latestRun }: LatestRunPanelProps) {
  return (
    <div>
      {latestRun.showSqlBlock && latestRun.sqlText ? <SqlBlock content={latestRun.sqlText} /> : null}
      <JsonTree title="JOB FACETS" data={latestRun.jobFacets} />
      <JsonTree title="RUN FACETS" data={latestRun.runFacets} />
    </div>
  )
}
