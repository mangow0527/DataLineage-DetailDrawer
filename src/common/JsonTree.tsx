import React, { useEffect, useMemo, useState } from 'react'
import { Tree } from 'antd'

type TreeNode = {
  key: React.Key
  title: React.ReactNode
  children?: TreeNode[]
}

function countItems(value: unknown): number {
  if (Array.isArray(value)) return value.length
  if (value && typeof value === 'object') return Object.keys(value as object).length
  return 0
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function truncateString(s: string, max = 80) {
  if (s.length <= max) return s
  return `${s.slice(0, max)}…`
}

function copyJson(value: unknown) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  navigator.clipboard?.writeText(text)
}

function typeOfValue(v: unknown) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

function titleForValue(label: string, v: unknown) {
  const t = typeOfValue(v)
  const items = t === 'array' || t === 'object' ? countItems(v) : 0
  const extra =
    t === 'array'
      ? `[ ${items} items ]`
      : t === 'object'
        ? `{ ${items} items }`
        : t === 'string'
          ? `"${truncateString(String(v))}"`
          : t === 'number' || t === 'boolean'
            ? String(v)
            : t === 'null'
              ? 'null'
              : truncateString(String(v))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      >
        {label}
      </span>
      <span style={{ color: '#8c8c8c' }}>{extra}</span>
      <button
        type="button"
        title="Copy"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          copyJson(v)
        }}
        style={{
          appearance: 'none',
          border: '1px solid transparent',
          background: 'transparent',
          padding: '2px 6px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Copy
      </button>
    </span>
  )
}

function toTreeChildren(value: unknown, prefix: string): TreeNode[] | undefined {
  if (Array.isArray(value)) {
    return value.map((v, idx) => {
      const key = `${prefix}[${idx}]`
      const children = Array.isArray(v) || isObject(v) ? toTreeChildren(v, key) : undefined
      return {
        key,
        title: titleForValue(`[${idx}]`, v),
        children
      }
    })
  }
  if (isObject(value)) {
    return Object.entries(value).map(([k, v]) => {
      const key = `${prefix}.${k}`
      const children = Array.isArray(v) || isObject(v) ? toTreeChildren(v, key) : undefined
      return {
        key,
        title: titleForValue(JSON.stringify(k), v),
        children
      }
    })
  }
  return undefined
}

function rootLabelForValue(v: unknown) {
  if (Array.isArray(v)) return '[...]'
  if (isObject(v)) return '{...}'
  return 'value'
}

function toTreeNodes(value: unknown, prefix = 'root'): TreeNode[] {
  return [
    {
      key: prefix,
      title: titleForValue(rootLabelForValue(value), value),
      children: Array.isArray(value) || isObject(value) ? toTreeChildren(value, prefix) : undefined
    }
  ]
}

function collectKeys(nodes: TreeNode[], acc: React.Key[] = []) {
  for (const n of nodes) {
    acc.push(n.key as React.Key)
    if (n.children) collectKeys(n.children, acc)
  }
  return acc
}

export default function JsonTree({ title, data }: { title?: string; data: unknown }) {
  const treeData = useMemo(() => toTreeNodes(data), [data])
  const allKeys = useMemo(() => collectKeys(treeData), [treeData])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(allKeys)

  useEffect(() => {
    setExpandedKeys(allKeys)
  }, [allKeys])

  return (
    <div>
      {title ? <div style={{ fontWeight: 600 }}>{title}</div> : null}
      <Tree treeData={treeData} expandedKeys={expandedKeys} onExpand={(keys: React.Key[]) => setExpandedKeys(keys)} />
    </div>
  )
}
