import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 p-4 text-white bg-blue-900">
      <h1 className="mb-6 text-xl font-bold">Distributor</h1>

      <nav className="flex flex-col space-y-3">
        <Link to="/">Dashboard</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/retailers">Retailers</Link>
      </nav>
    </div>
  );
}