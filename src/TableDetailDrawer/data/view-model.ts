export type DatasetFieldViewModel = {
  name: string
  type: string
  description?: string | null
}

export type DatasetVersionViewModel = {
  version: string
  createdAt: string | null
  fields: DatasetFieldViewModel[]
  facets: Record<string, unknown>
  createdByRun: { id: string } | null
  lifecycleState: string | null
}

export type DatasetDetailViewModel = {
  header: {
    title: string
    updatedAt: string | null
    columnCount: number | null
  }
  facets: Record<string, unknown>
  versions: DatasetVersionViewModel[]
}
