import React, { useEffect, useMemo, useState } from 'react'
import { Tree } from 'antd'
import drawerImgs from './DrawerImgs'

type TreeNode = {
  key: React.Key
  title: React.ReactNode
  label: string
  value: unknown
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

function normalizeInlineText(s: string) {
  return s.replace(/\s+/g, ' ').trim()
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

function keyNameFromLabel(label: string) {
  if (label.startsWith('"') && label.endsWith('"') && label.length >= 2) return label.slice(1, -1)
  return label
}

function semanticLeafType(label: string, v: unknown) {
  const keyName = keyNameFromLabel(label)
  if (keyName === 'fields' && typeof v === 'number') return 'number'
  if (keyName === 'type' && typeof v === 'string' && (v === 'BATCH' || v === 'STREAM')) return 'JobType'
  if (
    keyName === 'state' &&
    typeof v === 'string' &&
    (v === 'START' || v === 'RUNNING' || v === 'COMPLETE' || v === 'ABORT' || v === 'FAIL' || v === 'OTHER')
  ) {
    return 'RunState'
  }
  return 'string'
}

function previewForValue(v: unknown, opts?: { expanded?: boolean; maxChars?: number }) {
  const t = typeOfValue(v)
  const items = t === 'array' || t === 'object' ? countItems(v) : 0
  const expanded = Boolean(opts?.expanded)
  const maxChars = opts?.maxChars ?? 48
  const preview =
    t === 'array'
      ? `${items} items`
      : t === 'object'
        ? `${items} items`
        : t === 'string'
          ? `"${expanded ? String(v) : truncateString(normalizeInlineText(String(v)), maxChars)}"`
          : t === 'number' || t === 'boolean'
            ? String(v)
            : t === 'null'
              ? 'null'
              : truncateString(String(v))

  return preview
}

function toTreeChildren(value: unknown, prefix: string): TreeNode[] | undefined {
  if (Array.isArray(value)) {
    return value.map((v, idx) => {
      const key = `${prefix}[${idx}]`
      const children = Array.isArray(v) || isObject(v) ? toTreeChildren(v, key) : undefined
      return {
        key,
        title: `[${idx}]`,
        label: `[${idx}]`,
        value: v,
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
        title: JSON.stringify(k),
        label: JSON.stringify(k),
        value: v,
        children
      }
    })
  }
  return undefined
}

function rootLabelForValue(v: unknown) {
  if (Array.isArray(v)) return ''
  if (isObject(v)) return ''
  return 'value'
}

function toTreeNodes(value: unknown, prefix = 'root'): TreeNode[] {
  return [
    {
      key: prefix,
      title: rootLabelForValue(value),
      label: rootLabelForValue(value),
      value,
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

function ancestorsOfKey(key: string) {
  const out: string[] = []
  let cur = key
  while (cur) {
    out.push(cur)
    const lastBracket = cur.lastIndexOf('[')
    if (cur.endsWith(']') && lastBracket >= 0) {
      cur = cur.slice(0, lastBracket)
      continue
    }
    const lastDot = cur.lastIndexOf('.')
    if (lastDot >= 0) {
      cur = cur.slice(0, lastDot)
      continue
    }
    break
  }
  return out
}

export default function JsonTree({
  title,
  data,
  theme = 'lightday'
}: {
  title?: string
  data: unknown
  theme?: 'lightday' | 'evening'
}) {
  const treeData = useMemo(() => toTreeNodes(data), [data])
  const allKeys = useMemo(() => collectKeys(treeData), [treeData])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(allKeys)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [expandedValueKeys, setExpandedValueKeys] = useState<Set<string>>(() => new Set())

  const hoveredAncestors = useMemo(() => {
    if (!hoveredKey) return new Set<string>()
    return new Set(ancestorsOfKey(hoveredKey))
  }, [hoveredKey])

  useEffect(() => {
    setExpandedKeys(allKeys)
  }, [allKeys])

  return (
    <div onMouseLeave={() => setHoveredKey(null)}>
      {title ? <div style={{ fontWeight: 600 }}>{title}</div> : null}
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys: React.Key[]) => setExpandedKeys(keys)}
        titleRender={(node) => {
          const n = node as TreeNode
          const keyStr = String(n.key)
          const showCopy = hoveredKey ? hoveredAncestors.has(String(n.key)) : false
          const showColon = String(n.key) !== 'root'
          const runtimeType = typeOfValue(n.value)
          const isLeaf = runtimeType !== 'object' && runtimeType !== 'array'
          const showLeafType = showColon && isLeaf
          const displayType = semanticLeafType(n.label, n.value)
          const hasLabel = Boolean(n.label)
          const isExpandableValue = isLeaf && typeof n.value === 'string' && normalizeInlineText(n.value).length > 48
          const isExpandedValue = isExpandableValue && expandedValueKeys.has(keyStr)
          const preview = previewForValue(n.value, isExpandableValue ? { expanded: isExpandedValue, maxChars: 48 } : undefined)
          const previewClass = isLeaf ? 'dl-json-tree__preview' : 'dl-json-tree__items'
          return (
            <span
              className={
                isExpandableValue ? 'dl-json-tree__row dl-json-tree__row--expandable' : 'dl-json-tree__row'
              }
              onMouseEnter={() => setHoveredKey(String(n.key))}
              onClick={(e) => {
                if (!isExpandableValue) return
                e.stopPropagation()
                setExpandedValueKeys((prev) => {
                  const next = new Set(prev)
                  if (next.has(keyStr)) {
                    next.delete(keyStr)
                  } else {
                    next.add(keyStr)
                  }
                  return next
                })
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {hasLabel ? (
                  <span
                    className="dl-json-tree__label"
                  >
                    {n.label}
                    {showColon ? ':' : ''}
                  </span>
                ) : null}
                {showLeafType ? <span className="dl-json-tree__type">{displayType}</span> : null}
                <span className={previewClass}>{preview}</span>
              </span>
              <button
                type="button"
                aria-label="copy"
                className="dl-json-tree__copy"
                onClick={(e) => {
                  e.stopPropagation()
                  copyJson(n.value)
                }}
                style={{
                  opacity: showCopy ? 1 : 0,
                  pointerEvents: showCopy ? 'auto' : 'none',
                  flex: '0 0 auto'
                }}
              >
                {theme === 'evening' ? drawerImgs.COPY_DARK : drawerImgs.COPY_LIGHT}
              </button>
            </span>
          )
        }}
      />
    </div>
  )
}
