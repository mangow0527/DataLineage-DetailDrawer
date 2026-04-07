import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import TableDetailDrawer from './TableDetailDrawer'

const el = document.getElementById('root')
if (!el) throw new Error('root not found')

function DemoHost() {
  const [visible, setVisible] = useState(false)
  return (
    <React.StrictMode>
      <div style={{ padding: 16 }}>
        <button
          type="button"
          onClick={() => setVisible(true)}
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
          Open Table Detail
        </button>
      </div>
      <TableDetailDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        currentTheme="lightday"
        nodeData={{ namespace: 'public', name: 'restaurants' }}
      />
    </React.StrictMode>
  )
}

createRoot(el).render(
  <DemoHost />
)
