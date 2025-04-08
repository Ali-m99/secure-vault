
import React, { useEffect, useState } from "react";

const PersonalDashboard = () => {
  const [passwordCount, setPasswordCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  // When page loads, retrieve password and file count
  useEffect(() => {
    fetchPasswordCount();
    fetchFileCount();
  }, []);

  const fetchPasswordCount = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const response = await fetch(`/password/count?userId=${user.userId}`, {
      credentials: "include"
    });

    const data = await response.json();

    if (data.status === "success") {
      setPasswordCount(data.count);
    }
  }

  const fetchFileCount = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const response = await fetch(`/file/count?userId=${user.userId}`, {
      credentials: "include"
    });

    const data = await response.text();

    if (response.ok) {
      setFileCount(data);
    }
  }

  return (
    <div className="p-2 py-10">
      <h1 className=" mt-4 text-xl md:text-2xl font-bold text-green-600 mb-24">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {/* Password Overview */}
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Passwords</h2>
          <ul className="text-gray-300 text-sm space-y-4">
          <li>Total: {passwordCount}</li>
          </ul>
        </div>

        {/* Documents Overview */}
        <div className="bg-gradient-to-br from-black/90 via-black/5 to-black  p-6 rounded-lg border-4 border-green-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Documents</h2>
          <ul className="text-gray-300 text-sm space-y-4">
          <li>Total: {fileCount}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;