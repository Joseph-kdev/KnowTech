import React from 'react'
import { getNews } from '../services/articles'
import { useQuery } from "@tanstack/react-query"
import { useNewsConfig } from '../config/NewsContext'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"
import { Nav } from './Nav'

const PageItem = ({ title, content, author, pubDate, link }) => { 
  title = decodeHTML(title)
  content = decodeHTML(content)
  const parsedContent = parse(content)

  return ( 
    <div className='mx-1 my-4 md:mx-[10%]'>
      <h4 className='text-lg font-semibold'>
        {title}
      </h4>
      <hr className='mx-2 my-2'/>
      <div className='news-content page-content text-xs my-1 leading-relaxed'>
        {parsedContent}
      </div>
    </div>
  )
}

export const Newspage = ({ title }) => {
    const newsConfig = useNewsConfig()
    const newsPiece = newsConfig.find(piece => piece.title === title)

    const {data: news, isLoading, isError } = useQuery({
        queryKey: ["news"],
        queryFn: () => getNews()
    })

    if(isLoading) {
        return <div>Loading</div>
    }

    if(isError) {
        return <div>Errored Out</div>
    }

    const articles = news ? news[newsPiece.key] : []
   
  return (
    <>
      <Nav />
      <h3 className='text-3xl text-center my-2'>
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
