import OrderTabs from "../components/orders/OrderTabs";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersPagination from "../components/orders/OrdersPagination";
import MetricCard from "../components/MetricCard";
import { ShoppingCart } from "lucide-react";
import { ChartColumnBig } from "lucide-react";
import { ClipboardClock } from 'lucide-react';
import { SquareCheckBig } from 'lucide-react';
import { Ban } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-4">
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Orders"
                value="20"
                subtitle="Today"
                icon={<ShoppingCart className="text-[#0228e3]"size={40} />}
                bgColor="bg-[#DCE1F0]"
                iconBg="bg-[#5BDAF2]"
              />
      
              <MetricCard
                title="Pending Orders"
                value="13"
                subtitle="Awaiting Approval"
                icon={<ClipboardClock className="text-[#e3a002]" size={40} />}
                bgColor="bg-[#FFFCD6]"
                iconBg="bg-[#FFE365]"
              />
              <MetricCard
                title="Delivered Orders"
                value="10,000"
                subtitle="This Month"
                icon={<SquareCheckBig className="text-[#02e302]" size={40} />}
                bgColor="bg-[#EBFFE4]"
                iconBg="bg-[#A4FF83]"
              />
                <MetricCard
                title="Cancelled Orders"
                value="10,000"
                subtitle="This Month"
                icon={<Ban className="text-[#e30202]" size={40} />}
                bgColor="bg-[#FFE4E4]"
                iconBg="bg-[#FFA4A4]"
              />
            </div>
      
      <OrderTabs />
      <OrdersTable />
      <OrdersPagination />
    </div>
  );
}