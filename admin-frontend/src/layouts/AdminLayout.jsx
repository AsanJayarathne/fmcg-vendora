import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-[260px] min-h-screen">
        <Topbar />

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;