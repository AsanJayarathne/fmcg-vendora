import React from 'react';

const ProductFilters = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-wrap gap-4 mb-6 items-center">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-500 font-semibold uppercase">Category</label>
        <select className="bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-md outline-none min-w-[150px]">
          <option value="all">All Categories</option>
          <option value="beverages">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="dairy">Dairy</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-500 font-semibold uppercase">Status</label>
        <select className="bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-md outline-none min-w-[150px]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-500 font-semibold uppercase">Sort By</label>
        <select className="bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-md outline-none min-w-[150px]">
          <option value="newest">Newest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
