import React from "react";

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-white shadow-md flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <nav className="mt-4">
          <ul className="space-y-4">
            <li className="flex items-center space-x-2 text-red-500 font-bold pl-6">
              <span className="material-icons">home</span>
              <span>For You</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-700 pl-6">
              <span className="material-icons">explore</span>
              <span>Explore</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-700 pl-6">
              <span className="material-icons">group</span>
              <span>Following</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-700 pl-6">
              <span className="material-icons">person</span>
              <span>Profile</span>
            </li>
          </ul>
        </nav>

        <div className="mt-6 border-t border-gray-300 mx-4"></div>

        <div className="pl-6 mt-4 text-sm text-gray-500">
          <p>Log in to follow creators, like videos, and view comments.</p>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg">
            Log in
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pl-6 mb-6">
        <div className="mt-4">
          <p className="text-gray-500 text-sm">
            Create TikTok effects, get a reward
          </p>
        </div>
        <div className="mt-4 border-t border-gray-300 mx-4"></div>
        <div className="mt-4 text-gray-500 text-sm">
          <p>Company</p>
          <p>Program</p>
          <p>Terms & Policies</p>
          <p>© 2025 TikTok</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
