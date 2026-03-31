import { Button } from 'antd'

type JobTabsProps = {
  activeTab: 'latestRun' | 'runHistory'
  onChange: (tab: 'latestRun' | 'runHistory') => void
}

export default function JobTabs({ activeTab, onChange }: JobTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
      <Button type={activeTab === 'latestRun' ? 'primary' : 'default'} onClick={() => onChange('latestRun')}>
        LATEST RUN
      </Button>
      <Button type={activeTab === 'runHistory' ? 'primary' : 'default'} onClick={() => onChange('runHistory')}>
        RUN HISTORY
      </Button>
    </div>
  )
}
