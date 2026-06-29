export default function OrderHistoryPagination() {
  return (
    <div className="flex items-center justify-between px-6 py-3 text-xs bg-white border border-gray-200 rounded-lg">
      <p className="text-gray-500">showing 1 to 8 of 1508 Orders</p>

      <div className="flex items-center gap-3">
        {["<<", "<", "1", "2", "3", "...", "16", ">", ">>"].map((item) => (
          <button
            key={item}
            className={`w-7 h-7 border rounded-md ${
              item === "1" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}