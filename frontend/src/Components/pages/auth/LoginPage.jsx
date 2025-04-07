import React, { useState } from 'react';
import Login from '../../forms/Login';
import backgroundImage from '../../assets/sv-background.jpg'; // Adjust the path to your image
import ForgotPassword from '../../ui/ForgotPassword';

const LoginPage = () => {
  const [masterPasswordHint, setMasterPasswordHint] = useState('');

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay for the entire screen */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-gray-900/20 to-black/60 backdrop-blur-md items-center justify-center relative z-10 p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-8">Welcome Back!</h1>
        <div
          className="w-full max-w-md bg-transparent backdrop-blur-xl border-2 border-green-600/50 rounded-lg shadow-2xl p-8 relative overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0, 255, 0, 0.1)',
          }}
        >
          {/* Glossy Border Effect */}
          <div
            className="absolute inset-0 border-8 border-transparent rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(145deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 0, 0.05)`,
              mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
              WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          ></div>

          <Login /> {/* Your existing Login form component */}
          <ForgotPassword setPasswordHint={setMasterPasswordHint}/>

          {masterPasswordHint != '' && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Your master password hint is: {masterPasswordHint}
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="text-green-400 hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Column */}
      <div className="hidden lg:flex md:w-1/2 bg-gradient-to-tr from-black/50 via-green-800/50 to-black backdrop-blur-xl relative z-10 p-8 text-white flex-col items-center justify-center">
        <h2 className="text-3xl font-bold h-64 mb-6">SecureVault</h2>
        <blockquote className="text-lg italic mb-6">
          "Securely simplify your digital life with our comprehensive password and document management solution, designed for seamless file and password sharing."
        </blockquote>
        <p className="text-lg"></p>
      </div>
    </div>
  );
};

export default LoginPage;