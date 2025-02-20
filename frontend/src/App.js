
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './User/UserState'; // Import AuthProvider
import LoginPage from './Components/pages/auth/LoginPage';
import SignupPage from './Components/pages/auth/SignupPage'; // Import SignupPage
// import DashboardPage from './Components/pages/DashboardPage'; // Import DashboardPage
// import BusinessDashboardPage from './Components/pages/business/BusinessDashboardPage'; // Import BusinessDashboardPage
// import PersonalDashboardPage from './Components/pages/personal/PersonalDashboardPage'; // Import PersonalDashboardPage
import './App.css';

function App() {
  return (
    
      <Router> {/* Set up routing */}
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Default route */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page */}
          <Route path="/register" element={<SignupPage />} /> {/* Signup page */}
          
        </Routes>
      </Router>
    
  );
}

export default App;