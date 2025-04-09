import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [masterPasswordHint, setMasterPasswordHint] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    generateQrCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (!passwordsMatch) {
      setMessage('Passwords do not match');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      secret,
      masterPasswordHint
    };

    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(userData).toString(),
      });

      const result = await response.text();
      setMessage(result);

      // Reset form on successful submission
      if (response.ok) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setMasterPasswordHint('');
      }
    } catch (error) {
      setMessage('An error occurred while submitting the form. Please try again.');
    }
  };

  const generateQrCode = async () => {
    try {
      const response = await fetch("/mfa/setup");
      const result = await response.json();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (error) {
      setMessage('An error occurred while generating the QR code for MFA.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* First Name */}
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name</label>
        <input type="text" id="firstName" value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last Name</label>
        <input type="text" id="lastName" value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input type="email" id="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
        <div className='relative mt-1'>
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            type={showConfirmPassword ? "text" : "password"} 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 p-1 pr-3 flex items-center text-sm leading-5"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
       
        
      </div>
      {confirmPassword.length > 0 && (
          <p className={` mt-1 text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
            {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
          </p>
        )}
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

         {/*QR Code */}
      {qrCode !== '' ? (
        <div className="mb-4 space-y-3">
          <label htmlFor="qrCode" className="block text-sm font-medium text-gray-300">Register for MFA</label>
          <img src={qrCode} className=' items-center h-32 w-32' id='qrCode' alt='QR Code for MFA' />
        </div>
      ) : (
        <div className="mb-4">
          <p>Generating QR Code...</p>
        </div>)}



      {/* Submit Button */}
      <div className="mt-6">
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 border-4 rounded-md hover:bg-green-700 transition duration-300"
          disabled={!passwordsMatch}
        >
          Sign Up
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <p className="mt-4 text-center text-gray-300">
          {message}
        </p>
      )}
    </form>
  );
};

export default Signup;