import { useState } from "react";
import OrderTabs from "../components/orders/OrderTabs";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersPagination from "../components/orders/OrdersPagination";
import MetricCard from "../components/MetricCard";
import {
  ShoppingCart,
  ClipboardClock,
  SquareCheckBig,
  Ban,
} from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    retailer: "Star Grocery Store",
    date: "20 May 2026",
    time: "10.45 A.M",
    amount: "15,000.00",
    payment: "cash",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    retailer: "Asan Grocery Store",
    date: "19 May 2026",
    time: "10.05 A.M",
    amount: "31,340.00",
    payment: "credit",
    status: "Delivered",
  },
  {
    id: "ORD-003",
    retailer: "New Grocery Store",
    date: "18 May 2026",
    time: "08.45 P.M",
    amount: "10,000.00",
    payment: "---",
    status: "Pending Approval",
  },
  {
    id: "ORD-004",
    retailer: "Green Super",
    date: "20 May 2026",
    time: "11.25 A.M",
    amount: "15,000.00",
    payment: "---",
    status: "Processing",
  },
  {
    id: "ORD-005",
    retailer: "Happy Mart",
    date: "21 May 2026",
    time: "09.30 A.M",
    amount: "12,000.00",
    payment: "cash",
    status: "Cancelled",
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  const filteredOrders =
    activeTab === "All Orders"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={orders.length}
          subtitle="Today"
          icon={<ShoppingCart className="text-[#0228e3]" size={40} />}
          bgColor="bg-[#DCE1F0]"
          iconBg="bg-[#5BDAF2]"
        />

        <MetricCard
          title="Pending Orders"
          value={orders.filter((order) => order.status === "Pending Approval").length}
          subtitle="Awaiting Approval"
          icon={<ClipboardClock className="text-[#e3a002]" size={40} />}
          bgColor="bg-[#FFFCD6]"
          iconBg="bg-[#FFE365]"
        />

        <MetricCard
          title="Delivered Orders"
          value={orders.filter((order) => order.status === "Delivered").length}
          subtitle="This Month"
          icon={<SquareCheckBig className="text-[#02e302]" size={40} />}
          bgColor="bg-[#EBFFE4]"
          iconBg="bg-[#A4FF83]"
        />

        <MetricCard
          title="Cancelled Orders"
          value={orders.filter((order) => order.status === "Cancelled").length}
          subtitle="This Month"
          icon={<Ban className="text-[#e30202]" size={40} />}
          bgColor="bg-[#FFE4E4]"
          iconBg="bg-[#FFA4A4]"
        />
      </div>

      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <OrdersTable orders={filteredOrders} />

      <OrdersPagination />
    </div>
  );
}