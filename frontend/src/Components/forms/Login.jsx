import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAuth } from "../User/UserAuth";
import MfaPrompt from '../ui/MfaPrompt';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);
  const [error, setError] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    setShowMfaPrompt(true);
    
    // try {
    //   // First verify email/password (MFA will always be required)
    //   const response = await fetch('/user/loginTest', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //     body: new URLSearchParams({ email, password }).toString(),
    //   });

    //   const data = await response.json();

    //   if (data.status === 'success') {
    //     // For enforced MFA, always show the prompt after successful credentials
    //     setShowMfaPrompt(true);
    //   } else {
    //     throw new Error(data.message || 'Login failed');
    //   }
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  const handleMfaSubmit = async () => {
    try {
      await login(email, password, totpCode);
      navigate('/user/personaldashboard');
    } catch (error) {
      setError(error.message);
      setTotpCode(''); // Clear the TOTP code on failure
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-normal mb-6 text-white text-center">Please Enter Account Details</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-900/50 text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      {!showMfaPrompt ? (
        <form onSubmit={handleInitialSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                required
                autoComplete="current-password"
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
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
          >
            Continue
          </button>
        </form>
      ) : (
        <MfaPrompt 
          onSubmit={handleMfaSubmit}
          onCancel={() => {
            setShowMfaPrompt(false);
            setError('');
            setTotpCode('');
          }}
          totpCode={totpCode}
          setTotpCode={setTotpCode}
        />
      )}
    </div>
  );
};

export default Login;