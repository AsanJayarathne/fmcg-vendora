import React from "react";
import MetricCard from "../MetricCard";
import { Package, Boxes, AlertTriangle, Clock } from "lucide-react";

const WarehouseStatCards = ({ summary, loading }) => {
  const skus = Number(summary?.total_skus ?? 0);
  const units = Number(summary?.total_units ?? 0);
  const lowStock = Number(summary?.low_stock_count ?? 0);
  const expiring = Number(summary?.expiring_soon_count ?? 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total SKUs"
        value={loading ? "..." : skus.toLocaleString()}
        subtitle="Catalog Products"
        icon={<Package size={20} />}
        color="blue"
      />
      <MetricCard
        title="Total Units"
        value={loading ? "..." : units.toLocaleString()}
        subtitle="Physical Stock In Warehouse"
        icon={<Boxes size={20} />}
        color="emerald"
      />
      <MetricCard
        title="Low Stock Products"
        value={loading ? "..." : lowStock.toLocaleString()}
        subtitle="Under Reorder Threshold"
        icon={<AlertTriangle size={20} />}
        color="amber"
      />
      <MetricCard
        title="Expiring <= 30 Days"
        value={loading ? "..." : expiring.toLocaleString()}
        subtitle="Requires Action"
        icon={<Clock size={20} />}
        color="red"
      />
    </div>
  );
};

export default WarehouseStatCards;
