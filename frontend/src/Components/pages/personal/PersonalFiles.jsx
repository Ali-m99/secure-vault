import React from "react";

const PersonalFiles = () => {
  return (
    <div className="p-6 py-24" >
      <h1 className="text-3xl text-green-600 font-bold mb-6">Files</h1>

      {/* Create and Delete Folders Button */}
      <div className="  flex space-x-2 md:space-x-10 py-4" >
      <button className=" relative overflow-hidden mt-4 p-2 bg-black/10 rounded-tl-lg text-white border-2 border-green-400 transition-all duration-300 group">
          <span className="relative z-10 text-sm md:text-lg">Create File Folder</span>
          <span className=" absolute  inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
        </button>
        <button className=" relative overflow-hidden mt-4 p-2 bg-black/10 rounded-tr-lg text-white border-2 border-green-400 transition-all duration-300 group">
          <span className="relative z-10 text-sm md:text-lg">Delete File Folder</span>
          <span className=" absolute  inset-y-0 left-full w-0 bg-green-700 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
        </button>
      </div>

      {/* Folders Diplay  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10">
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Folder 1</h2>
          <ul className="text-gray-300">
            <li>Document 1.pdf</li>
            <li>Document 2.docx</li>
            <li>Document 3.xlsx</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Folder 2</h2>
          <ul className="text-gray-300">
            <li>Document 1.pdf</li>
            <li>Document 2.docx</li>
            <li>Document 3.xlsx</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Folder 3</h2>
          <ul className="text-gray-300">
            <li>Document 1.pdf</li>
            <li>Document 2.docx</li>
            <li>Document 3.xlsx</li>
          </ul>
        </div>




      </div>
     
    </div>
  );
};

export default PersonalFiles;