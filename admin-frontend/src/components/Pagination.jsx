import React from 'react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-white rounded-b-xl">
      <div className="text-slate-500 text-sm">
        Showing 1 to 5 of 24 products
      </div>
      <div className="flex gap-2">
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-not-allowed opacity-50" disabled>←</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-blue-500 bg-blue-500 text-white cursor-pointer transition-colors hover:bg-blue-600">1</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400">2</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400">3</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400">...</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400">5</button>
        <button className="w-8 h-8 rounded-md flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400">→</button>
      </div>
    </div>
  );
};

export default Pagination;
