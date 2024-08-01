import React, { useEffect, useState } from 'react'
import { getFeeds } from '../services/articles'
import { useQuery } from "@tanstack/react-query"
import { useContentConfig } from '../config/ContentContext'
import { decodeHTML } from 'entities'
import parse from "html-react-parser"
import { Nav } from './Nav'
import { useUserAuth } from '../config/UserAuthContext'
import { formatPublicationDate } from './Feedlist'
import { AiChat } from './AiChat'
import { db } from '../config/firebase-config'
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { DotLoader } from 'react-spinners'

const PageItem = ({ title, content, author, pubDate, link, blogTitle }) => { 
  title = decodeHTML(title)
  content = decodeHTML(content)
  const parsedContent = parse(content)
  const date = formatPublicationDate(pubDate)

  const { user } = useUserAuth();
  const [launch, setLaunch] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    if (user) {
      checkIfBookmarked();
    } else {
      setIsBookmarked(false)
      setBookmarkId(null)
    }
  }, [user]);

  const checkIfBookmarked = async () => {
    const bookmarksQuery = query(collection(db, `users/${user.uid}/bookmarks`), where('link', '==', link));
    const bookmarkSnapshot = await getDocs(bookmarksQuery);

    if (!bookmarkSnapshot.empty) {
      const bookmarkDoc = bookmarkSnapshot.docs[0];
      setIsBookmarked(true);
      setBookmarkId(bookmarkDoc.id);
    }
  };

  const toggleBookmark = async () => {
    console.log("Toggle bookmark called");
    if (!user) {
      console.log("No user logged in");
      return;
    }

    try {
      if (isBookmarked) {
        console.log("Attempting to remove bookmark");
        await deleteDoc(doc(db, `users/${user.uid}/bookmarks`, bookmarkId));
        console.log("Bookmark removed successfully");
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {

        const bookmarkData = {
          title: title || '',
          link: link || '',
          date: date || '',
          author: author || '',
          blogTitle: blogTitle || '',
        };

        console.log("Attempting to add bookmark");
        const bookMarkRef = await collection(db, `users/${user.uid}/bookmarks`);
        const docRef = await addDoc(bookMarkRef, bookmarkData);
        setIsBookmarked(true);
        setBookmarkId(docRef.id);
        console.log("Bookmark added successfully, new ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error in toggleBookmark:", error);
    }
  };

  return ( 
    <>
    {
    launch 
      && 
    <AiChat user={user.uid} title={title} author={author} link={link} launch={launch} />
    }
      <div className='mx-1 my-4 md:mx-[20%] bg-primary'>
        <h4 className='text-lg font-semibold bg-secondary p-1 hover:text-gray-700 md:text-center'>
          <a href={link} target="_blank">
            {title}
          </a>
        </h4>
        <div className='p-1 text-xs text-gray-500 md:px-3'>
          <p>
            Published: {date}
          </p>
        </div>
        <div className='page-content text-xs my-1 leading-relaxed p-1 text-gray-400 md:px-3'>
          {parsedContent}
        </div>
        <div className='flex justify-between md:justify-start md:ml-2'>
          <div onClick={toggleBookmark}>
          <svg xmlns="http://www.w3.org/2000/svg" fill={isBookmarked? "#59C1EA" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-accent mb-2 mx-1 hover:text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          </div>
        <div onClick={() => setLaunch(!launch)}>
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
        return <div className="h-screen">
          <DotLoader />
        </div>
    }

    if(isError) {
        return <div className="h-screen">
        <img src="error.svg" alt="" className="h-[60vh]"/>
      </div>
    }

    const articles = feed ? feed[feedPiece.key] : []
    console.log(JSON.stringify(feed));

  return (
    <>
      <Nav />
      <h3 className='text-3xl text-center my-2 text-text font-heading'>
        {title}
      </h3>
      <div>
        { feed ? ( articles.map(article => (
          <div key={article.title}>
            <PageItem
            blogTitle={title}
              title={article.title}
              content={article.content}
              link={article.link}
              author={article.author}
              pubDate={article.pubDate}
            />
          </div>
        )) ) : 
        <div className="h-screen">
          <img src="error.svg" alt="" className="h-[60vh]"/>
        </div>
        }
      </div>
    </>
  )
}
