import React from 'react';

const ProductTable = () => {
  // Dummy data
  const products = [
    { id: 'PRD-001', name: 'Premium Cola 500ml', category: 'Beverages', price: '$1.50', stock: 1240, status: 'Active' },
    { id: 'PRD-002', name: 'Potato Chips Family Pack', category: 'Snacks', price: '$3.20', stock: 850, status: 'Active' },
    { id: 'PRD-003', name: 'Almond Milk 1L', category: 'Dairy', price: '$4.50', stock: 0, status: 'Inactive' },
    { id: 'PRD-004', name: 'Dark Chocolate Bar', category: 'Snacks', price: '$2.00', stock: 320, status: 'Active' },
    { id: 'PRD-005', name: 'Sparkling Water', category: 'Beverages', price: '$1.00', stock: 2100, status: 'Active' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Product ID</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Name</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Category</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Price</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Stock</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Status</th>
            <th className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-sm font-semibold border-b border-slate-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
              <td className={`px-5 py-4 text-sm text-slate-500 ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>{product.id}</td>
              <td className={`px-5 py-4 text-sm font-medium ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>{product.name}</td>
              <td className={`px-5 py-4 text-sm ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>{product.category}</td>
              <td className={`px-5 py-4 text-sm ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>{product.price}</td>
              <td className={`px-5 py-4 text-sm ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>{product.stock}</td>
              <td className={`px-5 py-4 text-sm ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  product.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                    : 'bg-red-50 text-red-500 border-red-100'
                }`}>
                  {product.status}
                </span>
              </td>
              <td className={`px-5 py-4 text-sm ${index !== products.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <button className="bg-transparent border-none cursor-pointer text-blue-500 hover:text-blue-600 font-medium">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
