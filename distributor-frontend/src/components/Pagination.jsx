import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 * Reusable Pagination Component
 *
 * Props:
 *  - currentPage  {number}   Current active page (1-indexed)
 *  - totalItems   {number}   Total number of records
 *  - itemsPerPage {number}   How many records per page (default: 8)
 *  - onPageChange {function} Callback: (newPage: number) => void
 *  - label        {string}   Item label shown in the summary text (default: "Items")
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 8,
  onPageChange,
  label = "Items",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page number list with ellipsis
  function getPageNumbers() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    const rangeStart = Math.max(2, currentPage - 2);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 2);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  function go(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange && onPageChange(page);
  }

  const btnBase =
    "flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-medium transition-all duration-150 select-none";
  const btnActive = "bg-blue-600 text-white border-blue-600 shadow-sm";
  const btnDefault =
    "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600";
  const btnDisabled = "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed";

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs">
      {/* Summary text */}
      <p className="text-gray-500">
        {totalItems === 0 ? (
          <span>No {label} found</span>
        ) : (
          <>
            Showing <span className="font-semibold text-gray-700">{start}</span>
            {" – "}
            <span className="font-semibold text-gray-700">{end}</span>
            {" of "}
            <span className="font-semibold text-gray-700">{totalItems}</span>
            {" "}{label}
          </>
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* First */}
        <button
          id="pagination-first"
          onClick={() => go(1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="First page"
        >
          <ChevronsLeft size={13} />
        </button>

        {/* Prev */}
        <button
          id="pagination-prev"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="Previous page"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              id={`pagination-page-${page}`}
              onClick={() => go(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnDefault}`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="pagination-next"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
          title="Next page"
        >
          <ChevronRight size={13} />
        </button>

        {/* Last */}
        <button
          id="pagination-last"
          onClick={() => go(totalPages)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
          title="Last page"
        >
          <ChevronsRight size={13} />
        </button>
      </div>
    </div>
  );
}
