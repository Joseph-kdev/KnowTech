import React, { useState } from 'react'
import { getFeeds } from '../services/articles'
import { useQuery } from "@tanstack/react-query"
import { useContentConfig } from '../config/ContentContext'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"
import { Nav } from './Nav'
import { useUserAuth } from '../config/UserAuthContext'
import { formatPublicationDate } from './Feedlist'
import { AiChat } from './AiChat'

const PageItem = ({ title, content, author, pubDate, link }) => { 
  title = decodeHTML(title)
  content = decodeHTML(content)
  const parsedContent = parse(content)
  const date = formatPublicationDate(pubDate)

  const { user } = useUserAuth()
  const [launch, setLaunch] = useState(false)

  const updateLaunch = () => {
    setLaunch(prev => !prev)
  }

  return ( 
    <>
    {launch 
      && 
    <AiChat user={user.uid} title={title} author={author} link={link} launch={launch} />
    }
      <div className='mx-1 my-4 md:mx-[10%] bg-primary'>
        <h4 className='text-lg font-semibold bg-secondary p-1 hover:text-gray-700'>
          <a href={link} target="_blank">
            {title}
          </a>
        </h4>
        <div className='p-1 text-xs text-gray-500'>
          <p>
            Published: {date}
          </p>
        </div>
        <div className='page-content text-xs my-1 leading-relaxed p-1 text-gray-400'>
          {parsedContent}
        </div>
        <div className='flex justify-between'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-accent mb-2 mx-1 hover:text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        <div onClick={updateLaunch}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-accent mb-2 mx-1 hover:text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </div>
        </div>
      </div>
    </>
  )
}

export const Subpage = ({ title, type }) => {
    const {newsConfig, articleConfig } = useContentConfig()
    const config = type === "news" ? newsConfig : articleConfig
    const feedPiece = config.find(piece => piece.title === title)
    const { user } = useUserAuth()

    const {data: feed, isLoading, isError } = useQuery({
        queryKey: [`${type}`],
        queryFn: () => getFeeds(type, user.uid),
        initialData: []
    })

    if(isLoading) {
        return <div>Loading</div>
    }

    if(isError) {
        return <div>Errored Out</div>
    }

    const articles = feed ? feed[feedPiece.key] : []

    console.log(articles)

  return (
    <>
      <Nav />
      <h3 className='text-3xl text-center my-2 text-text font-heading'>
        {title}
      </h3>
      <div>
        { articles.map(article => (
          <div key={article.title}>
            <PageItem
              title={article.title}
              content={article.content}
              link={article.link}
              author={article.author}
              pubDate={article.pubDate}
            />
          </div>
        ))}
      </div>
    </>
  )
}
