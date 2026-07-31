import React from "react";
import MetricCard from "./MetricCard";
import { Package, CheckCircle2, AlertTriangle } from "lucide-react";

const ProductStatCards = ({ total = 0, active = 0, lowStock = 0 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Products"
        value={total.toLocaleString()}
        subtitle="Registered Items in Catalog"
        icon={<Package size={20} />}
        color="blue"
      />
      <MetricCard
        title="Active Listings"
        value={active.toLocaleString()}
        subtitle="Available for Orders"
        icon={<CheckCircle2 size={20} />}
        color="emerald"
      />
      <MetricCard
        title="Low Stock Alerts"
        value={lowStock.toLocaleString()}
        subtitle="Need Restock Soon"
        icon={<AlertTriangle size={20} />}
        color="amber"
      />
    </div>
  );
};

export default ProductStatCards;
