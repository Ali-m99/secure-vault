import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { deriveKey, encryptData } from '../cryptography/Crypto';
import { useMasterPassword } from '../User/MasterPasswordContext';

const CreatePasswords = ({ onPasswordCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [existingCategories, setExistingCategories] = useState(['Uncategorized']);
  const [error, setError] = useState('');
  const { masterPassword } = useMasterPassword();

  // Fetch existing categories when form opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user?.userId) return;
        
        const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${user.userId}`, {
          credentials: "include"
        });
        const passwords = await response.json();
        
        // Get unique categories, keeping 'Uncategorized' as first option
        const categories = ['Uncategorized', ...new Set(
          passwords
            .map(p => p.category)
            .filter(c => c && c !== 'Uncategorized')
        )];
        
        setExistingCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (showForm) fetchCategories();
  }, [showForm]);

  // Password generator function
  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    setNewPassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const key = deriveKey(masterPassword, salt);

    const encryptedPassword = encryptData(newPassword, key.toString());

    // Prepare form-encoded data
    const formData = new URLSearchParams();
    const user = JSON.parse(sessionStorage.getItem('user'));
    formData.append('encryptedPassword', encryptedPassword);
    formData.append('salt', salt);
    formData.append('serviceName', serviceName);
    formData.append('email', user.email);
    formData.append('note', note);
    formData.append('userName', userName);
    formData.append('category', category || 'Uncategorized');

    try {
      const response = await fetch('http://localhost:8080/password/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        credentials: "include"
      });

      const data = await response.text();

      if (response.ok) {
        onPasswordCreated();
        setServiceName('');
        setUserName('');
        setNewPassword('');
        setNote('');
        setCategory('');
        setShowForm(false);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-1 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Create New Password</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Service Name <span className='text-xl text-gray-300'>*</span> </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Username <span className='text-xl text-gray-300'>*</span> </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Password <span className='text-xl text-gray-300'>*</span> </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300"
                  >
                    Generate
                  </button>
                </div>
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
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <div className="flex mt-2 gap-2">
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Or type new category"
                  />
                </div>
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
};

export default CreatePasswords;