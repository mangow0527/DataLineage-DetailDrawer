import type { JobDetailApiResponse, JobRunsApiResponse } from './api-types'
import type { JobDetailViewModel, RunHistoryItemViewModel } from './view-model'

function getSqlText(response: JobDetailApiResponse): string | null {
  const sql = response.data.facets.sql?.query?.trim()
  return sql ? sql : null
}

function getSourceCode(response: JobDetailApiResponse) {
  const raw = response.data.facets.sourceCode?.sourceCode?.trim()
  const langRaw = response.data.facets.sourceCode?.language?.trim()
  return {
    sourceCodeText: raw ? raw : null,
    sourceCodeLanguage: langRaw ? langRaw : null
  }
}

function mapRunItem(run: JobRunsApiResponse['data']['runs'][number], sqlText: string | null): RunHistoryItemViewModel {
  return {
    id: run.id,
    state: run.state,
    createdAt: run.createdAt ?? null,
    startedAt: run.startedAt ?? null,
    endedAt: run.endedAt ?? null,
    durationMs: run.durationMs ?? null,
    runFacets: run.facets ?? {},
    sqlText
  }
}

export function mapJobDetailToViewModel(jobResponse: JobDetailApiResponse, runsResponse: JobRunsApiResponse): JobDetailViewModel {
  const sqlText = getSqlText(jobResponse)
  const sourceCode = getSourceCode(jobResponse)
  const latestRun = jobResponse.data.latestRun

  return {
    header: {
      title: jobResponse.data.name,
      type: jobResponse.data.type ?? null,
      createdAt: jobResponse.data.createdAt ?? null,
      updatedAt: jobResponse.data.updatedAt ?? null
    },
    summary: {
      createdAt: jobResponse.data.createdAt ?? null,
      updatedAt: jobResponse.data.updatedAt ?? null,
      lastRuntimeMs: latestRun?.durationMs ?? null,
      type: jobResponse.data.type ?? null,
      lastStartedAt: latestRun?.startedAt ?? null,
      lastFinishedAt: latestRun?.endedAt ?? null,
      runningStatus: latestRun?.state ?? null,
      parentJobName: jobResponse.data.parentJobName ?? null
    },
    latestRun: {
      sqlText,
      sourceCodeText: sourceCode.sourceCodeText,
      sourceCodeLanguage: sourceCode.sourceCodeLanguage,
      jobFacets: jobResponse.data.facets ?? {},
      runFacets: latestRun?.facets ?? {}
    },
    runHistory: {
      items: runsResponse.data.runs.map((run) => mapRunItem(run, sqlText))
    }
  }
}
