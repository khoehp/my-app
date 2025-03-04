import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import TestDetail from './pages/test/detail'
import ListTest from './pages/test/list'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Route path='/' component={App} />
    <Route path='/listTest' component={ListTest} />
    <Route path='listTest/:id' component={TestDetail} />
  </BrowserRouter>
)
