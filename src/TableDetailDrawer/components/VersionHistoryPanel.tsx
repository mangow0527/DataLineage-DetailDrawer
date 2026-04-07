import { useMemo } from 'react'
import TablePager from '../../common/TablePager'
import { useTablePagination } from '../../common/useTablePagination'
import type { DatasetVersionViewModel } from '../data/view-model'
import { DatasetVersionHistoryTable } from './DatasetTables'
import './TablePanels.less'

export default function VersionHistoryPanel({
  theme,
  versions,
  onSelectVersion
}: {
  theme: 'lightday' | 'dark'
  versions: DatasetVersionViewModel[]
  onSelectVersion: (versionId: string) => void
}) {
  const { pageSize, current, setCurrent, onPageSizeChange } = useTablePagination(versions.length, 10)
  const pagedVersions = useMemo(() => {
    const start = (current - 1) * pageSize
    return versions.slice(start, start + pageSize)
  }, [versions, current, pageSize])

  return (
    <div className="dl-version-history-panel">
      <DatasetVersionHistoryTable theme={theme} items={pagedVersions} onSelectVersion={onSelectVersion} />
      <div className="dl-version-history-panel__pager">
        <TablePager
          total={versions.length}
          pageSize={pageSize}
          current={current}
          onChange={setCurrent}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}
