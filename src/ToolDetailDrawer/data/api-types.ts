export type DocumentationJobFacet = {
  _producer: string
  _schemaURL: string
  description: string
}

export type JobTypeJobFacet = {
  _producer: string
  _schemaURL: string
  processingType: JobType
  integration: string
  jobType: string
}

export type SourceCodeJobFacet = {
  _producer: string
  _schemaURL: string
  language: string
  sourceCode: string
}

export type SqlJobFacet = {
  _producer: string
  _schemaURL: string
  query: string
}

export type SupportedJobFacets = {
  documentation?: DocumentationJobFacet
  jobType?: JobTypeJobFacet
  sourceCode?: SourceCodeJobFacet
  sql?: SqlJobFacet
}

export type RunApi = {
  id: string
  createdAt: string
  updatedAt: string
  nominalStartTime: string | null
  nominalEndTime: string | null
  state: RunState
  startedAt: string | null
  endedAt: string | null
  durationMs: number | null
  args: Record<string, unknown>
  inputDatasetVersions: Array<{
    datasetVersionId: { namespace: string; name: string; version: string }
    facets?: Record<string, unknown>
  }>
  outputDatasetVersions: Array<{
    datasetVersionId: { namespace: string; name: string; version: string }
    facets?: Record<string, unknown>
  }>
  facets: Record<string, unknown>
}

export type JobType = 'BATCH' | 'STREAM'

export type RunState = 'START' | 'RUNNING' | 'COMPLETE' | 'ABORT' | 'FAIL' | 'OTHER'

export type JobDetailApi = {
  id: string
  type: JobType
  name: string
  parentJobName: string | null
  parentJobUuid: string | null
  createdAt: string
  updatedAt: string
  namespace: string
  inputs: Array<{ namespace: string; name: string }>
  outputs: Array<{ namespace: string; name: string }>
  location: string | null
  description: string | null
  latestRun: RunApi | null
  facets: SupportedJobFacets
  labels: string[]
}

export type JobDetailApiResponse = {
  retCode: number
  retInfo: string
  i18nKey?: string
  data: JobDetailApi
}

export type JobRunsApi = {
  runs: RunApi[]
  totalCount: number
}

export type JobRunsApiResponse = {
  retCode: number
  retInfo: string
  i18nKey?: string
  data: JobRunsApi
}
