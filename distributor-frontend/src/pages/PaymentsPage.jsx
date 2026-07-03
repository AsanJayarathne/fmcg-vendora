import { useState } from "react";

import PaymentTabs from "../components/payments/PaymentTabs";

import PaymentsTable from "../components/payments/PaymentsTable";
import OutstandingTable from "../components/payments/OutstandingTable";

import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [currentPage, setCurrentPage] = useState(1);

  const payments = [
    {
      orderId: "ORD-001",
      retailer: "Star Grocery Store",
      orderDate: "20 May 2026",
      totalAmount: "15000.00",
      paid: "5000.00",
      outstanding: "15000.00",
      paymentStatus: "cash",
    },
  ];

  const outstandings = [
    {
      retailerId: "RET-001",
      retailer: "Star Grocery Store",
      creditLimit: "15000.00",
      outstanding: "5000.00",
      availableCredit: "10000.00",
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payment History"
        subtitle="View And Manage your Current Payment"
      />

      <PaymentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "payments" ? (
        <PaymentsTable payments={payments} />
      ) : (
        <OutstandingTable outstandings={outstandings} />
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={20}
        itemsPerPage={8}
        label="Orders"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}