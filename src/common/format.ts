export function fmtDate(iso: string | null | undefined) {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return d.toLocaleString()
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'N/A'
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mi = pad2(d.getMinutes())
  const ss = pad2(d.getSeconds())
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
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

export function fmtDurationHmsMs(ms: number | null | undefined) {
  if (ms == null || ms < 0) return 'N/A'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const msPart = Math.floor(ms % 1000)
  return `${h}h${m}m${s}s${msPart}ms`
}

export function statusClass(state?: string) {
  if (!state) return 'status-na'
  const s = state.toLowerCase()
  if (s === 'completed' || s === 'complete') return 'status-completed'
  if (s === 'running') return 'status-running'
  if (s === 'failed' || s === 'fail') return 'status-failed'
  if (s === 'aborted' || s === 'abort') return 'status-aborted'
  return 'status-na'
}
