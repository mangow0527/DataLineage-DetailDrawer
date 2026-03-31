import { Button, Space, Table, Typography } from 'antd'
import { fmtDate, fmtDuration, statusClass } from '../../common/format'
import type { RunHistoryItemViewModel } from '../data/view-model'

type RunHistoryTableProps = {
  items: RunHistoryItemViewModel[]
  onSelect: (runId: string) => void
}

export default function RunHistoryTable({ items, onSelect }: RunHistoryTableProps) {
  return (
    <div>
      <Typography.Text strong>RUN HISTORY</Typography.Text>
      <Table
        size="small"
        rowKey="id"
        dataSource={items}
        pagination={{ pageSize: 8 }}
        onRow={(record: RunHistoryItemViewModel) => ({
          onClick: () => onSelect(record.id)
        })}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            render: (v: string) => (
              <Space size={8}>
                <span
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  }}
                >
                  {v?.length > 8 ? `${v.slice(0, 8)}...` : v}
                </span>
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    v && navigator.clipboard?.writeText(v)
                  }}
                >
                  Copy
                </Button>
              </Space>
            )
          },
          {
            title: 'STATE',
            dataIndex: 'state',
            render: (v: string) => <span className={`status-pill ${statusClass(v)}`}>{v || 'N/A'}</span>
          },
          { title: 'CREATED AT', dataIndex: 'createdAt', render: fmtDate },
          { title: 'STARTED AT', dataIndex: 'startedAt', render: fmtDate },
          { title: 'ENDED AT', dataIndex: 'endedAt', render: fmtDate },
          { title: 'DURATION', dataIndex: 'durationMs', render: fmtDuration }
        ]}
      />
    </div>
  )
}
