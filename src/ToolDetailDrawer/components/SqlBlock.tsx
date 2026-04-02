import { useId } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

type SqlBlockProps = {
  content: string
  theme?: 'lightday' | 'evening'
}

export default function SqlBlock({ content, theme = 'lightday' }: SqlBlockProps) {
  const id = useId()
  const aceTheme = theme === 'evening' ? 'tomorrow_night' : 'chrome'

  return (
    <AceEditor
      name={`sql-${id}`}
      className="latest-info-panels__ace"
      mode="sql"
      theme={aceTheme}
      value={content}
      readOnly
      width="100%"
      minLines={6}
      maxLines={24}
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
