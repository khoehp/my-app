import { App } from 'antd'
import React from 'react'

// Lazy load components
const NotFound = React.lazy(() => import('../pages/notFound'))

// Định nghĩa các routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

export default routes
