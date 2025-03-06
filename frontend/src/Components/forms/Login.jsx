import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAuth } from "../User/UserAuth"; // Adjust import as needed

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      await login(email, password);
      // Redirect to dashboard on successful login
      navigate('/user/personaldashboard');
    } catch (error) {
      // Handle error (e.g., show error message to user)
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-normal mb-6 text-white text-center">Please Enter Account Details</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;