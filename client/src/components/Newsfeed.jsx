import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getFeeds } from "../services/articles";
import { decodeHTML } from "entities";
import parse from "html-react-parser";
import { useContentConfig } from "../config/ContentContext";
import { useUserAuth } from "../config/UserAuthContext";
import { LinkAdd } from "./LinkAdd";
import { formatPublicationDate } from "./Feedlist";
import { AiChat } from "./AiChat";
import { FadeLoader } from "react-spinners"

const NewsPiece = ({ title, link, content, author, pubDate }) => {
  const { user } = useUserAuth();
  const [launch, setLaunch] = useState(false);

  const updateLaunch = () => {
    setLaunch((prev) => !prev);
  };

  title = decodeHTML(title);
  content = decodeHTML(content);
  const parsedContent = parse(content);
  const formattedDate = formatPublicationDate(pubDate);

  return (
    <>
      {launch && (
        <AiChat
          user={user.uid}
          title={title}
          author={author}
          link={link}
          launch={launch}
        />
      )}
      <div className="p-2 bg-primary text-text mb-2">
        <div>
          <h2 className="text-lg hover:text-secondary">
            <a href={link}>{title}</a>
          </h2>
          <hr className="my-1" />
          <div>
            <p className="text-xs">
              By {author} on {formattedDate}.
            </p>
          </div>
          <div className="news-content text-xs my-1 leading-relaxed text-gray-500">
            {parsedContent}
          </div>
        </div>
        <div className="flex justify-between mx-1 my-2 text-accent">
          <div onClick={updateLaunch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer hover:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </div>
          <div>
            <a href={link}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const Newslist = ({ pieces, newsTitle }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="mt-1 md:h-screen md:overflow-scroll scrollbar-thin scrollbar-track-gray-700 mx-1">
      <h1 className="font-mono text-2xl py-4 text-subheading bg-secondary px-1">
        {newsTitle}
      </h1>
      <div>
        {pieces.slice(0, 4).map((piece) => (
          <div key={piece.title}>
            <NewsPiece
              title={piece.title}
              link={piece.link}
              content={piece.content ? piece.content : ""}
              author={
                piece.author || piece.creator
                  ? piece.author || piece.creator
                  : "Unknown"
              }
              pubDate={piece.pubDate}
            />
          </div>
        ))}
        {showAll &&
          pieces.slice(5).map((piece) => (
            <div key={piece.title}>
              <NewsPiece
                title={piece.title}
                link={piece.link}
                content={piece.content ? piece.content : ""}
                author={
                  piece.author || piece.creator
                    ? piece.author || piece.creator
                    : "Unknown"
                }
                pubDate={piece.pubDate}
              />
            </div>
          ))}
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-accent hover:bg-gray-500 text-white font-bold mx-6 my-3 h-8 w-full flex justify-center items-center"
        >
          {showAll ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 18.75 7.5-7.5 7.5 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
export const Newsfeed = () => {
  const { newsConfig } = useContentConfig();
  const { user } = useUserAuth();
  const [open, setOpen] = useState(false);

  const {
    data: news,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => getFeeds("news", user.uid),
    initialData: newsConfig,
  });

  if (isLoading) {
    return <div className="h-screen">
            <FadeLoader />
           </div>;
  }

  if (isError) {
    return <div className="h-screen">
    <img src="error.svg" alt="" className="h-[60vh]"/>
  </div>;
  }

  const addRSSFeed = () => {
    if (!user) {
      alert("Please log in to add RSS feeds");
    }
    setOpen(true);
  };

  const links = [
    {
      name: "LifeHacker",
      link: "https://lifehacker.com/feed/rss",
    },
    {
      name: "Ars Technica",
      link: "http://feeds.arstechnica.com/arstechnica/index",
    },
    {
      name: "Mashable",
      link: "https://mashable.com/feeds/rss/all",
    },
  ];

  return (
    <div className="">
      <div className="relative">
        <div>
          <LinkAdd
            open={open}
            setOpen={setOpen}
            links={links}
            contentType="news"
          />
        </div>
        <h1 className="text-center font-heading text-4xl py-4 bg-background text-text">
          News feed
        </h1>
        <div className="absolute top-5 right-3" onClick={addRSSFeed}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-text"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>
      <div className=" md:grid md:grid-cols-3 gap-1 md:h-screen overflow-scroll">
        {newsConfig.map(({ key, title }) => (
          <Newslist key={key} pieces={news[key] || []} newsTitle={title} />
        ))}
      </div>
    </div>
  );
};
