import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getNews } from '../services/articles'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"

const NewsPiece = ({ title, link, content, author, pubDate }) => {
    title = decodeHTML(title)
    content = decodeHTML(content)
    const parsedContent = parse(content)

    return (
        <>
            <div>
                <a href={link}>
                    <h2>
                        {title}
                    </h2>
                </a>
            </div>
        </>
    )
}
const Newslist = ({ pieces, newsTitle }) => {
    const [showAll, setShowAll] = useState(false)

    return (
        <div>
            <h1 className='text-center font-mono text-3xl py-4'>
                {newsTitle}
            </h1>
            <div>
            {pieces.slice(0, 5).map((piece) => (
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
                pieces.slice(6).map((piece) => (
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
        { key: "hackerNews", title: "Hacker News" },
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
    <div>
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
