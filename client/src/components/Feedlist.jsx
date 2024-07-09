import React, { useReducer } from 'react'
import { Feed } from './Feed'
import axios from 'axios'
import Modal from "react-modal"
import ReactMarkdown from "react-markdown"
import { reducer } from '../config/reducer'


export const Feedlist = ({ articles, blogTitle }) => {
  const [state, dispatch] = useReducer(reducer, { showAll: false, open: false, blogSummary: "" })

  const toggleShowAll = () => {
    dispatch({
      type: "show-all"
    })
  }

  const closeModal = () => {
    dispatch({
      type: "open-modal"
    })
  }

  const summarize = async(url) => {
    dispatch({
      type: "open-modal"
    })
    const selectedUrl = {
      actualUrl : url
    }
    try {
      const response = await axios.post("http://localhost:3001/summaries", selectedUrl)
      const summary = await response.data
      dispatch({
        type: "summary",
        payload: summary
      })
    } catch (error) {
      console.error(error);
    }
  } 

  return (
    <div className='flex flex-col mx-1 overflow-hidden'>
      <Modal 
        isOpen={state.open}
        onRequestClose={closeModal}
        contentLabel='Summary'
        ariaHideApp= {false}
        shouldCloseOnOverlayClick={true}
        style={{
         overlay : {
            backgroundColor: "#4e4b4bf4",
         }
        }}
        className="summary-modal"
        >
          <h1 className='text-center my-3 text-lg'>
            Blogpost Summary
          </h1>
          <hr className='mb-2'/>
          <ReactMarkdown className="text-gray-700 text-sm leading-relaxed">
            {state.blogSummary}
          </ReactMarkdown>
          <hr className='mt-3'/>
          <div className='mt-3'>
            Powered by 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block mx-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            Gemini AI
            </div>

        </Modal>
      <h2 className='text-xl my-2 mx-1 w-screen'>
            {blogTitle}
      </h2>
      <hr className='my-1' />
      <div className='md:grid md:grid-cols-2 lg:grid-cols-3'>
    {articles.slice(0, 3).map((article, index) => (
      <div key={index}>
        <Feed
          title={article.title}
          content={article.content}
          pubDate={article.pubDate}
          link={article.link}
          summarize= {summarize}
        />
      </div>
    ))}
    {state.showAll &&
      articles.slice(4).map((article, index) => (
        <div key={`remaining-${index}`}>
          <Feed
            title={article.title}
            content={article.content}
            pubDate={article.pubDate}
            link={article.link}
            summarize = {summarize}
          />
        </div>
      ))}
      </div>
          <button onClick={toggleShowAll} className='text-sky-700 '>
            {state.showAll? "Show Less" : "Show More"}
          </button>
    </div>
  )
}
