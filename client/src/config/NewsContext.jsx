import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../config/UserAuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

export const NewsConfigContext = createContext();

export const useNewsConfig = () => {
  return useContext(NewsConfigContext);
};

export const NewsConfigProvider = ({ children, newsConfig: initialConfig }) => {
  const [newsConfig, setNewsConfig] = useState(initialConfig);
  const {user} = useUserAuth()

  useEffect(() => {
    const fetchUserFeeds = async() => {
      if(user) {
        const userFeedsRef = collection(db, `users/${user.uid}/news`)
        const userFeedsSnapshot = await getDocs(userFeedsRef)
        const userFeeds = userFeedsSnapshot.docs.map(doc => ({
          key: doc.data().key,
          title: doc.data().key
        }))
        setNewsConfig([...initialConfig, ...userFeeds])
      } else {
        setNewsConfig(initialConfig)
      }
    }

    fetchUserFeeds()
  }, [user, initialConfig])
 
  return (
    <NewsConfigContext.Provider value={{newsConfig, setNewsConfig}}>
      {children}
    </NewsConfigContext.Provider>
  );
};
