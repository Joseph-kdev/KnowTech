import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContentConfigProvider } from './config/ContentContext.jsx'
import { UserAuthContextProvider } from './config/UserAuthContext.jsx'

const queryClient = new QueryClient()

const newsConfig = [
  { key: "theVerge", title: "The Verge" },
  { key: "techCrunch", title: "TechCrunch" },
  { key: "hackerNews", title: "The Hacker News" },
]

const articleConfig = [
  { key: 'bytebytego', title: 'Bytebytego' },
  { key: 'logRocket', title: 'Logrocket' },
  // { key: "SitePoint", title: "SitePoint"}
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <UserAuthContextProvider>
      <ContentConfigProvider newsConfig={newsConfig} articleConfig={articleConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ContentConfigProvider>
    </UserAuthContextProvider>
  </>,
)