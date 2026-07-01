export default function TodayStorefrontPayments({ total = 0, transactionCount = 0 }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold mb-2">Today Storefront Payments</h2>
          <p className="text-sm text-gray-500">Total payments collected today</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 font-semibold">
          {transactionCount} txns
        </div>
      </div>
      <p className="text-3xl font-bold text-green-600 mt-6">
        Rs. {total.toLocaleString()}
      </p>
    </div>
  );
}
