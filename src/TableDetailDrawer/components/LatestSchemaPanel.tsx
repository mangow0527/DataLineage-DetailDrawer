import { Collapse } from 'antd'
import { useMemo } from 'react'
import JsonTree from '../../common/JsonTree'
import TablePager from '../../common/TablePager'
import { useTablePagination } from '../../common/useTablePagination'
import type { DatasetFieldViewModel } from '../data/view-model'
import { DatasetFieldTable } from './DatasetTables'
import './TablePanels.less'

export default function LatestSchemaPanel({
  theme,
  loading,
  fields,
  facetsData
}: {
  theme: 'lightday' | 'dark'
  loading: boolean
  fields: DatasetFieldViewModel[]
  facetsData: unknown
}) {
  const hasFacets = (() => {
    if (Array.isArray(facetsData)) return facetsData.length > 0
    if (facetsData && typeof facetsData === 'object') return Object.keys(facetsData as object).length > 0
    return Boolean(facetsData)
  })()

  const { pageSize, current, setCurrent, onPageSizeChange } = useTablePagination(fields.length, 10)
  const pagedFields = useMemo(() => {
    const start = (current - 1) * pageSize
    return fields.slice(start, start + pageSize)
  }, [fields, current, pageSize])

  return (
    <div className="dl-latest-schema-panel">
      {loading ? (
        <div className="dl-latest-schema-panel__loading">Loading...</div>
      ) : null}

      <DatasetFieldTable theme={theme} items={pagedFields} />
      <div className="dl-latest-schema-panel__pager">
        <TablePager
          total={fields.length}
          pageSize={pageSize}
          current={current}
          onChange={setCurrent}
          onPageSizeChange={onPageSizeChange}
        />
      </div>

      {hasFacets ? (
        <div className="dl-latest-schema-panel__facets">
          <div className="latest-info-panels">
            <Collapse className="dl-collapse" ghost defaultActiveKey={['facets']}>
              <Collapse.Panel header="Facets" key="facets">
                <div className="latest-info-panels__body latest-info-panels__body--tree">
                  <JsonTree data={facetsData} theme={theme} />
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
      ) : null}
    </div>
  )
}

