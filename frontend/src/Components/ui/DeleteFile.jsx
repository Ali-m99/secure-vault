import React, { useState } from 'react';

const DeleteFile = ({ onFileDeleted, folder, fileName }) => {
  const [showForm, setShowForm] = useState(false);
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
    formData.append("fileName", folderPath + fileName); // i.e. folder1/folder2/test.txt

    try {
      const response = await fetch('http://localhost:8080/file/delete', {
        method: 'POST',
        body: formData, // FormData will automatically set the Content-Type to multipart/form-data
      });

      const data = await response.text(); // Assuming the backend returns plain text

      if (response.ok) {
        onFileDeleted(); // Notify parent component to refresh the file list
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
        className="relative overflow-hidden p-1 bg-black/10 rounded-lg text-white border-2 border-red-400 transition-all duration-300 hover:bg-red-500"
        style={{ width: '32px', height: '32px' }}
      >
        <span className="relative z-10 text-sm">🗑️</span>
        <span className="absolute inset-0 w-0 bg-red-700 transition-all duration-300 hover:w-full opacity-20"></span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Delete File</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="relative overflow-hidden p-2 bg-black/10 rounded-lg text-white border-2 border-red-400 transition-all duration-300 group"
              >
                <span className="relative z-10 text-sm md:text-lg">Exit</span>
                <span className="absolute inset-y-0 right-full w-0 bg-red-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
              </button>
          </div>
      
          {/* Centered confirmation message */}
          <div className="text-center mb-6">
            <p className="text-white text-lg">Are you sure you want to delete the file "{fileName}"?</p>
          </div>
      
          {/* Error message */}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      
          {/* Buttons */}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
            >
              No
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300"
            >
              Yes
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default DeleteFile;