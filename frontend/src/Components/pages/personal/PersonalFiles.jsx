import React, { useState, useEffect } from 'react';

const PersonalFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState([]); // Tracks current folder path as an array

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User ID not found in localStorage');
      }

      const userId = user.userId;
      const response = await fetch(`http://localhost:8080/file/downloadAll?userId=${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setFiles(data);
      } else {
        console.error('Expected an array of files, but got:', data);
        setFiles([]);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const organizeFilesIntoFolders = () => {
    const root = { files: [], folders: {} };

    files.forEach((file) => {
      const parts = file.fileName.split('/');
      let currentLevel = root;

      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        if (!currentLevel.folders[folderName]) {
          currentLevel.folders[folderName] = { files: [], folders: {} };
        }
        currentLevel = currentLevel.folders[folderName];
      }

      const fileName = parts[parts.length - 1];
      currentLevel.files.push({ ...file, fileName });
    });

    return root;
  };

  const getCurrentView = () => {
    let currentLevel = organizeFilesIntoFolders();

    for (const folder of currentFolder) {
      if (currentLevel.folders[folder]) {
        currentLevel = currentLevel.folders[folder];
      } else {
        return { files: [], folders: {} };
      }
    }

    return currentLevel;
  };

  const handleFolderClick = (folderName) => {
    setCurrentFolder([...currentFolder, folderName]);
  };

  const handleGoBack = () => {
    setCurrentFolder(currentFolder.slice(0, -1));
  };

  const { files: visibleFiles, folders: visibleFolders } = getCurrentView();

  return (
    <div className="p-8 py-24">
      <h1 className="text-3xl font-bold mb-6 text-green-600">File Explorer</h1>

      <div className="bg-gradient-to-br from-black/90 via-black/5 to-black p-6 rounded-lg border-4 border-green-700">
        {loading ? (
          <p className="text-gray-400">Loading files...</p>
        ) : (
          <>
            {currentFolder.length > 0 && (
              <button
                onClick={handleGoBack}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                ← Previous
              </button>
            )}

            <ul className="text-gray-300">
              {Object.keys(visibleFolders).map((folderName) => (
                <li
                  key={folderName}
                  onClick={() => handleFolderClick(folderName)}
                  className="mb-2 cursor-pointer text-green-400 hover:text-green-300"
                >
                  📁 {folderName}
                </li>
              ))}

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
