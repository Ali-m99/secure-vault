import React from 'react';

const MfaPrompt = ({ onSubmit, onCancel, totpCode, setTotpCode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Now handled by parent component
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">MFA Verification</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your 6-digit authentication code
          </label>
          <input
            type="text"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123456"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default MfaPrompt;