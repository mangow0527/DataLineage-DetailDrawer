import { useEffect, useMemo, useState } from 'react'

export function useTablePagination(total: number, initialPageSize = 10) {
  const [pageSize, setPageSize] = useState<number>(initialPageSize)
  const [current, setCurrent] = useState<number>(1)

  const maxPage = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  useEffect(() => {
    if (current > maxPage) setCurrent(maxPage)
  }, [current, maxPage])

  const onPageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrent(1)
  }

  return { pageSize, current, setCurrent, onPageSizeChange, maxPage }
}
