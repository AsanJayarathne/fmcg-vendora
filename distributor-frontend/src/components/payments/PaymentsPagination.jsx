export default function PaymentsPagination({
  start,
  end,
  total,
}) {
  const pages = [
    "<<",
    "<",
    "1",
    "2",
    "3",
    "...",
    "16",
    ">",
    ">>",
  ];

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-lg">
      <p className="text-xs text-gray-500">
        showing {start} to {end} of {total} Orders
      </p>

      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            className={`flex items-center justify-center w-7 h-7 text-xs border rounded-md transition
              ${
                page === "1"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}