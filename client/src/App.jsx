import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Subpage } from './pages/Subpage'
import { useContentConfig } from './config/ContentContext'
import { Bookmarks } from './pages/Bookmarks'
import { useUserAuth } from './config/UserAuthContext'
import Home from './pages/Home'


export default function App() {
  const { newsConfig, articleConfig } = useContentConfig()
  const { user } = useUserAuth()

  return (
    <>
      <Routes>
        <Route path='/' element={ <Home /> } />
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
