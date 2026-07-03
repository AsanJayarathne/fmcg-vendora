export default function Pagination({
  start = 1,
  end = 10,
  total = 10,
  currentPage = 1,
  label = "Pages",
  onPageChange,
}) {
  const pages = ["<<", "<", "1", "2", "3", "...", "16", ">", ">>"];

  return (
    <div className="flex items-center justify-between px-6 py-3 text-xs bg-white border border-gray-200 rounded-lg">
      <p className="text-gray-500">
        showing {start} to {end} of {total} {label}
      </p>

      <div className="flex items-center gap-3">
        {pages.map((item) => {
          const isActive = item === String(currentPage);
          return (
            <button
              key={item}
              onClick={() => onPageChange && onPageChange(item)}
              className={`w-7 h-7 border rounded-md transition flex items-center justify-center ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
