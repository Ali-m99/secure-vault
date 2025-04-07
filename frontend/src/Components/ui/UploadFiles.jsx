import React, { useState } from 'react';

const UploadFiles = ({ onFileUploaded, folder, compact = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    let folderPath = "";
    if(Array.isArray(folder) && folder.length >= 1) {
      folderPath = folder.join("/") + "/";
    }

    const formData = new FormData();
    const user = JSON.parse(sessionStorage.getItem('user'));
    formData.append('file', file);
    formData.append('userId', user.userId);
    formData.append("fileName", folderPath + file.name);

    try {
      const response = await fetch('http://localhost:8080/file/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.text();

      if (response.ok) {
        onFileUploaded();
        setFile(null);
        setShowForm(false);
      } else {
        throw new Error(data || 'Failed to upload file');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className={`relative overflow-hidden ${
          compact 
            ? 'px-3 py-1.5 text-sm border border-gray-600 hover:border-green-400' 
            : ' p-1 md:p-2 border-2 text-sm border-green-400'
        } bg-black/10 rounded-lg text-white transition-all duration-300 group`}
      >
        <span className="relative text-sm lg:text-md z-10">{compact ? 'Upload Here' : 'Upload File'}</span>
        <span className="absolute inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md md:text-xl font-semibold text-white">Upload to {folder.length ? folder.join('/')   : 'Root'}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-red-500/50"
              >
                ✕
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-600 file:text-white
                    hover:file:bg-green-700
                    cursor-pointer
                    bg-gray-700 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 text-sm md:text-lg text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-green-600 text-sm md:text-lg text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;