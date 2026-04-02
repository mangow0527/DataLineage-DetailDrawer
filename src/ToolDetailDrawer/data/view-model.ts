import type { JobType, RunState } from './api-types'

export type HeaderViewModel = {
  title: string
  type: JobType | null
  createdAt: string | null
  updatedAt: string | null
}

export type SummaryViewModel = {
  createdAt: string | null
  updatedAt: string | null
  lastRuntimeMs: number | null
  type: JobType | null
  lastStartedAt: string | null
  lastFinishedAt: string | null
  runningStatus: RunState | null
  parentJobName: string | null
}

export type RunHistoryItemViewModel = {
  id: string
  state: RunState
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
    sqlText: string | null
    sourceCodeText: string | null
    sourceCodeLanguage: string | null
    jobFacets: Record<string, unknown>
    runFacets: Record<string, unknown>
  }
  runHistory: {
    items: RunHistoryItemViewModel[]
  }
}
