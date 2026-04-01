import type { DatasetDetailApiResponse, DatasetVersionsApiResponse } from './api-types'
import type { DatasetDetailViewModel } from './view-model'

export function mapDatasetDetailToViewModel(
  detailResp: DatasetDetailApiResponse,
  versionsResp: DatasetVersionsApiResponse
): DatasetDetailViewModel {
  const title = detailResp.data.physicalName ?? `${detailResp.data.namespace}.${detailResp.data.name}`
  const columnCountFromFacet = detailResp.data.facets.schema?.fields ?? null
  const versions = versionsResp.data.versions.map((v) => ({
    version: v.version,
    createdAt: v.createdAt ?? null,
    fields: v.fields.map((f) => ({ name: f.name, type: f.type, description: f.description ?? null })),
    facets: v.facets ?? {},
    createdByRun: v.createdByRun ?? null,
    lifecycleState: v.lifecycleState ?? null
  }))
  const columnCountFromLatest = versions[0]?.fields.length ?? null

  return {
    header: {
      title,
      updatedAt: detailResp.data.updatedAt ?? null,
      columnCount: columnCountFromFacet ?? columnCountFromLatest
    },
    facets: detailResp.data.facets ?? {},
    versions
  }
}
