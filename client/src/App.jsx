import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import { Login } from './components/Login'
import { Newspage } from './components/Newspage'
import { useContentConfig } from './config/ContentContext'

export default function App() {
  const { newsConfig, articleConfig } = useContentConfig()

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        {newsConfig.map(piece => (
          <Route key={piece.key} path={`/news/${piece.key}`} element={<Newspage title={piece.title} />} />
        ))}

        {/* {articleConfig.map(piece => (
          <Route key={piece.key} path={`/articles/${piece.key}`} element={<Newspage title={piece.title} />} />
        ))} */}
      </Routes>
    </>
  )
}
