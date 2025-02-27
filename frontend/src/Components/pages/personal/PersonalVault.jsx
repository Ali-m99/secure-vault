import React from "react";

const PersonalVault = () => {
  return (
    <div className="p-8 py-24">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Vault</h1>

      {/* Create and Delete Passwords Vault Buttons */}
      <div className="flex space-x-2 md:space-x-10 py-4 " >
      <button className=" relative overflow-hidden mt-4 p-2 bg-black/10 rounded-tl-lg text-white border-2 border-green-400 transition-all duration-300 group">
          <span className="relative z-10 text-sm md:text-lg ">Create Password Vault</span>
          <span className=" absolute  inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
        </button>
        <button className=" relative overflow-hidden mt-4 p-2 bg-black/10 rounded-tr-lg text-white border-2 border-green-400 transition-all duration-300 group">
          <span className="relative z-10 text-sm md:text-lg">Delete Password Vault</span>
          <span className=" absolute  inset-y-0 left-full w-0 bg-green-700 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
        </button>
      </div>

      {/* Dislay Vault Names with Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10">
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Vault Name 1 </h2>
          <ul className="text-gray-300">
            <li>Google - john.doe@gmail.com</li>
            <li>GitHub - john_doe</li>
            <li>Netflix - john.doe@example.com</li>
          </ul>
          <button className="mt-4 p-2 bg-green-700 rounded hover:bg-green-800 transition-colors">
          Add New Password
          </button>
      </div>

      <div className="bg-gradient-to-br from-black/90 via-black/5 to-black p-6 rounded-lg border-4 border-green-700">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Your Passwords</h2>
        <ul className="text-gray-300">
          <li>Google - john.doe@gmail.com</li>
          <li>GitHub - john_doe</li>
          <li>Netflix - john.doe@example.com</li>
        </ul>
        <button className="mt-4 p-2 bg-green-700 rounded hover:bg-green-800 transition-colors">
          Add New Password
        </button>
      </div>



      </div>
      
    </div>
  );
};

export default PersonalVault;