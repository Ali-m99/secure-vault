// Managing user authentication state
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserAuth = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state

  // Check if a user is already logged in (e.g., from localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, code) => {
    try {
      const totpResponse = await fetch('/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({code, email}).toString(),
      });

      const totpData = await totpResponse.text();

      if(totpData === "success") {
        const response = await fetch('/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({email, password}).toString(),
        });
  
        const data = await response.json();
  
        if (data.status === 'success') {
          const userData = { email, isPersonalAccount: data.isPersonalAccount, userId: data.userId,  firstName: data.firstName}; // Add more fields
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
          localStorage.setItem('masterPassword', password); // Stores user's masterPassword
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error(totpData.message);
      }

    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user data
    localStorage.removeItem('masterPassword'); // Clear password
  };

  return (
    <UserAuth.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserAuth.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(UserAuth);
};