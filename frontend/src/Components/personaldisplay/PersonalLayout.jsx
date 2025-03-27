import React from "react";
import Navbar from "../pages/personal/Navbar";

const PersonalLayout = ({ children }) => {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-bl from-black/90 via-black/85 to-black/90">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PersonalLayout;

