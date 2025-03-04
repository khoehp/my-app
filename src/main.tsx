import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
// vậy bây giờ coi như xong r à anh
/**
 * này quan trọng là hướng khai báo route / layout / như nào nữa mỗi người code mỗi khác
 *
 *
 *
 */
