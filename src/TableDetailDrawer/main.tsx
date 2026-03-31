import React from 'react'
import { createRoot } from 'react-dom/client'
import TableDetailDrawer from './TableDetailDrawer'

const el = document.getElementById('root')
if (!el) throw new Error('root not found')
createRoot(el).render(
  <React.StrictMode>
    <TableDetailDrawer />
  </React.StrictMode>
)
