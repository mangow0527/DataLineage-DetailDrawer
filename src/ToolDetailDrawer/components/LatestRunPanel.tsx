import { useId, useMemo } from 'react'
import { Collapse } from 'antd'
import AceEditor from 'react-ace'
import JsonTree from '../../common/JsonTree'
import type { JobDetailViewModel } from '../data/view-model'
import SqlBlock from './SqlBlock'

import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

type LatestRunPanelProps = {
  latestRun: JobDetailViewModel['latestRun']
  theme: 'lightday' | 'evening'
}

const ACE_MODE_BY_LANGUAGE: Record<string, string> = {
  java: 'java',
  py: 'python',
  python: 'python',
  sql: 'sql'
}

function toAceMode(language: string | null | undefined) {
  const key = (language ?? '').trim().toLowerCase()
  return ACE_MODE_BY_LANGUAGE[key] ?? 'text'
}

function SourceCodeBlock({
  content,
  language,
  theme
}: {
  content: string
  language: string | null
  theme: 'lightday' | 'evening'
}) {
  const id = useId()
  const aceMode = useMemo(() => toAceMode(language), [language])
  const aceTheme = theme === 'evening' ? 'tomorrow_night' : 'chrome'

  return (
    <AceEditor
      name={`source-code-${id}`}
      className="latest-info-panels__ace"
      mode={aceMode}
      theme={aceTheme}
      value={content}
      readOnly
      width="100%"
      minLines={6}
      maxLines={28}
      fontSize={14}
      showGutter={false}
      showPrintMargin={false}
      highlightActiveLine={false}
      wrapEnabled
      setOptions={{
        useWorker: false,
        showFoldWidgets: false,
        tabSize: 2,
        displayIndentGuides: false
      }}
      editorProps={{ $blockScrolling: true }}
    />
  )
}

export default function LatestRunPanel({ latestRun, theme }: LatestRunPanelProps) {
  const hasSql = Boolean(latestRun.sqlText?.trim())
  const hasSourceCode = Boolean(latestRun.sourceCodeText?.trim())
  const hasJobFacets = Object.keys(latestRun.jobFacets ?? {}).length > 0
  const hasRunFacets = Object.keys(latestRun.runFacets ?? {}).length > 0

  const jobFacetsForDisplay = (() => {
    const obj = latestRun.jobFacets ?? {}
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'sql') continue
      if (k === 'sourceCode') continue
      out[k] = v
    }
    return out
  })()

  const defaultOpenKeys: string[] = []
  if (hasSql) defaultOpenKeys.push('sql')
  if (hasSourceCode) defaultOpenKeys.push('sourceCode')
  if (hasJobFacets && Object.keys(jobFacetsForDisplay).length > 0) defaultOpenKeys.push('jobFacets')
  if (hasRunFacets) defaultOpenKeys.push('runFacets')

  return (
    <div className="latest-info-panels">
      <Collapse ghost defaultActiveKey={defaultOpenKeys}>
        {hasSql ? (
          <Collapse.Panel header="SQL" key="sql">
            <div className="latest-info-panels__body">
              <SqlBlock content={latestRun.sqlText ?? ''} theme={theme} />
            </div>
          </Collapse.Panel>
        ) : null}

        {hasSourceCode ? (
          <Collapse.Panel
            header="Source Code"
            key="sourceCode"
          >
            <div className="latest-info-panels__body">
              <SourceCodeBlock
                content={latestRun.sourceCodeText ?? ''}
                language={latestRun.sourceCodeLanguage}
                theme={theme}
              />
            </div>
          </Collapse.Panel>
        ) : null}

        {hasJobFacets && Object.keys(jobFacetsForDisplay).length > 0 ? (
          <Collapse.Panel header="Job Facets" key="jobFacets">
            <div className="latest-info-panels__body latest-info-panels__body--tree">
              <JsonTree data={jobFacetsForDisplay} theme={theme} />
            </div>
          </Collapse.Panel>
        ) : null}

        {hasRunFacets ? (
          <Collapse.Panel header="Run Facets" key="runFacets">
            <div className="latest-info-panels__body latest-info-panels__body--tree">
              <JsonTree data={latestRun.runFacets} theme={theme} />
            </div>
          </Collapse.Panel>
        ) : null}
      </Collapse>
    </div>
  )
}
