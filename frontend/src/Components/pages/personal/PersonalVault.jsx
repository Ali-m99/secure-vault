import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import CreatePasswords from '../../ui/CreatePasswords';
import { deriveKey, decryptData } from '../../cryptography/Crypto';
import UpdatePasswords from '../../ui/UpdatePasswords';
import DeletePassword from '../../ui/DeletePassword';
import { useMasterPassword } from '../../User/MasterPasswordContext';

const PersonalVault = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { masterPassword } = useMasterPassword();

  const fetchPasswords = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user?.userId) throw new Error('User ID not found');
      
      const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${user.userId}`, {
        credentials: "include"
      });
      const data = await response.json();

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
        <h1 className="mt-2 text-xl md:text-2xl font-bold text-green-500">Password Vault</h1>
        <CreatePasswords onPasswordCreated={handlePasswordCreated} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-green-600/50 rounded-lg p-4 h-40 animate-pulse"></div>
          ))}
        </div>
      ) : Object.entries(groupedPasswords).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h2 className="font-medium text-green-400 truncate md:text-xl px-1">{category}</h2>
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
              lastUpdatedDateTime={password.lastModifiedTime}
              createdDateTime={password.dateCreated}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const PasswordItem = ({ serviceName, userName, password, note, category, passwordId, handlePasswordUpdated,
  lastUpdatedDateTime, createdDateTime
 }) => {
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
    <li className="p-3 hover:bg-green-800/10 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-sm md:text-lg font-medium text-gray-100 truncate">
              {serviceName}
            </p>
            <p className="text-sm md:text-lg text-gray-400 truncate">{userName}</p>
          </div>
          <div className="flex gap-1">
            {/* Eye Icon - Visibility Toggle */}
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
            
            {/* Clipboard Icon - Copy */}
            <button
              onClick={copyPassword}
              className="text-green-400 hover:text-green-300 p-1"
              aria-label="Copy password"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            
            {/* Pencil Icon - Update */}
            <UpdatePasswords
              serviceNameU={serviceName}
              userNameU={userName}
              newPasswordU={password}
              categoryU={category}
              passwordIdU={passwordId}
              noteU={note}
              onPasswordUpdated={handlePasswordUpdated}
              asIcon
            />
            
            {/* Trash Icon - Delete */}
            <DeletePassword
              onPasswordDeleted={handlePasswordUpdated}
              passwordId={passwordId}
              serviceName={serviceName}
              asIcon
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-1 rounded text-sm text-green-400 font-mono break-all">
            {isVisible ? password : '•'.repeat(Math.min(12, password?.length || 0))}
          </span>
        </div>

        {note && (
          <div className="mt-1 text-sm text-gray-400 break-words">
            <span className="font-medium">Note:</span> {note}
          </div>
        )}

        <div className="mt-1 text-xs text-gray-400 break-words">
          <span className="font-medium">Date Created:</span> {new Intl.DateTimeFormat("en", {dateStyle: "medium", timeStyle: "medium"}).format(new Date(createdDateTime))}
        </div>
        <div className="mt-1 text-xs text-gray-400 break-words">
          <span className="font-medium">Last Modified:</span> {new Intl.DateTimeFormat("en", {dateStyle: "medium", timeStyle: "medium"}).format(new Date(lastUpdatedDateTime))}
        </div>
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