import React from 'react';
import StatCard from '../components/StatCard';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/Tables/ProductTable';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Total Products"
          value="1,248"
          icon="📦"
          trend="12%"
          trendUp={true}
        />
        <StatCard
          title="Active Listings"
          value="984"
          icon="✅"
          trend="5%"
          trendUp={true}
        />
        <StatCard
          title="Low Stock Alerts"
          value="34"
          icon="⚠️"
          trend="8%"
          trendUp={false}
        />
      </div>

      <ProductFilters />
      <ProductTable />
      <Pagination />

    </>
  );
};

export default ProductsPage;
