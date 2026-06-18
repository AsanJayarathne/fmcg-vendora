import DriverTabs from "../components/drivers/DriverTabs";
import DriversTable from "../components/drivers/DriversTable";
import DriversPagination from "../components/drivers/DriversPagination";

const drivers = [
  {
    id: "DR-1001",
    name: "Kasun Perera",
    initials: "KP",
    contact: "071-2564231",
    vehicleNo: "WP-AB-2356",
    vehicleType: "Truck",
    licenseNo: "WP472356",
    licenseType: "Heavy Vehicle",
    status: "Approved",
    registeredOn: "18 May 2026",
  },
  {
    id: "DR-1002",
    name: "Nuwan Silva",
    initials: "NS",
    contact: "071-2578831",
    vehicleNo: "SG-BB-2326",
    vehicleType: "Truck",
    licenseNo: "WP472356",
    licenseType: "Heavy Vehicle",
    status: "Pending",
    registeredOn: "25 April 2026",
  },
  {
    id: "DR-1003",
    name: "Asan Rasmika",
    initials: "AR",
    contact: "071-2145235",
    vehicleNo: "WP-AB-2356",
    vehicleType: "Truck",
    licenseNo: "WP472356",
    licenseType: "Heavy Vehicle",
    status: "Approved",
    registeredOn: "18 May 2026",
  },
  {
    id: "DR-1004",
    name: "Dileepa Saranga",
    initials: "DS",
    contact: "071-2004231",
    vehicleNo: "WP-AB-2356",
    vehicleType: "Truck",
    licenseNo: "WP472356",
    licenseType: "Heavy Vehicle",
    status: "Rejected",
    registeredOn: "18 May 2026",
  },
];

export default function DriversPage() {
  return (
    <div className="space-y-4">
      <DriverTabs />

      <DriversTable drivers={drivers} />

      <DriversPagination start={1} end={2} total={2} />
    </div>
  );
}