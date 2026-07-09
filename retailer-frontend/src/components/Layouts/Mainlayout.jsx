import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        <Topbar />

        <main className="flex-1 overflow-auto p-6">

          {children}

        </main>

      </div>

    </div>
  );
}

export default MainLayout;