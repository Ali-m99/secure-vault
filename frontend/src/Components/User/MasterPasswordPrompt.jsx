import React, { useState } from 'react';
import { useMasterPassword } from './MasterPasswordContext';
import { useAuth } from './UserAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const MasterPasswordPrompt = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const { setMasterPassword } = useMasterPassword();
    const { user } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/user/unlock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ 'email': user.email, password, code })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Save raw password to memory (NOT to sessionStorage!)
            setMasterPassword(password);
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-white text-xl font-semibold mb-4">Re-enter Master Password</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-300">Master Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Master Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                    <label className="block text-sm font-medium text-gray-300">MFA Code</label>
                    <input
                        type="text"
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-3 py-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all"
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MasterPasswordPrompt;
