import React from 'react';
import ProductStatCards from '../components/ProductStatCards';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/Tables/ProductTable';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
      </div>
      <ProductStatCards />

      <ProductFilters />
      <ProductTable />
      <Pagination />

    </div>
  );
};

export default ProductsPage;
