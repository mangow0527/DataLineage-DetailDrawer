import type { DatasetDetailViewModel } from './view-model'
import type { DatasetDetailApiResponse, DatasetVersionsApiResponse } from './api-types'
import { mapDatasetDetailToViewModel } from './mappers'
import datasetDetailResponseJson from '../mock-dataset-detail-api-response.json'
import datasetVersionsResponseJson from '../mock-dataset-versions-api-response.json'

export async function loadDatasetDetail(
  params: { namespace: string; name: string },
  opts?: { baseUrl?: string }
): Promise<DatasetDetailViewModel | null> {
  if (opts?.baseUrl) {
    const { namespace, name } = params
    const urlDetail = `${opts.baseUrl}/dte/v1/datalineage/namespaces/${encodeURIComponent(namespace)}/datasets/${encodeURIComponent(name)}`
    const urlVersions = `${opts.baseUrl}/dte/v1/datalineage/namespaces/${encodeURIComponent(namespace)}/datasets/${encodeURIComponent(name)}/versions`
    const [detailResp, versionsResp] = (await Promise.all([
      fetch(urlDetail).then((r) => r.json()),
      fetch(urlVersions).then((r) => r.json())
    ])) as [DatasetDetailApiResponse, DatasetVersionsApiResponse]
    if (detailResp.retCode === 0 && versionsResp.retCode === 0) {
      return mapDatasetDetailToViewModel(detailResp, versionsResp)
    }
    return null
  }

  const detailResp = datasetDetailResponseJson as DatasetDetailApiResponse
  const versionsResp = datasetVersionsResponseJson as DatasetVersionsApiResponse
  if (detailResp.retCode === 0 && versionsResp.retCode === 0) {
    return mapDatasetDetailToViewModel(detailResp, versionsResp)
  }
  return null
}
