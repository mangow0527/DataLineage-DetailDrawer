import { useId, useMemo } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

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

type SourceCodeBlockProps = {
  content: string
  language: string | null
  theme: 'lightday' | 'evening'
  minLines?: number
  maxLines?: number
}

export default function SourceCodeBlock({ content, language, theme, minLines = 6, maxLines = 28 }: SourceCodeBlockProps) {
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
      minLines={minLines}
      maxLines={maxLines}
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
