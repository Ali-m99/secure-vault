// Managing user authentication state
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMasterPassword } from './MasterPasswordContext';

// Create the context
const UserAuth = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state
  const { setMasterPassword } = useMasterPassword(); // Allows storage of master password in memory

  // Check if a user is already logged in (e.g., from sessionStorage)
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
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
        console.log('Login API Response:', data); // Moved inside the function

        if (data.status === 'success') {
          const userData = { 
            email,
            userId: data.userId,  
            firstName: data.firstName, 
            lastName: data.lastName 
          };
          console.log('User data being stored:', userData); // Debug log
          
          setUser(userData);
          sessionStorage.setItem('user', JSON.stringify(userData));
          setMasterPassword(password); // Stores master password in memory
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error(totpData.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed: ' + error.message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
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