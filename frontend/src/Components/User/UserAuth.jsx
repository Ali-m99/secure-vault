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
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const userData = { email, isPersonalAccount: data.isPersonalAccount }; // Add more fields
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user data
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