import React, { useState, useEffect } from 'react';
import UploadFiles from '../../ui/UploadFiles';
import CreateFolder from '../../ui/CreateFolder';
import DeleteFile from '../../ui/DeleteFile';
import { FolderIcon, DocumentIcon, ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PersonalFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = () => {
    fetchFiles();
  };

  const fetchFiles = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User ID not found in sessionStorage');
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
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className=" py-6 mt-4 text-xl md:text-2xl font-bold text-green-500">My Files</h1>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <CreateFolder onFolderCreated={handleFileUpload} folder={currentFolder} />
          
        </div>
      </div>

      {/* Main Content Container */}
      <div className=" bg-gradient-to-br from-black/90 via-slate-800/20 to-black/70 backdrop-blur-sm rounded-lg border-2 border-gray-700 shadow-lg overflow-hidden">
        {/* Navigation Bar */}
        <div className="p-3 sm:p-4 border-b border-gray-800 bg-gradient-to-r from-green-800/20 bg-green-900/30 flex items-center overflow-x-auto">
          {currentFolder.length > 0 ? (
            <button
              onClick={handleGoBack}
              className="flex-shrink-0 flex items-center gap-1 text-gray-300 hover:text-white mr-3 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
          ) : (
            <div className="flex-shrink-0 text-gray-400 flex items-center">
              <FolderIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm text-white">Root</span>
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="flex items-center text-xs sm:text-sm whitespace-nowrap">
            {currentFolder.map((folder, index) => (
              <React.Fragment key={index}>
                <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 mx-2 text-gray-500 flex-shrink-0" />
                <button
                  onClick={() => setCurrentFolder(currentFolder.slice(0, index + 1))}
                  className="text-gray-300 hover:text-green-400 transition-colors flex-shrink-0"
                >
                  {folder.length > 12 ? `${folder.substring(0, 10)}...` : folder}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Folders Section */}
              {Object.keys(visibleFolders).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-300 mb-3">Folders</h2>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Object.keys(visibleFolders).map((folderName) => (
                      <div
                        key={folderName}
                        className="group relative p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500 transition-all cursor-pointer"
                      >
                        <div
                          onClick={() => handleFolderClick(folderName)}
                          className="flex flex-col items-center"
                        >
                          <FolderIcon className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 group-hover:text-yellow-300 mb-2" />
                          <span className="text-center text-xs sm:text-sm text-gray-200 group-hover:text-green-400 truncate w-full">
                            {folderName.length > 14 ? `${folderName.substring(0, 12)}...` : folderName}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <DeleteFile
                            onFileDeleted={handleFileUpload}
                            folder={currentFolder}
                            fileName={folderName + "/"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Section */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                  <div className="flex items-center">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-300 mr-3">Files</h2>
                    <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">
                      {visibleFiles.length} {visibleFiles.length === 0 ? 'file' : 'files'}
                    </span>
                  </div>
                  
                  <div className="w-full  sm:w-auto">
                    <UploadFiles 
                      onFileUploaded={handleFileUpload} 
                      folder={currentFolder}
                      compact={false}
                      className="w-full   sm:w-auto"
                    />
                  </div>
                </div>
                
                {visibleFiles.length > 0 ? (
                  <div className="space-y-2">
                    {visibleFiles.map((file) => (
                      file.fileName && (
                        <div
                          key={file.fileName}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center min-w-0">
                            <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                            <a
                              href={file.preSignedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-gray-200 hover:text-green-400 truncate"
                              title={file.fileName}
                            >
                              {file.fileName.length > 24 ? `${file.fileName.substring(0, 22)}...` : file.fileName}
                            </a>
                          </div>
                          <DeleteFile
                            onFileDeleted={handleFileUpload}
                            folder={currentFolder}
                            fileName={file.fileName}
                          />
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <DocumentIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mb-3" />
                    <p className="mb-4 text-sm sm:text-base">No files in this directory</p>
                    <div className="flex justify-center">
                      <UploadFiles 
                        onFileUploaded={handleFileUpload} 
                        folder={currentFolder}
                        variant="primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalFiles;