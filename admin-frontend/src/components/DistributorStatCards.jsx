import React from "react";
import MetricCard from "./MetricCard";
import { Building2, Clock, CheckCircle2, Ban } from "lucide-react";

const DistributorStatCards = ({ distributors = [], loading }) => {
  const total    = distributors.length;
  const pending  = distributors.filter((d) => d.status === "Pending").length;
  const approved = distributors.filter((d) => d.status === "Approved").length;
  const blocked  = distributors.filter((d) => d.status === "Blocked" || d.status === "Rejected").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Applications"
        value={loading ? "..." : total.toLocaleString()}
        subtitle="All Registered Companies"
        icon={<Building2 size={20} />}
        color="blue"
      />
      <MetricCard
        title="Pending Review"
        value={loading ? "..." : pending.toLocaleString()}
        subtitle="Awaiting Approval"
        icon={<Clock size={20} />}
        color="amber"
      />
      <MetricCard
        title="Active Distributors"
        value={loading ? "..." : approved.toLocaleString()}
        subtitle="Active Network Partners"
        icon={<CheckCircle2 size={20} />}
        color="emerald"
      />
      <MetricCard
        title="Blocked / Restricted"
        value={loading ? "..." : blocked.toLocaleString()}
        subtitle="Restricted Access"
        icon={<Ban size={20} />}
        color="red"
      />
    </div>
  );
};

export default DistributorStatCards;
