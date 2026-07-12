import { FiBriefcase, FiClipboard, FiTruck, FiZap } from "react-icons/fi";
import OrderStatCard from "./OrderStatCard";

function OrdersStats({ orders, activeOrders, urgentOrders, deliveredOrders }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <OrderStatCard icon={<FiBriefcase size={22} />} label="Total Orders" value={orders.length} linkText="All time" color="bg-blue-100 text-blue-700" />
      <OrderStatCard icon={<FiTruck size={22} />} label="Active Orders" value={activeOrders.length} linkText="In progress" color="bg-green-100 text-green-700" />
      <OrderStatCard icon={<FiZap size={22} />} label="Urgent Orders" value={urgentOrders.length} linkText="Priority" color="bg-red-100 text-red-700" />
      <OrderStatCard icon={<FiClipboard size={22} />} label="Delivered" value={deliveredOrders.length} linkText="Completed" color="bg-violet-100 text-violet-700" />
    </div>
  );
}

export default OrdersStats;
