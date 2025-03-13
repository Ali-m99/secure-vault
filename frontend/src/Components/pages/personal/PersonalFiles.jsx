import React, { useState, useEffect } from 'react';
import UploadFiles from '../../ui/UploadFiles';

const PersonalFiles = () => {
  // State to store all files retrieved from the backend
  const [files, setFiles] = useState([]);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // State to track the current folder path (array of folder names)
  const [currentFolder, setCurrentFolder] = useState([]); 

  // Fetch files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = () => {
    fetchFiles();
  };

  // Function to fetch files from the backend
  const fetchFiles = async () => {
    try {
      // Retrieve user details from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User ID not found in localStorage');
      }

      const userId = user.userId;
      const response = await fetch(`http://localhost:8080/file/downloadAll?userId=${userId}`);
      const data = await response.json();

      // Ensure response is an array before setting state
      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        console.error('Expected an array of files, but got:', data);
        setFiles([]); // Reset to empty array if response is invalid
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]);
    } finally {
      setLoading(false); // Stop loading once request completes
    }
  };

  // Function to organize files into a nested folder structure
  const organizeFilesIntoFolders = () => {
    // Root object with 'files' array and 'folders' object for nesting
    const root = { files: [], folders: {} };

    files.forEach((file) => {
      // Split file path into parts (e.g., "folder1/folder2/file.txt" → ["folder1", "folder2", "file.txt"])
      const parts = file.fileName.split('/');
      let currentLevel = root;

      // Traverse folder structure (excluding last part, which is the file name)
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];

        // Create folder if it doesn't exist
        if (!currentLevel.folders[folderName]) {
          currentLevel.folders[folderName] = { files: [], folders: {} };
        }

        // Move to the next level in the folder structure
        currentLevel = currentLevel.folders[folderName];
      }

      // Add the file to the correct folder
      const fileName = parts[parts.length - 1];
      currentLevel.files.push({ ...file, fileName });
    });

    return root;
  };

  // Function to get the current folder view based on 'currentFolder' state
  const getCurrentView = () => {
    let currentLevel = organizeFilesIntoFolders();

    // Traverse into the selected folder path
    for (const folder of currentFolder) {
      if (currentLevel.folders[folder]) {
        currentLevel = currentLevel.folders[folder];
      } else {
        return { files: [], folders: {} }; // Return empty if folder path is invalid
      }
    }

    return currentLevel;
  };

  // Function to handle folder click (navigate into a folder)
  const handleFolderClick = (folderName) => {
    setCurrentFolder([...currentFolder, folderName]); // Add folder to current path
  };

  // Function to go back to the previous folder
  const handleGoBack = () => {
    setCurrentFolder(currentFolder.slice(0, -1)); // Remove last folder from path
  };

  // Retrieve the current folder's files and subfolders
  const { files: visibleFiles, folders: visibleFolders } = getCurrentView();

  return (
    <div className="p-8 py-24">
      {/* File Explorer Title */}
      <h1 className="text-3xl font-bold mb-6 text-green-600">File Explorer</h1>

      <UploadFiles onFileUploaded={handleFileUpload}></UploadFiles>

      <div className="bg-gradient-to-br from-black/90 via-black/5 to-black p-6 rounded-lg border-4 border-green-700">
        {loading ? (
          <p className="text-gray-400">Loading files...</p>
        ) : (
          <>
            {/* Show 'Previous' button if inside a subfolder */}
            {currentFolder.length > 0 && (
              <button
                onClick={handleGoBack}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                ← Previous
              </button>
            )}

            <ul className="text-gray-300">
              {/* Render folders first */}
              {Object.keys(visibleFolders).map((folderName) => (
                <li
                  key={folderName}
                  onClick={() => handleFolderClick(folderName)}
                  className="mb-2 cursor-pointer text-green-400 hover:text-green-300"
                >
                  📁 {folderName}
                </li>
              ))}

              {/* Render files */}
              {visibleFiles.length > 0 ? (
                visibleFiles.map((file) => (
                  file.fileName && (
                    <li key={file.fileName} className="mb-2">
                      <a
                        href={file.preSignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-400"
                      >
                        📄 {file.fileName}
                      </a>
                    </li>
                  )
                ))
              ) : (
                <p className="text-gray-400">No files in this folder.</p>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalFiles;

