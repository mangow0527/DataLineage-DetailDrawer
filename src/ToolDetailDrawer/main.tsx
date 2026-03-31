import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import ToolNodeDrawer from './ToolNodeDrawer'

const el = document.getElementById('root')
if (!el) throw new Error('root not found')
createRoot(el).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
)

function Demo() {
  const [toolDrawerVisible, setToolDrawerVisible] = React.useState(true)
  const [currentTheme, setCurrentTheme] = React.useState<'lightday' | 'darknight'>('lightday')
  const [currentNodeData] = React.useState<{ namespace: string; name: string } | null>({
    namespace: 'my-namespace',
    name: 'test-job-01'
  })

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentTheme((t) => (t === 'lightday' ? 'darknight' : 'lightday'))}
          style={{
            appearance: 'none',
            border: '1px solid #d9d9d9',
            background: '#fff',
            color: '#000',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 12,
            lineHeight: '20px',
            cursor: 'pointer'
          }}
          aria-label="toggle theme"
          title="切换主题"
        >
          {currentTheme === 'lightday' ? '切换深色' : '切换浅色'}
        </button>
        <button
          type="button"
          onClick={() => setToolDrawerVisible(true)}
          style={{
            appearance: 'none',
            border: '1px solid #d9d9d9',
            background: '#fff',
            color: '#000',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 12,
            lineHeight: '20px',
            cursor: 'pointer'
          }}
        >
          打开抽屉
        </button>
      </div>
      <ToolNodeDrawer
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
        nodeData={currentNodeData}
        currentTheme={currentTheme}
      />
    </>
  )
}
