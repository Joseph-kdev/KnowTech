import React from 'react'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"

export const Feed = ({ title, content, link, pubDate, summarize }) => {
  title = decodeHTML(title)
  content = decodeHTML(content)
  const parsedContent = parse(content)

  return (
    <div className='my-4 mx-1 px-3 py-2 bg-transparent shadow-slate-900'>
      <a href={link}>
        <h3 className='text-base font-semibold text-gray-800'>{title}</h3>
      </a>
        <p className='text-sm text-gray-500 leading-relaxed'>
          {parsedContent}
        </p>
      <p className='text-xs my-4 text-orange-400'>
        Posted: {pubDate}
      </p>
      <div className='flex cursor-pointer items-center' onClick={() => summarize(link)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
      </svg>
      <p className='ml-2 text-sm'>Summary</p>
      </div>
    </div>
  )
}
