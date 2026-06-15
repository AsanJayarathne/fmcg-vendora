import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DistributorLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Scrollable Sidebar */}
        <div className="h-full">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <Outlet />
        </div>

      </div>
    </div>
  );
}