import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserAuth } from './UserAuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

export const ContentConfigContext = createContext();

export const useContentConfig = () => {
  return useContext(ContentConfigContext);
};

export const ContentConfigProvider = ({ children, newsConfig: initialNewsConfig, articleConfig: initialArticleConfig }) => {
  const [newsConfig, setNewsConfig] = useState(initialNewsConfig);
  const [articleConfig, setArticleConfig] = useState(initialArticleConfig);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchUserContent = async (contentType, setConfig) => {
      if (user) {
        const userContentRef = collection(db, `users/${user.uid}/${contentType}`);
        const userContentSnapshot = await getDocs(userContentRef);
        const userContent = userContentSnapshot.docs.map(doc => ({
          key: doc.data().key,
          title: doc.data().key
        }));
        setConfig(prevConfig => [...prevConfig, ...userContent]);
      }
    };

    fetchUserContent('news', setNewsConfig);
    fetchUserContent('articles', setArticleConfig);
  }, [user]);

  return (
    <ContentConfigContext.Provider value={{ 
      newsConfig, 
      setNewsConfig, 
      articleConfig, 
      setArticleConfig 
    }}>
      {children}
    </ContentConfigContext.Provider>
  );
};