export default function DriversPagination({ start, end, total }) {
  const pages = ["<<", "<", "1", "2", "3", "...", "16", ">", ">>"];

  return (
    <div className="flex items-center justify-between px-6 py-3 text-xs bg-white border border-gray-200 rounded-lg">
      <p className="text-gray-500">
        showing {start} to {end} of {total} Pages
      </p>

      <div className="flex items-center gap-3">
        {pages.map((item) => (
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