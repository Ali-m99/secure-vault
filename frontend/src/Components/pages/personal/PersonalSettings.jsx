import React from "react";
import ResetPassword from "../../ui/ResetPassword";
import { useAuth } from "../../User/UserAuth";

const PersonalSettings = () => {

  
  const { user } = useAuth();



  return (
    <div className="p-8">
      <h1 className="text-xl md:text-2xl  py-6 font-bold mb-6 text-green-600">Settings</h1>
      <div className="bg-white/5 p-6 rounded-tl-lg rounded-br-lg border-2 border-green-700">
        <h2 className="text-xl font-semibold mb-4 text-green-500">Account Information</h2>
        
        {/* Read-Only User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">First Name</label>
              <div className="p-2 bg-white/10 border-2 border-gray-500 rounded text-gray-200">
                {user?.firstName}
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Last Name</label>
              <div className="p-2 bg-white/10 border-2 border-gray-500 rounded text-gray-200">
                {user?.lastName}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <div className="p-2 bg-white/10 border-2 border-gray-500 rounded text-gray-200">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Last Login</label>
            <div className="p-2 bg-white/10 border-2 border-gray-500 rounded text-gray-200">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
            </div>
          </div>
        </div>

        {/* Password Section (Separate visual group) */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h2 className="text-sm lg:text-xl font-semibold mb-4 text-green-500">Password Management</h2>
          <ResetPassword />
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings;