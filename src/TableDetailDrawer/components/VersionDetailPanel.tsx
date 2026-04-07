import { Collapse } from 'antd'
import { useMemo } from 'react'
import JsonTree from '../../common/JsonTree'
import TablePager from '../../common/TablePager'
import { useTablePagination } from '../../common/useTablePagination'
import type { DatasetVersionViewModel } from '../data/view-model'
import { DatasetFieldTable } from './DatasetTables'
import './TablePanels.less'

export default function VersionDetailPanel({
  theme,
  version
}: {
  theme: 'lightday' | 'dark'
  version: DatasetVersionViewModel
}) {
  const fields = version.fields ?? []
  const { pageSize, current, setCurrent, onPageSizeChange } = useTablePagination(fields.length, 10)
  const pagedFields = useMemo(() => {
    const start = (current - 1) * pageSize
    return fields.slice(start, start + pageSize)
  }, [fields, current, pageSize])

  const hasFacets = Object.keys(version.facets ?? {}).length > 0

  return (
    <div className="drawer-body">
      <DatasetFieldTable theme={theme} items={pagedFields} />
      <div className="dl-version-detail-panel__pager">
        <TablePager
          total={fields.length}
          pageSize={pageSize}
          current={current}
          onChange={setCurrent}
          onPageSizeChange={onPageSizeChange}
        />
      </div>

      {hasFacets ? (
        <div className="dl-version-detail-panel__facets">
          <div className="latest-info-panels">
            <Collapse className="dl-collapse" ghost defaultActiveKey={['facets']}>
              <Collapse.Panel header="Facets" key="facets">
                <div className="latest-info-panels__body latest-info-panels__body--tree">
                  <JsonTree data={version.facets ?? {}} theme={theme} />
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
      ) : null}
    </div>
  )
}
