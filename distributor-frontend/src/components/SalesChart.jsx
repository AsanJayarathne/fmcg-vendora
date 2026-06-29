export default function SalesChart() {
  return (
    <div className="p-6 bg-white border rounded-xl">

      <div className="flex items-center justify-between mb-6">

        <h2 className="font-semibold">
          Sales Overview
        </h2>

        <button className="text-blue-500">
          See All
        </button>

      </div>

      <div className="flex items-center justify-center h-75">
        Chart Here
      </div>

    </div>
  );
}