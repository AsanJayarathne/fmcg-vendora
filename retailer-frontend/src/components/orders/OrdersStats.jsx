import { FiBriefcase, FiClipboard, FiTruck, FiZap } from "react-icons/fi";
import OrderStatCard from "./OrderStatCard";
import { useLanguage } from "../../context/LanguageContext";

function OrdersStats({ orders, activeOrders, urgentOrders, deliveredOrders }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <OrderStatCard icon={<FiBriefcase size={22} />} label={t("dashboard.totalOrder", "Total Orders")} value={orders.length} linkText={t("orders.allTime", "All time")} color="bg-blue-100 text-blue-700" />
      <OrderStatCard icon={<FiTruck size={22} />} label={t("orders.activeOrders", "Active Orders")} value={activeOrders.length} linkText={t("orders.inProgress", "In progress")} color="bg-green-100 text-green-700" />
      <OrderStatCard icon={<FiZap size={22} />} label={t("payment.urgentOrder", "Urgent Orders")} value={urgentOrders.length} linkText={t("orders.priority", "Priority")} color="bg-red-100 text-red-700" />
      <OrderStatCard icon={<FiClipboard size={22} />} label={t("orders.tabDelivered", "Delivered")} value={deliveredOrders.length} linkText={t("orders.completed", "Completed")} color="bg-violet-100 text-violet-700" />
    </div>
  );
}

export default OrdersStats;
