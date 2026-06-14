export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-white shadow">Total Orders</div>
        <div className="p-4 bg-white shadow">Pending</div>
        <div className="p-4 bg-white shadow">Delivered</div>
      </div>
    </div>
  );
}