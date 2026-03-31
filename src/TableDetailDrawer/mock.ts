export type Field = {
  name: string
  type: string
  description?: string | null
}

export type DatasetVersion = {
  type: string
  name: string
  physicalName: string | null
  createdAt: string
  version: string
  namespace: string
  sourceName: string | null
  fields: Field[]
  tags: string[]
  lifecycleState: string | null
  description?: string | null
  currentSchemaVersion?: string | null
  createdByRun: { id: string } | null
  facets: Record<string, unknown>
}

export type DatasetVersions = {
  versions: DatasetVersion[]
  totalCounts: number
}

const v1: DatasetVersion = {
  type: 'DB_TABLE',
  name: 'restaurants',
  physicalName: 'public.restaurants',
  createdAt: '2025-10-29T03:10:00Z',
  version: '374ea768-7fd5-42e0-a437-98f1044bd76f',
  namespace: 'public',
  sourceName: 'food_delivery_db',
  fields: [
    { name: 'id', type: 'INTEGER', description: 'The unique ID of the restaurant.' },
    { name: 'created_at', type: 'TIMESTAMP', description: null },
    { name: 'updated_at', type: 'TIMESTAMP', description: null },
    { name: 'name', type: 'VARCHAR', description: null },
    { name: 'email', type: 'VARCHAR', description: null }
  ],
  tags: [],
  lifecycleState: 'N/A',
  description: 'A table for restaurants.',
  currentSchemaVersion: null,
  createdByRun: { id: 'run-123' },
  facets: {
    documentation: {
      _producer: 'https://github.com/MarquezProject/marquez',
      _schemaURL: 'https://openlineage.io/spec/facets/1-0/',
      description: 'A table for restaurants.'
    },
    dataSource: {
      uri: 'postgres://food_delivery:food@localhost:5432/food',
      name: 'food_delivery_db',
      _producer: 'https://github.com/MarquezProject/marquez',
      _schemaURL: 'https://openlineage.io/spec/facets/1-0/'
    },
    schema: {
      fields: 5,
      _producer: 'https://github.com/MarquezProject/marquez',
      _schemaURL: 'https://openlineage.io/spec/facets/1-0/'
    }
  }
}

const v0: DatasetVersion = {
  type: 'DB_TABLE',
  name: 'restaurants',
  physicalName: 'public.restaurants',
  createdAt: '2025-10-20T03:10:00Z',
  version: 'd224dac0-35d7-4d9b-bbbe-6fff1a8485ad',
  namespace: 'public',
  sourceName: 'food_delivery_db',
  fields: [
    { name: 'id', type: 'INTEGER', description: 'The unique ID of the restaurant.' },
    { name: 'created_at', type: 'TIMESTAMP', description: null },
    { name: 'name', type: 'VARCHAR', description: null }
  ],
  tags: [],
  lifecycleState: 'N/A',
  description: 'A table for restaurants.',
  currentSchemaVersion: null,
  createdByRun: { id: 'run-122' },
  facets: {
    schema: {
      fields: 3,
      _producer: 'https://github.com/MarquezProject/marquez',
      _schemaURL: 'https://openlineage.io/spec/facets/1-0/'
    }
  }
}

export const mockDatasetVersions: DatasetVersions = {
  versions: [v1, v0],
  totalCounts: 2
}
