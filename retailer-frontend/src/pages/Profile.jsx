import { useState } from "react";
import ProfileTab from "../components/ProfileTab";
import SecurityTab from "../components/SecurityTab";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-[40px] border-2 border-blue-700 shadow-sm min-h-[90vh]">

                {/* Tabs */}
                <div className="flex gap-16 px-12 pt-8 border-b">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`pb-4 text-2xl ${
                            activeTab === "profile"
                                ? "text-blue-700 border-b-4 border-blue-700"
                                : "text-gray-400"
                        }`}
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() => setActiveTab("security")}
                        className={`pb-4 text-2xl ${
                            activeTab === "security"
                                ? "text-blue-700 border-b-4 border-blue-700"
                                : "text-gray-400"
                        }`}
                    >
                        Security
                    </button>
                </div>

                {activeTab === "profile" ? (
                    <ProfileTab />
                ) : (
                    <SecurityTab />
                )}
            </div>
        </div>
    );
}