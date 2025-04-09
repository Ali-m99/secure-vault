import React, { useState } from 'react';

const CreateFolder = ({ onFolderCreated, folder }) => {
  const [showForm, setShowForm] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build folder path
    let folderPath = "";
    if(Array.isArray(folder) && folder.length >= 1) {
      folderPath = folder.join("/") + "/";
    }

    // Prepare form data
    const formData = new FormData();
    const user = JSON.parse(sessionStorage.getItem('user'));
    formData.append('userId', user.userId);
    formData.append("folderName", folderPath + folderName + "/");

    try {
      const response = await fetch('http://localhost:8080/file/createFolder', {
        method: 'POST',
        body: formData,
        credentials: "include"
      });

      const data = await response.text();

      if (response.ok) {
        // Update folder count in localStorage
        const currentCount = parseInt(localStorage.getItem('folderCount')) || 0;
        localStorage.setItem('folderCount', currentCount + 1);
        
        onFolderCreated(); // Refresh file list
        setFolderName('');
        setShowForm(false);
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
        onClick={() => setShowForm(true)}
        className="relative overflow-hidden mt-4 p-2 bg-black/10 rounded-lg text-white border-2 border-green-400 transition-all duration-300 group"
      >
        <span className="relative z-10 text-sm md:text-lg">Create Folder</span>
        <span className="absolute inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-2 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Create Folder</h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Folder Name</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="[a-zA-Z0-9-_]+"
                  title="Alphanumeric characters, hyphens and underscores only"
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