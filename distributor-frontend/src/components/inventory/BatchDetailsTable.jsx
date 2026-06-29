import { PackageCheck, Trash2 } from "lucide-react";

export default function BatchDetailsTable({ title, batches }) {
  const totalQty = batches.reduce((sum, batch) => sum + batch.qty, 0);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>

      <div className="overflow-hidden border border-gray-200 rounded-md">
        <table className="w-full text-xs text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Batch No.</th>
              <th>Purchase Date</th>
              <th>Expiry date</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((batch, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-6 py-3">{batch.batchNo}</td>
                <td>{batch.purchaseDate}</td>
                <td>{batch.expiryDate}</td>
                <td>{batch.qty}</td>
                <td>{batch.status}</td>
                <td>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1 px-3 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
                      <PackageCheck size={12} />
                      Adjust Stock
                    </button>

                    <button className="p-1 text-red-500 border border-gray-300 rounded-md">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            <tr>
              <td className="px-6 py-3 font-medium">Total</td>
              <td></td>
              <td></td>
              <td>{totalQty}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}