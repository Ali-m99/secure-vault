import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const DeleteFile = ({ onFileDeleted, folder, fileName }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const isFolder = fileName.endsWith('/');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Builds the folder path properly from an array
    // (i.e. from ["folder1", "folder2", "folder3"] to "folder1/folder2/folder3")
    // If the passed in folder path isn't an array or is empty, upload file to root    
    
    let fullPath = "";
    if (Array.isArray(folder) && folder.length >= 1) {
      fullPath = folder.join("/") + "/";
    }
    fullPath += fileName;

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('userId', user.userId);
      formData.append('fileName', fullPath);
      formData.append('isFolder', isFolder.toString()); // Indicate this is a folder deletion

      const response = await fetch('http://localhost:8080/file/delete', {
        method: 'POST',
        body: formData,
        credentials: "include"
      });

      const data = await response.text();

      if (response.ok) {
        onFileDeleted();
        setShowForm(false);
      } else {
        throw new Error(data || `Failed to delete ${isFolder ? 'folder' : 'file'}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>

      <button
                      onClick={() => setShowForm(!showForm)}
                      className="text-red-400 hover:text-red-500 p-1"
                      aria-label="Delete Folder"
                      title={`Delete ${isFolder ? 'Folder' : 'File'}`}
                  >
                      <TrashIcon className="w-5 h-5" />
                  </button>
      

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full  max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md md:text-xl font-semibold text-white">
                Delete {isFolder ? 'Folder' : 'File'}
              </h2>
              <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-white text-sm md:text-lg">
                {isFolder ? (
                  <>
                    Delete folder "{fileName.replace(/\/$/, '')}" and 
                    <strong> ALL its contents</strong>?
                  </>
                ) : (
                  <>Delete file "{fileName}"?</>
                )}
              </p>
            </div>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-600 text-white  text-sm md:text-md p-2 rounded-md hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white text-sm md:text-md p-0 rounded-md hover:bg-red-700 transition-all duration-300"
              >
                Confirm Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteFile;