import ShopTabs from "../components/shops/ShopTabs";
import ShopsTable from "../components/shops/ShopsTable";
import ShopsPagination from "../components/shops/ShopsPagination";

const shops = [
  {
    id: "Shop-1002",
    name: "Green Super",
    initials: "GS",
    contact: "071-2578831",
    address: "NO 45,MAIN Street",
    city: "Negombo",
    creditLimit: "50,000.00",
    status: "Pending",
    registeredOn: "25 April 2026",
  },
  {
    id: "Shop-1002",
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
    id: "DR-1002",
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
  return (
    <div className="space-y-4">
      <ShopTabs />

      <ShopsTable shops={shops} />

      <ShopsPagination start={1} end={2} total={2} />
    </div>
  );
}