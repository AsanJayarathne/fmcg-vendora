import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;