import { Button, Space, Tooltip, Typography } from 'antd'

type DetailToolbarProps = {
  runId: string
  onBack: () => void
}

export default function DetailToolbar({ runId, onBack }: DetailToolbarProps) {
  return (
    <Space style={{ marginBottom: 12, alignItems: 'center' }}>
      <Button type="text" size="small" onClick={onBack}>
        Back
      </Button>
      <Typography.Text>{runId}</Typography.Text>
      <Tooltip title="Copy Run ID">
        <Button type="text" size="small" onClick={() => runId && navigator.clipboard?.writeText(runId)}>
          Copy
        </Button>
      </Tooltip>
    </Space>
  )
}
