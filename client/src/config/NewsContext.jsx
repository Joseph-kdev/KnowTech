import React, { createContext, useContext } from 'react';

export const NewsConfigContext = createContext();

export const useNewsConfig = () => {
  return useContext(NewsConfigContext);
};

export const NewsConfigProvider = ({ children, newsConfig }) => {
  return (
    <NewsConfigContext.Provider value={newsConfig}>
      {children}
    </NewsConfigContext.Provider>
  );
};
