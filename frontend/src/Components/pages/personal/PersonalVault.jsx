import React, { useState, useEffect } from 'react';
import CreatePasswords from '../../ui/CreatePasswords'; // Import the CreatePasswords component
import { deriveKey, decryptData } from '../../cryptography/Crypto';

const PersonalVault = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch passwords from the backend
  const fetchPasswords = async () => {
    try {
      // Retrieve the user object from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User ID not found in localStorage');
      }

      const userId = user.userId; // Access userId from the user object
      const masterPassword = localStorage.getItem('masterPassword'); // Access master password from storage
      const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${userId}`);
      const data = await response.json();

      // // Ensure data is an array
      // if (Array.isArray(data)) {
      //   setPasswords(data);
      // } else {
      //   console.error('Expected an array of passwords, but got:', data);
      //   setPasswords([]); // Set passwords to an empty array
      // }
      const decryptedPasswords = data.map((password) => {
        const key = deriveKey(masterPassword, password.salt);
        const decryptedPassword = decryptData(password.encryptedPassword, key.toString());
        return { ...password, decryptedPassword };
      });

      setPasswords(decryptedPasswords);
    } catch (error) {
      console.error('Failed to fetch passwords:', error);
      setPasswords([]); // Set passwords to an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  // Refresh the password list after a new password is created
  const handlePasswordCreated = () => {
    fetchPasswords();
  };

  // Group passwords by category
  const groupPasswordsByCategory = () => {
    const grouped = {};

    // Ensure passwords is an array
    if (!Array.isArray(passwords)) {
      console.error('Expected passwords to be an array, but got:', passwords);
      return grouped; // Return an empty grouped object
    }

    passwords.forEach((password) => {
      const category = password.category || 'Uncategorized'; // Use default category if none is provided
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(password);
    });

    return grouped;
  };

  const groupedPasswords = groupPasswordsByCategory();

  return (
    <div className="p-8 py-24">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Vault</h1>

      {/* Always show the Create Password button */}
      <CreatePasswords onPasswordCreated={handlePasswordCreated} />

      {/* Display Passwords Grouped by Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10">
        {Object.entries(groupedPasswords).length > 0 ? (
          Object.entries(groupedPasswords).map(([category, passwords]) => (
            <div key={category} className="bg-gradient-to-br from-black/90 via-black/5 to-black p-6 rounded-lg border-4 border-green-700">
              <h2 className="text-xl font-semibold mb-4 text-green-400">{category}</h2>
              <ul className="text-gray-300">
                {passwords.map((password) => (
                  <li key={password.passwordId} className="mb-2">
                    <strong>{password.serviceName}</strong> - {password.userName} - password = {password.decryptedPassword}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            {loading ? 'Loading passwords...' : 'No passwords found. Create one to get started!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalVault;