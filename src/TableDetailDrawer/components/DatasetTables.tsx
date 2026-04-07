import drawerImgs from '../../common/DrawerIcons'
import DlTable, { DlEllipsisText } from '../../common/DlTable'
import { fmtDate } from '../../common/format'
import type { DatasetFieldViewModel, DatasetVersionViewModel } from '../data/view-model'

type Theme = 'lightday' | 'dark'

export function DatasetFieldTable({ theme, items }: { theme: Theme; items: DatasetFieldViewModel[] }) {
  const isDark = theme === 'dark'
  const timeIcon = isDark ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT

  return (
    <DlTable
      columns={[
        {
          key: 'name',
          title: (
            <span className="dl-table__th">
              <span>名称</span>
              <span className="dl-table__th-icon">{timeIcon}</span>
            </span>
          ),
          width: 220,
          render: (row) => <DlEllipsisText text={row.name} mono />
        },
        {
          key: 'type',
          title: (
            <span className="dl-table__th">
              <span>数据类型</span>
              <span className="dl-table__th-icon">{timeIcon}</span>
            </span>
          ),
          width: 160,
          render: (row) => <DlEllipsisText text={row.type} mono />
        },
        {
          key: 'description',
          title: (
            <span className="dl-table__th">
              <span>描述</span>
            </span>
          ),
          render: (row) => <DlEllipsisText text={row.description ?? ''} />
        }
      ]}
      dataSource={items}
      rowKey={(row) => row.name}
    />
  )
}

export function DatasetVersionHistoryTable({
  theme,
  items,
  onSelectVersion
}: {
  theme: Theme
  items: DatasetVersionViewModel[]
  onSelectVersion: (versionId: string) => void
}) {
  const isDark = theme === 'dark'
  const copyIcon = isDark ? drawerImgs.COPY_DARK : drawerImgs.COPY_LIGHT
  const idIcon = isDark ? drawerImgs.RUN_HISTORY_ID_DARK : drawerImgs.RUN_HISTORY_ID_LIGHT
  const timeIcon = isDark ? drawerImgs.RUN_HISTORY_TIME_DARK : drawerImgs.RUN_HISTORY_TIME_LIGHT

  return (
    <DlTable
      columns={[
        {
          key: 'version',
          title: (
            <span className="dl-table__th">
              <span>版本</span>
              <span className="dl-table__th-icon">{idIcon}</span>
            </span>
          ),
          width: 260,
          render: (row) => (
            <span className="dl-table__id-cell">
              <DlEllipsisText text={row.version} mono className="dl-table__id" />
              <button
                type="button"
                aria-label="copy"
                className="dl-table__copy"
                onClick={(e) => {
                  e.stopPropagation()
                  row.version && navigator.clipboard?.writeText(row.version)
                }}
              >
                {copyIcon}
              </button>
            </span>
          )
        },
        {
          key: 'createdAt',
          title: (
            <span className="dl-table__th">
              <span>创建时间</span>
              <span className="dl-table__th-icon">{timeIcon}</span>
            </span>
          ),
          width: 220,
          render: (row) => <DlEllipsisText text={fmtDate(row.createdAt)} />
        },
        {
          key: 'fields',
          title: (
            <span className="dl-table__th">
              <span>字段</span>
            </span>
          ),
          width: 90,
          render: (row) => <DlEllipsisText text={String(row.fields?.length ?? 0)} />
        },
        {
          key: 'createdByRun',
          title: (
            <span className="dl-table__th">
              <span>创建来源</span>
              <span className="dl-table__th-icon">{idIcon}</span>
            </span>
          ),
          width: 260,
          render: (row) =>
            row.createdByRun?.id ? (
              <span className="dl-table__id-cell">
                <DlEllipsisText text={row.createdByRun.id} mono className="dl-table__id" />
                <button
                  type="button"
                  aria-label="copy"
                  className="dl-table__copy"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard?.writeText(row.createdByRun?.id ?? '')
                  }}
                >
                  {copyIcon}
                </button>
              </span>
            ) : (
              <DlEllipsisText text="N/A" />
            )
        }
      ]}
      dataSource={items}
      rowKey={(row) => row.version}
      onRowClick={(row) => onSelectVersion(row.version)}
    />
  )
}
