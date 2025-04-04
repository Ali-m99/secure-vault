import React, { useState } from 'react';

const CreateFolder = ({ onFolderCreated, folder }) => {
  const [showForm, setShowForm] = useState(false);
  const [folderName, setFolderName] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Builds the folder path properly from an array
    // (i.e. from ["folder1", "folder2", "folder3"] to "folder1/folder2/folder3")
    // If the passed in folder path isn't an array or is empty, upload file to root
    let folderPath = "";
    if(Array.isArray(folder) && folder.length >= 1) {
      folderPath = folder.join("/") + "/"; // Add extra slash at end to separate end of path and file name
    }

    // Prepare form data
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user'));
    formData.append('userId', user.userId); // Assuming userId is stored in localStorage
    formData.append("folderName", folderPath + folderName + "/");

    try {
      const response = await fetch('http://localhost:8080/file/createFolder', {
        method: 'POST',
        body: formData, // FormData will automatically set the Content-Type to multipart/form-data
      });

      const data = await response.text(); // Assuming the backend returns plain text

      if (response.ok) {
        onFolderCreated(); // Notify parent component to refresh the file list
        setFolderName(null);
        setShowForm(false); // Hide the form after successful submission
      } else {
        throw new Error(data || 'Failed to create folder');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="relative overflow-hidden mt-4 p-2 bg-black/10 rounded-lg text-white border-2 border-green-400 transition-all duration-300 group"
      >
        <span className="relative z-10 text-sm md:text-lg">Create Folder</span>
        <span className="absolute inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            {/* Flex container for header and Exit button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Upload Document</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Folder Name</label>
                <input
                  type="text"
                  onChange={(e) => setFolderName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFolder;