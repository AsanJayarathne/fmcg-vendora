import { Phone } from "lucide-react";

export default function DriversTable({ drivers }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Driver</th>
            <th>Contact</th>
            <th>Vehicle Details</th>
            <th>License Details</th>
            <th>Status</th>
            <th>Registered On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-xs font-bold text-green-600 bg-green-100 rounded-full w-9 h-9">
                    {driver.initials}
                  </div>

                  <div>
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-[10px] text-gray-500">{driver.id}</p>
                  </div>
                </div>
              </td>

              <td>
                <div className="flex items-center gap-2">
                  <Phone size={13} />
                  {driver.contact}
                </div>
              </td>

              <td>
                <p className="font-medium">{driver.vehicleNo}</p>
                <p className="text-[10px] text-gray-500">{driver.vehicleType}</p>
              </td>

              <td>
                <p className="font-medium">{driver.licenseNo}</p>
                <p className="text-[10px] text-gray-500">{driver.licenseType}</p>
              </td>

              <td>
                <span className={`px-4 py-1 text-[10px] font-semibold rounded ${getStatusStyle(driver.status)}`}>
                  {driver.status}
                </span>
              </td>

              <td>{driver.registeredOn}</td>

              <td>
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "Approved") return "text-green-600 bg-green-100";
  if (status === "Pending Approval") return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}