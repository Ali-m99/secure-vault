import React, { useState } from 'react';
import Login from '../../forms/Login';
import backgroundImage from '../../assets/sv-background.jpg'; // Adjust the path to your image
import ForgotPassword from '../../ui/ForgotPassword';
import hero from '../../assets/hero-SV.jpg';
import { 
  LockClosedIcon, 
  DocumentTextIcon, 
  KeyIcon, 
  ShareIcon, 
  DeviceMobileIcon,
  ArrowTrendingUpIcon 
} from "@heroicons/react/24/outline";


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
        <h1 className="text-3xl font-bold text-white/80 mb-8">Welcome Back!</h1>
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
      <div className="hidden lg:flex md:w-1/2 bg-gradient-to-tr from-black/50 via-green-800/50 to-black backdrop-blur-xl relative z-10 p-6 text-white flex-col items-center justify-center">
  <h2 className="text-3xl font-bold text-green-400 mb-6">SecureVault</h2>

<div className='flex flex-col'>
  
  <div className="mb-8 rounded-xl overflow-hidden bg-black/20 border border-green-800/30">
    <img 
      src={hero} 
      className="w-full max-h-96 object-cover" 
      alt="SecureVault Illustration" 
    />
  </div>

  {/* Feature List Panel */}
  <div className="w-full bg-black/60  rounded-lg p-6 mb-6 border border-gray-700">
    <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
      <ArrowTrendingUpIcon className="h-6 w-6 mr-2" />
      Key Features
    </h3>
    <ul className="space-y-3">
      {[
        { icon: <LockClosedIcon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-green-400" />, text: 'Military-grade encryption' },
        { icon: <DocumentTextIcon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-green-400" />, text: 'Secure document storage' },
        { icon: <KeyIcon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-green-400" />, text: 'Password generator' },
        { icon: <ShareIcon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-green-400" />, text: 'Mobile and Desktop' },
      ].map((feature, index) => (
        <li key={index} className="flex items-start">
          {feature.icon}
          <span className="text-gray-300">{feature.text}</span>
        </li>
      ))}
    </ul>
  </div>
  </div>

  <blockquote className="text-lg text-center px-12 text-gray-400">
    Securely simplify your digital life with our comprehensive password and document management solution.
  </blockquote>
</div>
    </div>
  );
};

export default LoginPage;