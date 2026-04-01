export type DocumentationDatasetFacet = {
  _producer: string
  _schemaURL: string
  description: string
}

export type DatasetSchemaDatasetFacet = {
  _producer: string
  _schemaURL: string
  fields: number
}

export type DatasetTypeDatasetFacet = {
  _producer: string
  _schemaURL: string
  type: string
}

export type SupportedDatasetFacets = {
  schema?: DatasetSchemaDatasetFacet
  documentation?: DocumentationDatasetFacet
  datasetType?: DatasetTypeDatasetFacet
}

export type DatasetDetailApi = {
  namespace: string
  name: string
  physicalName: string | null
  updatedAt: string | null
  facets: SupportedDatasetFacets
}

export type DatasetDetailApiResponse = {
  retCode: number
  retInfo: string
  i18nKey?: string
  data: DatasetDetailApi
}

export type DatasetFieldApi = {
  name: string
  type: string
  description?: string | null
}

export type DatasetVersionApi = {
  type: string
  name: string
  physicalName: string | null
  createdAt: string
  version: string
  namespace: string
  sourceName: string | null
  fields: DatasetFieldApi[]
  tags: string[]
  lifecycleState: string | null
  description?: string | null
  currentSchemaVersion?: string | null
  createdByRun: { id: string } | null
  facets: Record<string, unknown>
}

export type DatasetVersionsApi = {
  versions: DatasetVersionApi[]
  totalCount: number
}

export type DatasetVersionsApiResponse = {
  retCode: number
  retInfo: string
  i18nKey?: string
  data: DatasetVersionsApi
}
