import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import CreatePasswords from '../../ui/CreatePasswords';
import { deriveKey, decryptData } from '../../cryptography/Crypto';
import UpdatePasswords from '../../ui/UpdatePasswords';

const PersonalVault = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPasswords = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.userId) throw new Error('User ID not found');
      
      const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${user.userId}`);
      const data = await response.json();

      const masterPassword = localStorage.getItem('masterPassword');
      const decryptedPasswords = data.map((password) => {
        const key = deriveKey(masterPassword, password.salt);
        const decryptedPassword = decryptData(password.encryptedPassword, key.toString());
        return { ...password, decryptedPassword };
      });

      setPasswords(decryptedPasswords);
    } catch (error) {
      console.error('Failed to fetch passwords:', error);
      setPasswords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPasswords(); }, []);

  const handlePasswordCreated = () => { fetchPasswords(); };
  const handlePasswordUpdated = () => { fetchPasswords(); };

  const groupPasswordsByCategory = () => {
    const grouped = {};
    (passwords || []).forEach((password) => {
      const category = password.category || 'Uncategorized';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(password);
    });
    return grouped;
  };

  const groupedPasswords = groupPasswordsByCategory();

  return (
    <div className="p-4 md:p-8 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-green-500">Password Vault</h1>
        <CreatePasswords onPasswordCreated={handlePasswordCreated} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-green-600/50 rounded-lg p-4 h-40 animate-pulse"></div>
          ))}
        </div>
      ) : Object.entries(groupedPasswords).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
          {Object.entries(groupedPasswords).map(([category, passwords]) => (
            <CategorySection 
              key={category} 
              category={category} 
              passwords={passwords}
              handlePasswordUpdated={handlePasswordUpdated}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="mb-4">No passwords found</p>
          
        </div>
      )}
    </div>
  );
};

const CategorySection = ({ category, passwords, handlePasswordUpdated }) => {
  return (
    <div className="bg-gradient-to-br from-black/90 via-black/20 to-black/90 rounded-lg border-2 border-green-400/60 overflow-hidden">
      <div className="p-3 bg-green-900/30 border-b border-green-700/50">
        <h2 className="font-medium  text-green-400 truncate md:text-xl px-1">{category}</h2>
      </div>
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto thin-scrollbar">
        <ul className="divide-y divide-gray-200/50">
          {passwords.map((password) => (
            <PasswordItem
              key={password.passwordId}
              serviceName={password.serviceName}
              userName={password.userName}
              password={password.decryptedPassword}
              category={category}
              passwordId={password.passwordId}
              note={password.notes}
              handlePasswordUpdated={handlePasswordUpdated}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const PasswordItem = ({ serviceName, userName, password, note, category, passwordId, handlePasswordUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const copyPassword = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      });
  }; 

  return (
    <li className="p-3 hover:bg-green-800/30 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-sm  md:text-lg font-medium text-gray-100 truncate">
              {serviceName}
            </p>
            <p className="text-xs md:text-lg text-gray-400 truncate">{userName}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={toggleVisibility}
              className="text-green-400 hover:text-green-300 p-1"
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={copyPassword}
              className="text-green-400 hover:text-green-300 p-1"
              aria-label="Copy password"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-1 rounded text-sm text-green-400 font-mono break-all">
            {isVisible ? password : '•'.repeat(Math.min(12, password?.length || 0))}
          </span>
        </div>
        
        <UpdatePasswords  
              serviceNameU={serviceName}
              userNameU={userName}
              newPasswordU={password}
              categoryU={category}
              passwordIdU={passwordId}
              noteU={note}
              onPasswordUpdated={handlePasswordUpdated}/>


        {note && (
          <div className="mt-1 text-xs text-gray-400 break-words">
            <span className="font-medium">Note:</span> {note}
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded text-sm shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </li>
  );
};

export default PersonalVault;
