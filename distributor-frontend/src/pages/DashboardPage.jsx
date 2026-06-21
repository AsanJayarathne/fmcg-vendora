import MetricCard from "../components/MetricCard";
import SalesChart from "../components/SalesChart";
import SalesOverview from "../components/analytics/SalesOverview";
import SalesByTerritory from "../components/analytics/SalesByTerritory";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import LowStockTable from "../components/dashboard/LowStockTable";
import {
  ShoppingCart,
  ClipboardClock,
  SquareCheckBig,
  TriangleAlert,
} from "lucide-react";

export default function Dashboard() {
  const salesData = [
    { label: "12 May", value: 8000 },
    { label: "13 May", value: 21000 },
    { label: "14 May", value: 15000 },
    { label: "15 May", value: 40000 },
    { label: "16 May", value: 21000 },
    { label: "17 May", value: 30000 },
    { label: "18 May", value: 35000 },
  ];

  const territoryData = [
    { name: "Kegalle", value: 4.3, percentage: "24.23%" },
    { name: "Colombo", value: 3.1, percentage: "17.42%" },
    { name: "Galle", value: 2.8, percentage: "15.73%" },
    { name: "Kandy", value: 2.3, percentage: "12.92%" },
    { name: "Kurunegala", value: 2.1, percentage: "11.70%" },
  ];
  const recentOrders = [
  { id: "ORD-001", retailer: "Star Grocery Store", amount: "15,000.00", status: "Delivered" },
  { id: "ORD-002", retailer: "Asan Grocery Store", amount: "31,340.00", status: "Pending" },
  { id: "ORD-003", retailer: "Green Super", amount: "10,000.00", status: "Processing" },
];

const lowStockProducts = [
  { id: "PRD-001", name: "Coca Cola 1.5L", category: "Beverage", stock: 12 },
  { id: "PRD-002", name: "Anchor Milk 1L", category: "Dairy", stock: 8 },
  { id: "PRD-003", name: "Sunlight Soap", category: "Household", stock: 5 },
];
  
  return (
    <div className="space-y-6">
      {/* Metric Cards */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <MetricCard
    title="Total Orders"
    value="178"
    subtitle="Today"
    icon={<ShoppingCart className="text-[#0228e3]" size={24} />}
    bgColor="bg-[#DCE1F0]"
    iconBg="bg-[#5BDAF2]"
  />

  <MetricCard
    title="Pending Orders"
    value="23"
    subtitle="Awaiting Approval"
    icon={<ClipboardClock className="text-[#e39102]" size={24} />}
    bgColor="bg-[#FFF4D6]"
    iconBg="bg-[#FFD166]"
  />

  <MetricCard
    title="Delivered Today"
    value="145"
    subtitle="Successfully Delivered"
    icon={<SquareCheckBig className="text-[#02b33c]" size={24} />}
    bgColor="bg-[#E8F9EC]"
    iconBg="bg-[#A8F0B8]"
  />

  <MetricCard
    title="Low Stock Alerts"
    value="8"
    subtitle="Products Need Restock"
    icon={<TriangleAlert className="text-[#e30202]" size={24} />}
    bgColor="bg-[#FFE4E4]"
    iconBg="bg-[#FFB4B4]"
  />
</div>

      {/* Dashboard Content */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <SalesOverview data={salesData} />
                  <SalesByTerritory data={territoryData} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentOrdersTable orders={recentOrders} />
            <LowStockTable products={lowStockProducts} />
        </div>
    </div>
  );
}
