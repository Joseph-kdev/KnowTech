import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getNews } from '../services/articles'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"
import { parseISO, parse as dateParse, format } from 'date-fns';

const NewsPiece = ({ title, link, content, author, pubDate }) => {

    const formatPublicationDate = (dateString) => {
        let date;
        
        // Try parsing as ISO date
        date = parseISO(dateString);
        
        // If parsing as ISO fails, try parsing as RFC 2822
        if (isNaN(date.getTime())) {
          date = dateParse(dateString, 'EEE, dd MMM yyyy HH:mm:ss xxxx', new Date());
        }
        
        // If both parsing attempts fail, return the original string
        if (isNaN(date.getTime())) {
          console.warn(`Unable to parse date: ${dateString}`);
          return dateString;
        }
        
        // Format the date
        return format(date, 'MMMM d, yyyy h:mm a');
      };

    title = decodeHTML(title)
    content = decodeHTML(content)
    const parsedContent = parse(content)
    const formattedDate = formatPublicationDate(pubDate);

    return (
        <>
            <div className='bg-blue-800 my-2 p-2'>
                <div>
                    <h2 className='text-lg'>
                        <a href={link}>
                            {title}
                        </a>
                    </h2>
                    <hr className='my-1'/>
                    <div>
                        <p className='text-xs'>
                            By {author} on {formattedDate}.
                        </p>
                    </div>
                    <div className='news-content text-xs my-1 leading-relaxed'>
                        {parsedContent}
                    </div>
                </div>
                <div>
                    <a href={link}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </>
    )
}
const Newslist = ({ pieces, newsTitle }) => {
    const [showAll, setShowAll] = useState(false)

    return (
        <div>
            <h1 className='font-mono text-2xl py-4'>
                {newsTitle}
            </h1>
            <div>
            {pieces.slice(0, 4).map((piece) => (
                <div key = {piece.title}>                    
                    <NewsPiece
                        title = {piece.title}
                        link = {piece.link}
                        content = {piece.content ? piece.content : ""}
                        author = {piece.author || piece.creator ? piece.author || piece.creator : "Unknown"}
                        pubDate = {piece.pubDate}
                    />
                </div>
            ))}
            {showAll && 
                pieces.slice(5).map((piece) => (
                    <div key = {piece.title}>                    
                    <NewsPiece
                        title = {piece.title}
                        link = {piece.link}
                        content = {piece.content ? piece.content : ""}
                        author = {piece.author || piece.creator ? piece.author || piece.creator : "Unknown"}
                        pubDate = {piece.pubDate}
                    />
                </div>
                ))}
            </div>
            <button onClick={() => setShowAll(!showAll)}>
                {showAll ? "Less" : "More"}
            </button>
        </div>
    )
}
export const Newsfeed = () => {
    const newsConfig = [
        { key: "theVerge", title: "The Verge" },
        { key: "techCrunch", title: "TechCrunch" },
        { key: "hackerNews", title: "The Hacker News" },
    ]

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

  return (
    <div className='px-2'>
        <div>
            <h1 className='text-center font-roboto text-3xl py-4'>
                News feed
            </h1>
        </div>
        {newsConfig.map(({ key, title }) => (
            <Newslist
                key = {key}
                pieces = {news[key] || []}
                newsTitle = {title}
            />
        ))}
    </div>
  )
}
