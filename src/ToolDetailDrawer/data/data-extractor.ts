import type { JobDetailViewModel } from './view-model'
import type { JobDetailApiResponse, JobRunsApiResponse } from './api-types'
import { mapJobDetailToViewModel } from './mappers'
import jobDetailResponseJson from '../mock-job-detail-api-response.json'
import jobRunsResponseJson from '../mock-job-runs-api-response.json'

export async function loadToolDetail(
  params: { namespace: string; jobName: string },
  opts?: { baseUrl?: string; pageNo?: number; pageSize?: number }
): Promise<JobDetailViewModel | null> {
  if (opts?.baseUrl) {
    const { namespace, jobName } = params
    const urlDetail = `${opts.baseUrl}/dte/v1/datalineage/namespaces/${encodeURIComponent(namespace)}/jobs/${encodeURIComponent(jobName)}`
    const urlRuns = `${opts.baseUrl}/dte/v1/datalineage/namespaces/${encodeURIComponent(namespace)}/jobs/${encodeURIComponent(jobName)}/runs?pageNo=${opts.pageNo ?? 1}&pageSize=${opts.pageSize ?? 100}`
    const [jobResp, runsResp] = (await Promise.all([
      fetch(urlDetail).then((r) => r.json()),
      fetch(urlRuns).then((r) => r.json())
    ])) as [JobDetailApiResponse, JobRunsApiResponse]
    if (jobResp.retCode === 0 && runsResp.retCode === 0) {
      return mapJobDetailToViewModel(jobResp, runsResp)
    }
    return null
  } else {
    const jobResp = jobDetailResponseJson as JobDetailApiResponse
    const runsResp = jobRunsResponseJson as JobRunsApiResponse
    if (jobResp.retCode === 0 && runsResp.retCode === 0) {
      return mapJobDetailToViewModel(jobResp, runsResp)
    }
    return null
  }
}
