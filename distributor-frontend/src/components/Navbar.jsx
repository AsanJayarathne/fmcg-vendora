export default function Navbar() {
  return (
    <div className="flex justify-between p-3 bg-white shadow">
      <h2>Distributor Panel</h2>
      <button className="px-3 py-1 text-white bg-blue-500 rounded">
        Logout
      </button>
    </div>
  );
}