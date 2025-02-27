
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for logout

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage navbar open/close
  const [selectedTab, setSelectedTab] = useState("Dashboard"); // State to manage selected tab
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Effect to handle initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Open navbar by default on large screens
      } else {
        setIsOpen(false); // Close navbar by default on small screens
      }
    };

    // Set initial state on component mount
    handleResize();

    // Update state on window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Clear authentication state
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* Toggle Button for All Screens */}
      <button
        className={`fixed top-4 left-4 p-2 bg-green-800 text-white rounded z-50 lg:hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "×" : "☰"} {/* Toggle between hamburger and close icon */}
      </button>

      {/* Navbar */}
      <nav
        className={`fixed lg:relative flex flex-col h-screen w-64 md:w-96 bg-gradient-to-b from-black/90 via-green-800/90 to-black backdrop-blur-xl text-white p-4 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        {/* Close Button for Large Screens */}
        <button
          className="hidden lg:block self-end text-xl mb-4 hover:text-gray-400"
          onClick={() => setIsOpen(false)}
        >
          × {/* Close icon */}
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center py-6">
          <h1 className="text-3xl text-green-500 font-bold">SecureVault</h1>
        </div>

        {/* User Info Section */}
        <div className="flex items-center mb-24">
          <p className="text-lg font-semibold">John Doe</p>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-4 flex-grow">
          {[
            { name: "Dashboard", path: "/user/personaldashboard" },
            { name: "Files", path: "/user/files" },
            { name: "Vault", path: "/user/vault" },
            { name: "Settings", path: "/user/settings" },
          ].map((tab) => (
            <li key={tab.name}>
              <Link
                to={tab.path} // Use "to" instead of "href"
                className={`flex items-center p-2 rounded transition-colors ${
                  selectedTab === tab.name
                    ? "bg-green-700 border-2 border-black" // Active tab style
                    : "hover:bg-black/30 hover:border-2 border-green-700" // Inactive tab hover style
                }`}
                onClick={() => setSelectedTab(tab.name)}
              >
                <p>{tab.name}</p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto text-center">
          <button
            onClick={handleLogout} // Use onClick for logout functionality
            className="relative flex w-full justify-center  p-2 rounded bg-white/10 border-2 border-gray-500 hover:border-gray-200 hover:bg-green-700  overflow-hidden group transition-colors duration-1000 "
          >
            <p className=" relative z-10">Logout</p>

            <span className=" absolute inset-y-0 left-1/2 w-0 bg-green-500 transiton-all duration-700 group-hover:left-0 group-hover:w-1/2"></span>
            <span className=" absolute inset-y-0 right-1/2 w-0 bg-green-500 transition-all duration-700 group-hover:right-0 group-hover:w-1/2"> </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;