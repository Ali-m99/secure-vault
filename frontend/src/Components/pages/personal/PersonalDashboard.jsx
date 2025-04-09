import React, { useEffect, useState } from "react";
import { 
  LockClosedIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  FolderIcon,
  DocumentIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const PersonalDashboard = () => {
  const [passwordCount, setPasswordCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [folderCount, setFolderCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPasswordCount();
    fetchFileAndFolderCounts();
    fetchRecentPasswordActivities();
  }, []);

  const fetchPasswordCount = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const response = await fetch(`/password/count?userId=${user.userId}`, {
      credentials: "include"
    });
    const data = await response.json();
    if (data.status === "success") setPasswordCount(data.count);
  };

  const fetchFileAndFolderCounts = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await fetch(`http://localhost:8080/file/downloadAll?userId=${user.userId}`, {
        credentials: "include"
      });
      const files = await response.json();
      
      if (Array.isArray(files)) {
        const realFiles = files.filter(file => !file.fileName.endsWith('/'));
        setFileCount(realFiles.length);
        const folders = files.filter(file => file.fileName.endsWith('/'));
        setFolderCount(folders.length);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchRecentPasswordActivities = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await fetch(`http://localhost:8080/password/getPasswords?userId=${user.userId}`, {
        credentials: "include"
      });
      const passwords = await response.json();

      // Process password activities
      const activities = passwords.flatMap(password => [
        {
          id: `${password.passwordId}-created`,
          action: `Created password for ${password.serviceName}`,
          type: 'password',
          timestamp: password.dateCreated,
          icon: <PlusIcon className="h-4 w-4 text-green-400" />
        },
        {
          id: `${password.passwordId}-updated`,
          action: `Updated password for ${password.serviceName}`,
          type: 'password',
          timestamp: password.lastModifiedTime,
          icon: <ArrowPathIcon className="h-4 w-4 text-blue-400" />
        }
      ]);

      // Sort by timestamp (newest first) and take top 5
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      setRecentActivity(sortedActivities);
    } catch (error) {
      console.error("Error fetching password activities:", error);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 py-6">
        <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>
        <p className="text-gray-400">Your overview</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Password Card */}
        <div 
          onClick={() => navigate('/user/passwords')}
          className="bg-green-900/20 rounded-lg border-2 border-green-600/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all cursor-pointer hover:bg-green-900/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <LockClosedIcon className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-green-400">Passwords</h2>
          </div>
          <p className="text-4xl font-bold text-white">{passwordCount}</p>
          <p className="text-sm text-gray-400 mt-1">Total encrypted</p>
        </div>

        {/* Documents Card */}
        <div 
          onClick={() => navigate('/user/files')}
          className="bg-green-900/20 rounded-lg border border-green-600/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all cursor-pointer hover:bg-green-900/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-green-400">Documents</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-3xl font-bold text-white">{fileCount}</p>
              </div>
              <p className="text-sm text-gray-400">Files</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <FolderIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-3xl font-bold text-white">{folderCount}</p>
              </div>
              <p className="text-sm text-gray-400">Folders</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-sm text-green-400 mt-2">
          
            <span>Total items: {fileCount + folderCount}</span>
          </div>
        </div>

        {/* Security Status Card */}
        <div className="bg-green-900/20 rounded-lg border border-green-600/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-green-400">Security Status</h2>
          </div>
          <p className="text-4xl font-bold text-white">100%</p>
          <p className="text-sm text-gray-400 mt-1">All systems secure</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-green-900/20 rounded-lg border border-green-600/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">Recent Password Activities</h2>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center p-3 bg-black/30 rounded-lg transition-colors">
                <div className="p-2 mr-3 bg-gray-700/50 rounded-full">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            <p>No recent password activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDashboard;