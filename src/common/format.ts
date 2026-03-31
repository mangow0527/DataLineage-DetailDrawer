export function fmtDate(iso: string | null | undefined) {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return d.toLocaleString()
}

export function fmtDuration(ms: number | null | undefined) {
  if (!ms || ms <= 0) return 'N/A'
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return `${mm}m ${ss}s`
}

export function statusClass(state?: string) {
  if (!state) return 'status-na'
  const s = state.toLowerCase()
  if (s === 'completed') return 'status-completed'
  if (s === 'running') return 'status-running'
  if (s === 'failed') return 'status-failed'
  if (s === 'aborted') return 'status-aborted'
  return 'status-na'
}
