import React, { useReducer, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { reducer } from "../config/reducer";
import { decodeHTML } from "entities";
import parse from "html-react-parser";
import { useContentConfig } from "../config/ContentContext";
import { useQuery } from "@tanstack/react-query";
import { getFeeds } from "../services/articles";
import { useUserAuth } from "../config/UserAuthContext";
import { LinkAdd } from "./LinkAdd"
import { parseISO, parse as dateParse, format } from 'date-fns';

export const formatPublicationDate = (dateString) => {
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

const Feed = ({ title, content, link, pubDate, summarize }) => {
  title = decodeHTML(title);
  content = decodeHTML(content);
  const parsedContent = parse(content);
  const formattedDate = formatPublicationDate(pubDate)

  return (
    <div className="flex flex-col my-2 bg-background px-1 py-2 mx-1">
      <a href={link}>
        <h3 className="text-text text-lg hover:text-secondary mb-2">{title}</h3>
      </a>
      <p className="text-xs text-gray-500 leading-relaxed">
        {parsedContent}
      </p>
      <p className="text-xs my-4 text-text">Posted: {formattedDate}</p>
      <div
        className="flex justify-between text-accent "
        onClick={() => summarize(link)}
      >
        <div className="flex items-center cursor-pointer hover:text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
        </svg>
        <p className="ml-2 text-sm">Summary</p>
        </div>
        <a href={link}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </a>
      </div>
    </div>
  );
};

export const Feedlist = ({ articles, blogTitle }) => {
  const [state, dispatch] = useReducer(reducer, {
    showAll: false,
    open: false,
    blogSummary: "",
  });

  const toggleShowAll = () => {
    dispatch({
      type: "show-all",
    });
  };

  const closeModal = () => {
    dispatch({
      type: "open-modal",
    });
  };

  const summarize = async (url) => {
    dispatch({
      type: "open-modal",
    });
    const selectedUrl = {
      actualUrl: url,
    };
    try {
      const response = await axios.post(
        'https://know-production.up.railway.app/api/summaries',
        selectedUrl
      );
      const summary = await response.data;
      dispatch({
        type: "summary",
        payload: summary,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-primary">
      <Modal

      // Extract the summary from the response data
        isOpen={state.open}

      // Dispatch an action with the summary to update the state
        onRequestClose={closeModal}
        contentLabel="Summary"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={{
      // Log any errors to the console
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
        }}
        className="summary-modal"
      >
        <h1 className="text-center my-3 text-xl text-primary">
          AI Summary
        </h1>
        <hr className="mb-2" />
        <ReactMarkdown className="text-gray-800 text-sm leading-relaxed">
          {state.blogSummary}
        </ReactMarkdown>
        <div className="mt-3 text-primary absolute bottom-4">
          Powered by
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 inline-block mx-2 hover:text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          Gemini AI
        </div>
      </Modal>
      <h2 className="font-subheading text-2xl py-4 px-1 text-text bg-background md:pl-5">
        {blogTitle}
      </h2>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((article, index) => (
          <div key={index}>
            <Feed
              title={article.title}
              content={article.content}
              pubDate={article.pubDate}
              link={article.link}
              summarize={summarize}
            />
          </div>
        ))}
        {state.showAll &&
          articles.slice(6).map((article, index) => (
            <div key={`remaining-${index}`}>
              <Feed
                title={article.title}
                content={article.content}
                pubDate={article.pubDate}
                link={article.link}
                summarize={summarize}
              />
            </div>
          ))}
      </div>
      <div className='w-full flex justify-center'>
                <button onClick={toggleShowAll} className='bg-gray-700 hover:bg-gray-500 text-white font-bold my-3 h-8 w-full flex justify-center items-center md:w-[100px] rounded'>
                    {state.showAll ? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-center">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                    }
                </button>
            </div>
    </div>
  );
};

export const ArticleFeed = () => {
  const {user} = useUserAuth()
  const [open, setOpen] = useState(false)
  const { articleConfig } = useContentConfig();
  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getFeeds("articles", user.uid),
    initialData: articleConfig,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Errored out</div>;
  }

  const addRSSFeed = () => {
    if(!user) {
        alert("Please log in to add RSS feeds")
    }
    
    setOpen(true)
}
const links = [
  {
      name: "OpenReplay",
      link: "https://blog.openreplay.com/rss.xml"
  },
  {
      name: "SitePoint",
      link: "https://www.sitepoint.com/sitepoint.rss"
  },
  
]

  return (
    <>
          <div className='relative bg-primary'>
            <div>
                <LinkAdd open={open} setOpen={setOpen} links={links} contentType="articles"/>
            </div>
            <h1 className='text-center text-4xl py-4 bg-secondary font-heading'>
               Articles
            </h1>
            <div className='absolute top-5 right-3' onClick={addRSSFeed}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>
        </div>
      {articleConfig.map(({ key, title }) => (
        <Feedlist key={key} articles={articles[key] || []} blogTitle={title} />
      ))}
    </>
  );
};
