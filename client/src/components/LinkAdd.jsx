import React from "react";
import Modal from "react-modal";
import { useUserAuth } from "../config/UserAuthContext";
import { addRSSFeed } from "../services/articles"
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useContentConfig } from "../config/ContentContext";

export const LinkAdd = ({ open, setOpen, links, contentType }) => {
  const { user } = useUserAuth()
  const { newsConfig, articleConfig, setNewsConfig, setArticleConfig } = useContentConfig()
  const closeModal = () => setOpen(false);
 
  const addLink = async(link, name) => {
    if(!user) throw new Error("No user logged in")
    const userFeedsRef = collection(db, `users/${user.uid}/${contentType}`)
   
    try {
      await addDoc(userFeedsRef, {
        key: name,
        value: link
      })
      console.log("Sent to firestore successfully")
 
      const feedDetails = {
          user: user.uid,
          rssUrl: link,
          rssUrlKey: name,
          contentType: contentType
      }
      await addRSSFeed(feedDetails)
      console.log(`Added ${contentType} RSS Feed`);
      
      // Update the appropriate config based on contentType
      if (contentType === 'news') {
        setNewsConfig(prevConfig => {
          if (!prevConfig.some(feed => feed.key === name)) {
            return [...prevConfig, { key: name, title: name }];
          }
          return prevConfig;
        });
      } else if (contentType === 'articles') {
        setArticleConfig(prevConfig => {
          if (!prevConfig.some(feed => feed.key === name)) {
            return [...prevConfig, { key: name, title: name }];
          }
          return prevConfig;
        });
      }
      
      closeModal()
    } catch (error) {
      console.log(`Error adding ${contentType} link:`, error);
    }
  }

  return (
    <div className="">
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        contentLabel="Add RSS Feed"
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
        }}
        className="link-modal"
      >
        <ul className="m-6">
            {links.map((link, index) => (
                <li key={index + 1} className="my-2">
                    <button onClick={() => addLink(link.link, link.name)} className="bg-gray-300 p-2 rounded-md">
                        {link.name}
                    </button>
                </li>
            ))}
        </ul>
      </Modal>
    </div>
  );
};