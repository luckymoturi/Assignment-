import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BasicDemo from './Demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BasicDemo />
  </StrictMode>,
)
