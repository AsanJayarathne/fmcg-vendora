import MetricCard from "../components/MetricCard";
import OrderHistoryFilters from "../components/orders/OrderHistoryFilters";
import OrderHistoryTable from "../components/orders/OrderHistoryTable";
import Pagination from "../components/Pagination";
import { ShoppingCart, CheckSquare, Truck, Ban } from "lucide-react";

export default function OrderHistory() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value="1508"
          subtitle="This Month"
          icon={<ShoppingCart className="text-cyan-600" size={34} />}
          bgColor="bg-[#E5ECFF]"
          iconBg="bg-[#5BDAF2]"
        />

        <MetricCard
          title="Delivered Orders"
          value="1207"
          subtitle="This Month"
          icon={<CheckSquare className="text-green-500" size={34} />}
          bgColor="bg-[#E7FFE0]"
          iconBg="bg-[#C7FFB8]"
        />

        <MetricCard
          title="Returned Orders"
          value="38"
          subtitle="This Month"
          icon={<Truck className="text-yellow-500" size={34} />}
          bgColor="bg-[#FFF8D6]"
          iconBg="bg-[#FFED8A]"
        />

        <MetricCard
          title="Cancel Orders"
          value="15"
          subtitle="This Month"
          icon={<Ban className="text-red-500" size={34} />}
          bgColor="bg-[#FFE2E2]"
          iconBg="bg-[#FF8B8B]"
        />
      </div>
      <OrderHistoryFilters />
      <OrderHistoryTable />
      <Pagination start={1} end={8} total={1508} label="Orders" />
    </div>
  );
}
