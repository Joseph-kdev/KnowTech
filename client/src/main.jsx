import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewsConfigProvider } from './config/NewsContext'

const queryClient = new QueryClient

const newsConfig = [
  { key: "theVerge", title: "The Verge" },
  { key: "techCrunch", title: "TechCrunch" },
  { key: "hackerNews", title: "The Hacker News" },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NewsConfigProvider newsConfig={newsConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </NewsConfigProvider>
  </React.StrictMode>,
)
