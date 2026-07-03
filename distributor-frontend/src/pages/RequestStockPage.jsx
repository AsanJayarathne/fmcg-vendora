import { useState } from "react";

import RequestStockTabs from "../components/inventory/RequestStockTabs";
import RequestStockFilters from "../components/inventory/RequestStockFilters";
import RequestStockTable from "../components/inventory/RequestStockTable";
import RequestedStockTable from "../components/inventory/RequestedStockTable";
import ReceivedStockTable from "../components/inventory/ReceivedStockTable";
import Pagination from "../components/Pagination";
import CurrentRequestCard from "../components/inventory/CurrentRequestCard";
import PageHeader from "../components/PageHeader";

const products = [
  {
    name: "Item 1",
    productId: "PRD-01",
    availableStock: 2000,
    basePrice: 65.0,
    mrp: 75.0,
  },
  {
    name: "Item 2",
    productId: "PRD-01",
    availableStock: 2300,
    basePrice: 65.0,
    mrp: 75.0,
  },
  {
    name: "Item 3",
    productId: "PRD-01",
    availableStock: 2300,
    basePrice: 65.0,
    mrp: 75.0,
  },
];

const requestedStocks = [
  {
    id: "REQ-001",
    date: "20 May 2026",
    items: 12,
    amount: "65,000",
    status: "Pending",
    expected: "23 May 2026",
  },
  {
    id: "REQ-002",
    date: "18 May 2026",
    items: 8,
    amount: "42,000",
    status: "Approved",
    expected: "21 May 2026",
  },
];

const receivedStocks = [
  {
    id: "REC-001",
    requestId: "REQ-001",
    date: "22 May 2026",
    items: 12,
    amount: "65,000",
    receivedBy: "Kasun Perera",
  },
  {
    id: "REC-002",
    requestId: "REQ-002",
    date: "21 May 2026",
    items: 8,
    amount: "42,000",
    receivedBy: "Nimal Silva",
  },
];

const currentRequest = {
  requestId: "Request ID-001",
  items: [
    { product: "Item", qty: 2000, basePrice: 65, amount: 45000 },
    { product: "Item 2", qty: 2000, basePrice: 56, amount: 45000 },
  ],
};

export default function RequestStockPage() {
  const [activeTab, setActiveTab] = useState("Request Stock");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Request Stock"
        subtitle=" View And Manage your Stock Requests"
      />
      <RequestStockTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <RequestStockFilters />

      {activeTab === "Request Stock" && (
        <>
          <RequestStockTable products={products} />
          <Pagination start={1} end={8} total={178} label="Products" />
          <CurrentRequestCard request={currentRequest} />
        </>
      )}

      {activeTab === "Requested Stock" && (
        <>
          <RequestedStockTable requests={requestedStocks} />
          <Pagination
            start={1}
            end={requestedStocks.length}
            total={requestedStocks.length}
            label="Products"
          />
        </>
      )}

      {activeTab === "Received Stock" && (
        <>
          <ReceivedStockTable receivedStocks={receivedStocks} />
          <Pagination
            start={1}
            end={receivedStocks.length}
            total={receivedStocks.length}
            label="Products"
          />
        </>
      )}
    </div>
  );
}
