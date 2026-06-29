import {
  Store,
  Truck,
  Package,
  DollarSign,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import AnalyticsKpiCards from "../components/analytics/AnalyticsKpiCards";
import SalesOverview from "../components/analytics/SalesOverview";
import SalesByTerritory from "../components/analytics/SalesByTerritory";
import TopProductsTable from "../components/analytics/TopProductsTable";
import OrderStatusBreakdown from "../components/analytics/OrderStatusBreakdown";
import PaymentBreakdown from "../components/analytics/PaymentBreakdown";
import OutstandingRetailers from "../components/analytics/OutstandingRetailers";
import InventoryInsights from "../components/analytics/InventoryInsights";
import DriverPerformance from "../components/analytics/DriverPerformance";
import RetailerGrowth from "../components/analytics/RetailerGrowth";

export default function AnalyticsPage() {
  const kpis = [
    {
      title: "Total Retailers",
      value: "125",
      change: "↑ 8.2% from last week",
      icon: <Store size={26} />,
      bg: "bg-[#EFEAFF]",
      iconBg: "bg-purple-200",
      iconColor: "text-purple-600",
      changeColor: "text-green-600",
    },
    {
      title: "Active Drivers",
      value: "12",
      change: "↑ 9.1% from last week",
      icon: <Truck size={26} />,
      bg: "bg-[#FFF8D6]",
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-600",
      changeColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "1,508",
      change: "↑ 12.5% from last week",
      icon: <Package size={26} />,
      bg: "bg-[#E8F3FF]",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: "LKR 2.45M",
      change: "↑ 15.3% from last week",
      icon: <DollarSign size={26} />,
      bg: "bg-[#E9FBEF]",
      iconBg: "bg-green-200",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
      title: "Outstanding Amount",
      value: "LKR 350K",
      change: "↓ 3.6% from last week",
      icon: <CreditCard size={26} />,
      bg: "bg-[#FFF0E6]",
      iconBg: "bg-orange-200",
      iconColor: "text-orange-600",
      changeColor: "text-red-500",
    },
    {
      title: "Low Stock Products",
      value: "18",
      change: "↑ 5 from last week",
      icon: <AlertTriangle size={26} />,
      bg: "bg-[#FFE8EC]",
      iconBg: "bg-red-200",
      iconColor: "text-red-600",
      changeColor: "text-red-500",
    },
  ];

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

  const topProducts = [
    { name: "Coca Cola 1.5L", orders: 350, revenue: "450,000" },
    { name: "Anchor Milk 1L", orders: 280, revenue: "320,000" },
    { name: "Sunlight Soap 175g", orders: 210, revenue: "250,000" },
    { name: "Maggi Noodles 70g", orders: 180, revenue: "180,000" },
    { name: "Nestle Milo 400g", orders: 150, revenue: "165,000" },
  ];

  const orderStatus = [
    { label: "Delivered", value: 65, color: "bg-green-500" },
    { label: "Pending", value: 15, color: "bg-yellow-400" },
    { label: "Processing", value: 12, color: "bg-blue-500" },
    { label: "Cancelled", value: 8, color: "bg-red-500" },
  ];

  const paymentData = [
    { label: "Cash", value: 55, color: "bg-green-500" },
    { label: "Credit", value: 35, color: "bg-blue-500" },
    { label: "Split Payment", value: 10, color: "bg-orange-500" },
  ];

  const outstandingRetailers = [
    { name: "ABC Store", amount: "25,000" },
    { name: "Happy Mart", amount: "15,000" },
    { name: "Star Grocery Store", amount: "10,000" },
    { name: "Green Super", amount: "8,500" },
    { name: "Nimal Store", amount: "6,500" },
  ];

  const inventoryInsights = [
    { title: "Products In Stock", value: 156, note: "↑ 12 this week", color: "green" },
    { title: "Low Stock Products", value: 18, note: "↑ 5 this week", color: "yellow" },
    { title: "Out of Stock Products", value: 5, note: "↓ 2 this week", color: "red" },
    { title: "Expiring Soon", value: 12, note: "↑ 3 this week", color: "blue" },
  ];

  const driverPerformance = [
    { name: "Kasun Perera", deliveries: 125 },
    { name: "Nimal Fernando", deliveries: 110 },
    { name: "Aruna Dissanayake", deliveries: 95 },
    { name: "Sampath Jayasena", deliveries: 80 },
    { name: "Dilan Madusanka", deliveries: 65 },
  ];

  const retailerGrowth = [
    { month: "Jan", value: 5 },
    { month: "Feb", value: 8 },
    { month: "Mar", value: 12 },
    { month: "Apr", value: 10 },
    { month: "May", value: 14 },
    { month: "Jun", value: 16 },
    { month: "Jul", value: 18 },
  ];

  return (
    <div className="space-y-6">
      

        <PageHeader
              title="Analytics Overview"
              subtitle=" Real-time insights into your business performance"
            />

      <AnalyticsKpiCards kpis={kpis} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesOverview data={salesData} />
        <SalesByTerritory data={territoryData} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <TopProductsTable products={topProducts} />
        <OrderStatusBreakdown data={orderStatus} totalOrders="1,508" />
        <PaymentBreakdown data={paymentData} totalRevenue="LKR 2.45M" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <OutstandingRetailers retailers={outstandingRetailers} />
        <DriverPerformance drivers={driverPerformance} />
        <RetailerGrowth data={retailerGrowth} />
      </div>

      <InventoryInsights insights={inventoryInsights} />
    </div>
  );
}