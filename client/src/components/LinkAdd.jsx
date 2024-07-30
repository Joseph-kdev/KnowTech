import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useUserAuth } from "../config/UserAuthContext";
import { addRSSFeed, getFeeds } from "../services/articles"
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useContentConfig } from "../config/ContentContext";

export const LinkAdd = ({ open, setOpen, links, contentType }) => {
  const { user } = useUserAuth()
  const { newsConfig, articleConfig, setNewsConfig, setArticleConfig } = useContentConfig()
  const closeModal = () => setOpen(false);
  const [addedLinks, setAddedLinks] = useState({});
 
  useEffect(() => {
    const checkLinks = () => {
      const allConfigs = [...newsConfig, ...articleConfig];
      const newAddedLinks = {};
      links.forEach(link => {
        newAddedLinks[link.name] = allConfigs.some(config => 
          config.title.toLowerCase() === link.name.toLowerCase()
        );
      });
      setAddedLinks(newAddedLinks);
    }
    checkLinks();
  }, [links, newsConfig, articleConfig])
  
  const addLink = async(link, name) => {
    if(!user) throw new Error("No user logged in")

    try {
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
        await getFeeds("news")
      } else if (contentType === 'articles') {
        setArticleConfig(prevConfig => {
          if (!prevConfig.some(feed => feed.key === name)) {
            return [...prevConfig, { key: name, title: name }];
          }
          return prevConfig;
        });
      }
      
      setAddedLinks(prev => ({ ...prev, [name]: true }));
      closeModal()
    } catch (error) {
      console.log(`Error adding ${contentType} link:`, error);
    }
  }

  const removeLink = async(name) => {
    if(!user) throw new Error("No user logged in")

    const userFeedsRef = collection(db, `users/${user.uid}/${contentType}`)

    try {
      const querySnapshot = await getDocs(userFeedsRef);
      const docToDelete = querySnapshot.docs.find(doc => doc.data().key === name);
      if(docToDelete) {
        await deleteDoc(docToDelete.ref)
        console.log(`Removed ${contentType} RSS Feed`);
      }

      if(contentType === 'news') {
        setNewsConfig(prevConfig => prevConfig.filter(feed => feed.key !== name));
      } else if(contentType === 'articles') {
        setArticleConfig(prevConfig => prevConfig.filter(feed => feed.key !== name));
      } else {
        console.log(`No ${contentType} config found`);
      }
      
      setAddedLinks(prev => ({ ...prev, [name]: false }));

      closeModal()
    } catch (error) {
      console.error(`Error removing ${contentType} link:`, error);
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
        <h2 className="m-4 text-heading font-bold text-text">
          Select link:
        </h2>
        <ul className="m-4">
            {links.map((link, index) => (
                <li key={index + 1} className="my-2">
                    <button 
                      onClick={addedLinks[link.name] ? () => removeLink(link.name) : () => addLink(link.link, link.name)} 
                      className={addedLinks[link.name] ? "bg-red-500 p-2 rounded-md" : "bg-accent p-2 rounded-md"}
                    >
                        {link.name}
                    </button>
                </li>
            ))}
        </ul>
        <div className="absolute bottom-2 left-4">
          <p className="text-secondary text-sm">**This feature is still in development**</p>
        </div>
      </Modal>
    </div>
  );
};