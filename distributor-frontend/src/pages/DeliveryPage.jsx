import DeliveryFilters from "../components/delivery/DeliveryFilters";
import DeliveryTable from "../components/delivery/DeliveryTable";
import DeliveryPagination from "../components/delivery/DeliveryPagination";

const deliveries = [
  {
    deliveryId: "DEL-001",
    orderId: "ORD-001",
    driver: "Kasun",
    retailer: "Star Grocery Store",
    totalAmount: "15,000.00",
    collectedAmount: "31,340.00",
    payment: "cash",
    status: "Delivered",
  },
  {
    deliveryId: "DEL-001",
    orderId: "ORD-001",
    driver: "Nimal",
    retailer: "Asan Grocery Store",
    totalAmount: "31,340.00",
    collectedAmount: "31,340.00",
    payment: "credit",
    status: "Delivered",
  },
];

export default function DeliveryPage() {
  return (
    <div className="space-y-4">
      <DeliveryFilters />
      <DeliveryTable deliveries={deliveries} />
      <DeliveryPagination start={1} end={8} total={1508} />
    </div>
  );
}