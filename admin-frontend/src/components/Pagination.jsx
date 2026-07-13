import React from 'react';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  label = "Items",
}) => {
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
    "flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold transition-all duration-150 select-none cursor-pointer";
  const btnActive = "bg-blue-600 text-white border-blue-600 shadow-sm";
  const btnDefault =
    "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600";
  const btnDisabled = "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50";

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-white rounded-b-xl text-xs font-sans">
      {/* Summary text */}
      <p className="text-slate-500 text-sm">
        {totalItems === 0 ? (
          <span>No {label} found</span>
        ) : (
          <>
            Showing <span className="font-semibold text-slate-700">{start}</span>
            {" – "}
            <span className="font-semibold text-slate-700">{end}</span>
            {" of "}
            <span className="font-semibold text-slate-700">{totalItems}</span>
            {" "}{label}
          </>
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* First */}
        <button
          onClick={() => go(1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="First page"
        >
          «
        </button>

        {/* Prev */}
        <button
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
          title="Previous page"
        >
          ‹
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-slate-400 font-semibold"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => go(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnDefault}`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
          title="Next page"
        >
          ›
        </button>

        {/* Last */}
        <button
          onClick={() => go(totalPages)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
          title="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
