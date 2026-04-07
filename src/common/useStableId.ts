import * as React from 'react'

const supportsUseId = typeof (React as unknown as { useId?: unknown }).useId === 'function'

function createFallbackId() {
  return `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

export function useStableId() {
  const fallbackRef = React.useRef<string | null>(null)

  if (supportsUseId) {
    return (React as unknown as { useId: () => string }).useId()
  }

  if (!fallbackRef.current) {
    fallbackRef.current = createFallbackId()
  }

  return fallbackRef.current
}

