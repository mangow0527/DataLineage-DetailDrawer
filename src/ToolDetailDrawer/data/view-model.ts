export type HeaderViewModel = {
  title: string
  type: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type SummaryViewModel = {
  createdAt: string | null
  updatedAt: string | null
  lastRuntimeMs: number | null
  type: string | null
  lastStartedAt: string | null
  lastFinishedAt: string | null
  runningStatus: string | null
  parentJobName: string | null
}

export type RunHistoryItemViewModel = {
  id: string
  state: string
  createdAt: string | null
  startedAt: string | null
  endedAt: string | null
  durationMs: number | null
  runFacets: Record<string, unknown>
  sqlText: string | null
}

export type JobDetailViewModel = {
  header: HeaderViewModel
  summary: SummaryViewModel
  latestRun: {
    showSqlBlock: boolean
    sqlText: string | null
    jobFacets: Record<string, unknown>
    runFacets: Record<string, unknown>
  }
  runHistory: {
    items: RunHistoryItemViewModel[]
  }
}
