import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
    "flex items-center justify-center w-8 h-8 rounded-xl border text-xs font-bold transition select-none cursor-pointer";
  const btnActive = "bg-blue-600 text-white border-blue-600 shadow-2xs";
  const btnDefault =
    "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600";
  const btnDisabled = "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-white border border-slate-100 rounded-3xl shadow-xs text-xs font-semibold text-slate-500">
      {/* Summary text */}
      <p>
        {totalItems === 0 ? (
          <span>No {label} found</span>
        ) : (
          <>
            Showing <span className="font-bold text-slate-800">{start}</span>
            {" – "}
            <span className="font-bold text-slate-800">{end}</span>
            {" of "}
            <span className="font-bold text-slate-800">{totalItems}</span>
            {" "}{label}
          </>
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          id="pagination-first"
          onClick={() => go(1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="First page"
        >
          <ChevronsLeft size={13} />
        </button>

        <button
          id="pagination-prev"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="Previous page"
        >
          <ChevronLeft size={13} />
        </button>

        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-slate-400"
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

        <button
          id="pagination-next"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
          title="Next page"
        >
          <ChevronRight size={13} />
        </button>

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
