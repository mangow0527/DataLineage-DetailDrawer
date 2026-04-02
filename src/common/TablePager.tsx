import { Input, Pagination } from 'antd'
import { useMemo, useState } from 'react'

type TablePagerProps = {
  total: number
  pageSize: number
  current: number
  onChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function TablePager({ total, pageSize, current, onChange, onPageSizeChange }: TablePagerProps) {
  const [gotoValue, setGotoValue] = useState<string>('')
  const maxPage = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  return (
    <div className="dl-table-pagination">
      <div className="dl-table-pagination__total">共：{total} 条</div>
      <div className="dl-table-pagination__right">
        <Pagination
          className="dl-table-pagination__pager"
          total={total}
          showSizeChanger
          pageSizeOptions={['10', '25', '50', '100']}
          pageSize={pageSize}
          current={current}
          onChange={(p) => onChange(p)}
          onShowSizeChange={(_, size) => onPageSizeChange(size)}
        />
        <div className="dl-table-pagination__goto">
          <span className="dl-table-pagination__goto-label">前往</span>
          <Input
            value={gotoValue}
            onChange={(e) => setGotoValue(e.target.value)}
            size="small"
            className="dl-table-pagination__goto-input"
            onPressEnter={() => {
              const n = Number.parseInt(gotoValue, 10)
              if (!Number.isFinite(n)) return
              const next = Math.min(Math.max(n, 1), maxPage)
              onChange(next)
              setGotoValue('')
            }}
          />
        </div>
      </div>
    </div>
  )
}
