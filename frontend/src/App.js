import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/pages/auth/LoginPage";
import SignupPage from "./Components/pages/auth/SignupPage";
import PersonalDashboard from "./Components/pages/personal/PersonalDashboard";
import PersonalFiles from "./Components/pages/personal/PersonalFiles"; // Import Files page
import PersonalVault from "./Components/pages/personal/PersonalVault"; // Import Vault page
import PersonalSettings from "./Components/pages/personal/PersonalSettings"; // Import Settings page
import PersonalLayout from "./Components/personaldisplay/PersonalLayout"; // Import the layout component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page */}
        <Route path="/register" element={<SignupPage />} /> {/* Signup page */}

        {/* Private Routes (With Navbar) */}
        <Route
          path="/user/personaldashboard"
          element={
            <PersonalLayout>
              <PersonalDashboard />
            </PersonalLayout>
          }
        />
        <Route
          path="/user/files"
          element={
            <PersonalLayout>
              <PersonalFiles />
            </PersonalLayout>
          }
        />
        <Route
          path="/user/passwords"
          element={
            <PersonalLayout>
              <PersonalVault />
            </PersonalLayout>
          }
        />
        <Route
          path="/user/settings"
          element={
            <PersonalLayout>
              <PersonalSettings />
            </PersonalLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;