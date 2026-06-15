import MetricCard from "../components/MetricCard";
import SalesChart from "../components/SalesChart";
import { Package } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Products"
          value="178"
          subtitle="Across All Categories"
          icon={<Package size={30} />}
          bgColor="bg-[#DCE1F0]"
        />

        <MetricCard
          title="Total Products"
          value="178"
          subtitle="Across All Categories"
          icon={<Package size={30} />}
          bgColor="bg-[#DCE1F0]"
        />
        <MetricCard
          title="Total Products"
          value="178"
          subtitle="Across All Categories"
          icon={<Package size={30} />}
          bgColor="bg-[#DCE1F0]"
        />
      </div>

      {/* Dashboard Content */}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
      </div>
    </div>
  );
}
