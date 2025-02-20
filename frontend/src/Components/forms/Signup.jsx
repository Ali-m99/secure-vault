import React, { useState } from 'react';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPersonalAccount, setIsPersonalAccount] = useState(false); // Unchecked by default
  const [orgID, setOrgID] = useState(''); // Organization name (text input)
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      password,
      isPersonalAccount,
      orgID: isPersonalAccount ? null : orgID, // 
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
        // setIsPersonalAccount(false);
        // setOrgID('');
      }
    } catch (error) {
      setMessage('An error occurred while submitting the form. Please try again.');
    }
  };

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
        <input type="password" id="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Account Type Checkbox */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={isPersonalAccount}
            onChange={(e) => setIsPersonalAccount(e.target.checked)}
            className="form-checkbox text-green-500"
          />
          <span className="ml-2 text-gray-300">Personal Account</span>
        </label>
      </div>

      {/* Organization Name (Conditional) */}
      {!isPersonalAccount && (
        <div className="mb-4">
            <label htmlFor="orgID" className="block text-sm font-medium text-gray-300">Organization Name</label>
          <input type="text" id="orgID" value={orgID}
            onChange={(e) => setOrgID(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            // required={!isPersonalAccount}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6">
        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 border-4 rounded-md hover:bg-green-700 transition duration-300">
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