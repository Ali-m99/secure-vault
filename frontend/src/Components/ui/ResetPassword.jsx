import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { deriveKey, encryptData, decryptData } from '../cryptography/Crypto';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useMasterPassword } from '../User/MasterPasswordContext';

const ResetPassword = () => {
    const [step, setStep] = useState(0); // sets whether to show this form and what step to show; 0 means
    //  show just "Forgot password?" link
    const [code, setCode] = useState(''); // TOTP Code from MFA app
    const [newMasterPassword, setNewMasterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [masterPasswordHint, setMasterPasswordHint] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { masterPassword, setMasterPassword } = useMasterPassword();

    const passwordsMatch = newMasterPassword === confirmPassword && confirmPassword.length > 0;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const reencryptPasswords = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user?.userId) throw new Error('User ID not found');
    
            // 1. Get all passwords from backend
            const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${user.userId}`);
            const encryptedPasswords = await response.json();
            
            // 2. Decrypt all passwords with old key
            const decryptedPasswords = encryptedPasswords.map(password => {
                const oldKey = deriveKey(masterPassword, password.salt);
                const decryptedPassword = decryptData(password.encryptedPassword, oldKey.toString());
                return { ...password, decryptedPassword };
            });
    
            // 3. Sets master password in memory to new one
            setMasterPassword(newMasterPassword); 
    
            // 4. Re-encrypt all passwords with new key
            const updatePromises = decryptedPasswords.map(async password => {
                const newKey = deriveKey(newMasterPassword, password.salt);
                const reencryptedPassword = encryptData(password.decryptedPassword, newKey.toString());
                
                await fetch('/password/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        passwordId: password.passwordId,
                        encryptedPassword: reencryptedPassword
                    }).toString(),
                });
            });
    
            await Promise.all(updatePromises);
            
        } catch (err) {
            console.error('Re-encryption failed:', err);
            throw new Error('Failed to re-encrypt passwords');
        }
    }

    const handleNewMasterPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStep(3);
    
        if (!passwordsMatch) {
            setError("Passwords don't match");
            return;
        }
    
        try {
            // 1. First re-encrypt all passwords
            await reencryptPasswords();
            
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user?.userId) throw new Error('User ID not found');
    
            // 2. Then update the master password and hint
            const response = await fetch('/user/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ 
                    "email": user.email, 
                    newMasterPassword, 
                    masterPasswordHint,
                    code 
                }).toString()
            });
    
            if (!response.ok) throw new Error('Password reset failed');
    
            // 3. Clear state and close modal
            setStep(0);
            setCode('');
            setNewMasterPassword('');
            setConfirmPassword('');
            setMasterPasswordHint('');
            setError('');
    
        } catch (err) {
            setError("Error resetting password: " + err.message);
            console.error(err);
        }
    }

    const onCancel = () => {
        setStep(0);
        setCode('');
        setEmail('');
        setNewMasterPassword('');
        setError('');
        setConfirmPassword('');
    }

    return (
        <div>
            {step === 0 && (
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
                    >
                        Reset Password
                    </button>
              </div>
            )}

            {step === 1 && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Please Enter Your New Password</h2>
                            <button
                                onClick={onCancel}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <form onSubmit={handleNewMasterPasswordSubmit}>
                            {/* Password */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                <div className='relative mt-1'>
                                    <input
                                        type={showPassword ? "password" : "text"}
                                        id="password"
                                        value={newMasterPassword}
                                        onChange={(e) => setNewMasterPassword(e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                                <div className='relative mt-1'>
                                    <input
                                        type={showConfirmPassword ? "password" : "text"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>

                                    {confirmPassword.length > 0 && (
                                        <p className={`mt-1 text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
                                        </p>
                                    )}
                                </div>
                                </div>

                            {/* Master Password Hint */}
                            <div className="mb-4">
                                <label htmlFor="passwordHint" className="block text-sm font-medium text-gray-300">Password Hint</label>
                                <input type="text" id="passwordHint" value={masterPasswordHint}
                                    onChange={(e) => setMasterPasswordHint(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* MFA Code */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter your 6-digit authentication code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="123456"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
                            >
                                Change Master Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Loading...</h2>
                    </div>
                </div>
            </div>
            )}
        </div>
    );

};

export default ResetPassword;