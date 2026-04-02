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

export const RUN_STATE_KEYS = ['START', 'RUNNING', 'COMPLETE', 'ABORT', 'FAIL', 'OTHER'] as const
export type RunStateKey = (typeof RUN_STATE_KEYS)[number]

export function normalizeRunState(state?: string | null): RunStateKey | null {
  if (!state) return null
  if ((RUN_STATE_KEYS as readonly string[]).includes(state)) return state as RunStateKey

  const s = state.trim().toLowerCase()
  if (s === 'start') return 'START'
  if (s === 'running') return 'RUNNING'
  if (s === 'complete' || s === 'completed') return 'COMPLETE'
  if (s === 'abort' || s === 'aborted') return 'ABORT'
  if (s === 'fail' || s === 'failed') return 'FAIL'
  if (s === 'other') return 'OTHER'
  return null
}

export function statusClass(state?: string | null) {
  const normalized = normalizeRunState(state)
  if (normalized === 'RUNNING') return 'status-running'
  if (normalized === 'COMPLETE') return 'status-completed'
  if (normalized === 'FAIL') return 'status-failed'
  if (normalized === 'ABORT') return 'status-aborted'
  return 'status-na'
}

export function fmtRunStateZh(state?: string | null) {
  const normalized = normalizeRunState(state)
  if (!normalized) return state ? state : 'N/A'
  if (normalized === 'START') return '开始'
  if (normalized === 'RUNNING') return '运行中'
  if (normalized === 'COMPLETE') return '已完成'
  if (normalized === 'ABORT') return '已中止'
  if (normalized === 'FAIL') return '失败'
  return '其他'
}
