import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import { Login } from './components/Login'
import { Subpage } from './components/Subpage'
import { useContentConfig } from './config/ContentContext'
import { Bookmarks } from './components/Bookmarks'

export default function App() {
  const { newsConfig, articleConfig } = useContentConfig()

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/bookmarks' element={<Bookmarks />} />
        {newsConfig.map(piece => (
          <Route key={piece.key} path={`/news/${piece.key}`} element={<Subpage title={piece.title} type="news" />} />
        ))}

        {articleConfig.map(piece => (
          <Route key={piece.key} path={`/articles/${piece.key}`} element={<Subpage title={piece.title} type="articles" />} />
        ))}
      </Routes>
    </>
  )
}
