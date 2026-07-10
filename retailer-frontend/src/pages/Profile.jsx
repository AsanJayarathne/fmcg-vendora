import { useState } from "react";
import ProfileTab from "../components/ProfileTab";
import SecurityTab from "../components/SecurityTab";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      {/* Page heading */}
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

      {/* Full-width card filling the content area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex gap-1 border-b px-6 pt-4">
          {["profile", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg capitalize transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "profile" ? "Edit Profile" : "Security"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "profile" ? <ProfileTab /> : <SecurityTab />}
      </div>
    </div>
  );
}