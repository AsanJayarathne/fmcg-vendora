import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DistributorLayout() {
  return (
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </div>
      </div>

    </div>
  );
}