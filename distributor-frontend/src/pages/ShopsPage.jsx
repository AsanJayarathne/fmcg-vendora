import { useState } from "react";
import ShopTabs from "../components/shops/ShopTabs";
import ShopsTable from "../components/shops/ShopsTable";
import SetCreditTable from "../components/shops/SetCreditTable";
import Pagination from "../components/Pagination";

const shops = [
  {
    id: "Shop-1002",
    name: "Green Super",
    initials: "GS",
    contact: "071-2578831",
    address: "NO 45,MAIN Street",
    city: "Negombo",
    creditLimit: "50,000.00",
    status: "Pending Approval",
    registeredOn: "25 April 2026",
  },
  {
    id: "Shop-1003",
    name: "Aruna Super",
    initials: "AR",
    contact: "071-2578831",
    address: "NO 45,MAIN Street",
    city: "Negombo",
    creditLimit: "50,000.00",
    status: "Rejected",
    registeredOn: "25 April 2026",
  },
  {
    id: "Shop-1004",
    name: "Nuwan Silva",
    initials: "NS",
    contact: "071-2578831",
    address: "NO 45,MAIN Street",
    city: "Negombo",
    creditLimit: "50,000.00",
    status: "Approved",
    registeredOn: "25 April 2026",
  },
];

export default function ShopsPage() {
  const [activeTab, setActiveTab] = useState("All Shop");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredShops =
    activeTab === "All Shop" || activeTab === "Set Credit"
      ? shops
      : shops.filter((shop) => shop.status === activeTab);

  return (
    <div className="space-y-4">
      <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Set Credit" ? (
        <SetCreditTable shops={shops.filter((shop) => shop.status === "Approved")} />
      ) : (
        <ShopsTable shops={filteredShops} />
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={shops.length}
        itemsPerPage={8}
        label="Shops"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}