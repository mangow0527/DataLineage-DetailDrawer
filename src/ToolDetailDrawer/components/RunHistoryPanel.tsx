import type { JobDetailViewModel } from '../data/view-model'
import RunHistoryTable from './RunHistoryTable'

type RunHistoryPanelProps = {
  items: JobDetailViewModel['runHistory']['items']
  theme: 'lightday' | 'dark'
  onSelectRun: (runId: string) => void
}

export default function RunHistoryPanel({
  items,
  theme,
  onSelectRun
}: RunHistoryPanelProps) {
  return <RunHistoryTable items={items} theme={theme} onSelect={onSelectRun} />
}
