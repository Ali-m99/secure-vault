import React from "react";

const PersonalSettings = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Settings</h1>
      <div className="bg-white/5 p-6 rounded-tl-lg rounded-br-lg border-2 border-green-700">
        <h2 className="text-xl font-semibold mb-4 text-green-500">Account Settings</h2>

        {/* Account Settings Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full p-2 bg-white/10 border-2 border-gray-500 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-2 bg-white/10 border-2 border-gray-500 rounded"
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-green-700 rounded hover:bg-green-800 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalSettings;