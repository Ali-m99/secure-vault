import React, { useState, useEffect } from "react";
import SettingsIcon from "../../assets/settings-icon.png";
import DashboardIcon from "../../assets/home-icon.png";
import FilesIcon from "../../assets/file-icon.png";
import PasswordIcon from "../../assets/password-icon.png";
import ProfileIcon from "../../assets/user.png"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../User/UserAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth();

  // Set active tab based on current route
  useEffect(() => {
    const pathToTab = {
      "/user/personaldashboard": "Dashboard",
      "/user/files": "Files",
      "/user/passwords": "Passwords",
      "/user/settings": "Settings"
    };
    setSelectedTab(pathToTab[location.pathname] || "Dashboard");
  }, [location.pathname]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const iconMapping = {
    Dashboard: DashboardIcon,
    Files: FilesIcon,
    Passwords: PasswordIcon,
    Settings: SettingsIcon,
  };

  return (
    <>
      {/* Toggle Button - Always visible on mobile, hidden on desktop */}
      <button
        className={`fixed top-4 left-4 p-2 bg-green-800 text-white rounded z-50 lg:hidden`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {/* Navbar */}
      <nav className={`fixed lg:static flex flex-col h-[100dvh] w-64 xl:w-96 bg-gradient-to-b from-black/90 via-green-800/90 to-black text-white p-4 transform transition-transform duration-300 ease-in-out ${
  isOpen ? "translate-x-0" : "-translate-x-full"
} lg:translate-x-0 z-40 overflow-y-auto scrollbar-hide`}>
      
        {/* Logo Section */}
        <div className="flex flex-col items-center mt-12 py-6">
          <h1 className="text-2xl md:text-3xl text-green-500 font-bold">SecureVault</h1>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col items-center py-3 md:py-8  mb-8 md:mb-24">
        <div className="w-24 h-24 rounded-full bg-black/10 border-2 border-green-400 flex items-center justify-center mb-3">
            <img 
              src={ProfileIcon}  
              alt="Profile" 
              className="w-10 h-10 xl:w-14 xl:h-14 object-cover"
            />
          </div>
          <p className="text-md md:text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-2 md:space-y-4 flex-grow">
          {[
            { name: "Dashboard", path: "/user/personaldashboard" },
            { name: "Files", path: "/user/files" },
            { name: "Passwords", path: "/user/passwords" },
            { name: "Settings", path: "/user/settings" },
          ].map((tab) => (
            <li key={tab.name}>
              <Link
                to={tab.path}
                className={`flex items-center p-2 rounded transition-colors ${
                  selectedTab === tab.name
                    ? "bg-green-700 border-2 border-green-300"
                    : "hover:bg-black/30 hover:border-2 border-green-700"
                }`}
              >
                <img
                  src={iconMapping[tab.name]}
                  alt={tab.name}
                  className={`w-6 h-6 xl:w-10 xl:h-10 mr-3 ${
                    selectedTab === tab.name ? "opacity-100" : "opacity-70"
                  }`}
                />
                <span className="text-sm xl:text-2xl md:text-base">{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto py-4">
          <button
            onClick={handleLogout}
            className="relative flex w-full justify-center p-2 rounded bg-white/10 border-2 border-gray-500 hover:border-gray-200 hover:bg-green-700 overflow-hidden group transition-colors duration-300"
          >
            <span className="relative z-10 text-sm md:text-base">Logout</span>
            <span className="absolute inset-y-0 left-1/2 w-0 bg-green-500 transition-all duration-300 group-hover:left-0 group-hover:w-1/2"></span>
            <span className="absolute inset-y-0 right-1/2 w-0 bg-green-500 transition-all duration-300 group-hover:right-0 group-hover:w-1/2"></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;