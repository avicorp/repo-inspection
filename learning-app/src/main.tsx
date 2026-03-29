import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LearningProvider } from './contexts/LearningContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LearningProvider>
        <App />
      </LearningProvider>
    </BrowserRouter>
  </StrictMode>,
)
