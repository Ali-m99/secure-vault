import React from "react";
import Navbar from "../pages/personal/Navbar";

// Wrap children so all items can display when user is logged in, navbar on right and children of navigation bar on right
const PersonalLayout = ({ children }) => {
  return (
    <div className="flex ">
      <Navbar />
      <main className="flex-grow min-h-screen p-8 bg-gradient-to-bl from-black/90 via-black/85 to-black/90">{children}</main>
    </div>
  );
};

export default PersonalLayout;