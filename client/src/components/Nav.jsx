import React, { useState } from 'react'
import { X, Menu, ChevronDown, ChevronRight, Bookmark, Home, CircleUserRound} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContentConfig } from '../config/ContentContext';
import { useUserAuth } from '../config/UserAuthContext';
import { signOut } from 'firebase/auth';


export const Nav = () => {
    const { newsConfig, articleConfig } = useContentConfig()
    const [open, setOpen] = useState(false)
    const [techExpanded, setTechExpanded] = useState(true);
    const toggleSidebar = () => setOpen(!open)
    const toggleTech = () => setTechExpanded(!techExpanded);
    const { user } = useUserAuth()


  return (
    <div className=''>
      <div className='relative w-full bg-background h-[80px]'>
        {/* <div className='h-full pt-1'>
          <img src="know.png" alt="logo" className='h-[90%] mx-1 mt-1'/>
        </div>         */}
        <button
          className="fixed top-4 right-4 z-50 p-2 bg-accent text-background rounded-full shadow-lg hover:text-text"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-gray-100 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>

          <div className='mt-8'>
            <Link to="/" className="hover:text-gray-400 flex items-center">
              <Home size={20} className="mr-1" />
               <p className='ml-2'>
                  Home
                </p>
            </Link>
          </div>
          <div className='mt-3'>
            <Link to="/bookmarks" className="hover:text-gray-400 flex items-center">
               <Bookmark size={20} className="mr-1" /> 
               <p className='ml-2'>
               Bookmarks
               </p>
            </Link>
          </div>
          <div className='mt-3' onClick={() => user ? signOut() : null}>
            <Link to="/login" className="hover:text-gray-400 flex items-center">
               <CircleUserRound size={20} className="mr-1" /> 
               <p className='ml-2'>
               {user ? "Logout" : "Login"}
               </p>
            </Link>
          </div>
          <h2 className="text-xs font-semibold text-gray-400 mb-4 mt-8">FEEDS</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={toggleTech}
                  className="flex items-center w-full text-left text-gray-300 hover:text-white"
                >
                  {techExpanded ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                  News
                </button>
                <ul className="ml-4 mt-2 space-y-2 mb-2">
                {techExpanded && newsConfig.map(piece => (
                    <li key={piece.key}>
                      <Link to={`/news/${piece.key}`} className="flex items-center text-gray-400 hover:text-white">
                        {piece.title}
                      </Link>
                    </li>
                  ))}
                  </ul>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={toggleTech}
                  className="flex items-center w-full text-left text-gray-300 hover:text-white"
                >
                  {techExpanded ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                  Articles
                </button>
                <ul className="ml-4 mt-2 space-y-2">
                {techExpanded && articleConfig.map(piece => (
                    <li key={piece.key}>
                      <Link to={`/articles/${piece.key}`} className="flex items-center text-gray-400 hover:text-white">
                        {piece.title}
                      </Link>
                    </li>
                  ))}
                  </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
