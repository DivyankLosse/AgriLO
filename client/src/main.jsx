import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
