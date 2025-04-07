// This file is for storing the user's master password in memory as opposed to in session or local
// storage, which is insecure. Look at index.js file to see where this component is called
import React, { createContext, useContext, useState, useEffect } from 'react';

const MasterPasswordContext = createContext();

export const MasterPasswordProvider = ({ children }) => {
  const [masterPassword, setMasterPassword] = useState(null); // Store the in-memory master password
  const [wasSetOnce, setWasSetOnce] = useState(false);

  useEffect(() => {
    // Track if we've ever set a master password during this session
    const flag = sessionStorage.getItem('wasMasterPasswordSet');
    if (flag === 'true') {
      setWasSetOnce(true);
    }
  }, []);

  useEffect(() => {
    if (masterPassword && !wasSetOnce) {
      sessionStorage.setItem('wasMasterPasswordSet', 'true');
      setWasSetOnce(true);
    }
  }, [masterPassword, wasSetOnce]);

  return (
    <MasterPasswordContext.Provider value={{ masterPassword, setMasterPassword, wasSetOnce }}>
      {children}
    </MasterPasswordContext.Provider>
  );
};

export const useMasterPassword = () => {
  const context = useContext(MasterPasswordContext);
  if (!context) {
    throw new Error("useMasterPassword must be used within a MasterPasswordProvider");
  }
  return context;
};