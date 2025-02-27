
import React from "react";

const PersonalDashboard = () => {
  return (
    <div className="p-2 py-10">
      <h1 className="text-3xl font-bold text-green-600 mb-24">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {/* Password Overview */}
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Passwords</h2>
          <ul className="text-gray-300 text-sm space-y-4">
          <li>Total: 25</li>
          <li>Recently Added: 1</li>
          </ul>
        </div>

        {/* Documents Overview */}
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Documents</h2>
          <ul className="text-gray-300 text-sm space-y-4">
          <li>Total: 10</li>
          <li>Recently Added: 1</li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Recent Activity</h2>
          <ul className="text-gray-300 text-sm space-y-4">
            <li>Added new password - 2 hours ago</li>
            <li>Updated document - 5 hours ago</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;