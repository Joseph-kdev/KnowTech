import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import { Login } from './components/Login'
import { useNewsConfig } from './config/NewsContext'
import { Newspage } from './components/Newspage'

export default function App() {
  const {newsConfig} = useNewsConfig()

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        {newsConfig.map(piece => (
          <Route key={piece.key} path={`/news/${piece.key}`} element={<Newspage title={piece.title} />} />
        ))}
      </Routes>
    </>
  )
}
