import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import { Login } from './components/Login'
import { Subpage } from './components/Subpage'
import { useContentConfig } from './config/ContentContext'
import { Bookmarks } from './components/Bookmarks'
import { useUserAuth } from './config/UserAuthContext'


export default function App() {
  const { newsConfig, articleConfig } = useContentConfig()
  const { user } = useUserAuth()

  return (
    <>
      <Routes>
        <Route path='/' element={ user ? <Home /> : <Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/bookmarks' element={user ? <Bookmarks /> : <Login />} />
        {newsConfig.map(piece => (
          <Route key={piece.key} path={`/news/${piece.key}`} element={user ? <Subpage title={piece.title} type="news" /> : <Login />} />
        ))}

        {articleConfig.map(piece => (
          <Route key={piece.key} path={`/articles/${piece.key}`} element={user ? <Subpage title={piece.title} type="articles" /> : <Login />} />
        ))}
      </Routes>
    </>
  )
}
