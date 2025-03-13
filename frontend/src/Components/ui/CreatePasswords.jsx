import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { deriveKey, encryptData } from '../cryptography/Crypto';

const CreatePasswords = ({ onPasswordCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const masterPassword = localStorage.getItem('masterPassword');
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(); // Generate a random salt
    const key = deriveKey(masterPassword, salt);

    const encryptedPassword = encryptData(newPassword, key.toString());

    // Prepare form-encoded data
    const formData = new URLSearchParams();
    const user = JSON.parse(localStorage.getItem('user'));
    formData.append('encryptedPassword', encryptedPassword);
    formData.append('salt', salt); // Store the salt for decryption
    formData.append('serviceName', serviceName);
    formData.append('email', user.email); // Assuming email is stored in localStorage
    formData.append('note', note);
    formData.append('userName', userName);
    formData.append('category', category || 'Uncategorized'); // Use default category if none is provided

    try {
      const response = await fetch('http://localhost:8080/password/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(), // Convert URLSearchParams to string
      });

      const data = await response.text(); // Assuming the backend returns plain text

      if (response.ok) {
        onPasswordCreated(); // Notify parent component to refresh the password list
        setServiceName('');
        setUserName('');
        setNewPassword('');
        setNote('');
        setCategory('');
        setShowForm(false); // Hide the form after successful submission
      } else {
        throw new Error(data || 'Failed to store password');
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
        <span className="relative z-10 text-sm md:text-lg">Create Password</span>
        <span className="absolute inset-y-0 right-full w-0 bg-green-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
      </button>
  
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Flex container for header and Exit button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Create New Password</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="relative overflow-hidden p-2 bg-black/10 rounded-lg text-white border-2 border-red-400 transition-all duration-300 group"
              >
                <span className="relative z-10 text-sm md:text-lg">Exit</span>
                <span className="absolute inset-y-0 right-full w-0 bg-red-700 transition-all duration-300 group-hover:right-0 group-hover:w-full"></span>
              </button>
            </div>
  
            {/* Error message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
  
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Note</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Optional (default: Uncategorized)"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
              >
                Create Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePasswords;