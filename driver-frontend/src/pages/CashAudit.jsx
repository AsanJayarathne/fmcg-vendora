import { useState } from 'react';

function CashAudit() {
  const [totalAmount, setTotalAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const total = parseFloat(totalAmount) || 0;
  const cash = parseFloat(cashAmount) || 0;
  const credit = Math.max(0, total - cash);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">Cash audit</h2>
        <p className="text-sm text-gray-500 mt-1">Split payment calculator</p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Calculator */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Payment calculator</h3>

          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1.5 block">
              Total invoice amount (Rs.)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs text-gray-500 mb-1.5 block">
              Cash received (Rs.)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Result */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-400 mb-1">Cash</div>
                <div className="text-base font-medium text-green-600">
                  Rs. {cash.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Credit</div>
                <div className="text-base font-medium text-purple-600">
                  Rs. {credit.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Total</div>
                <div className="text-base font-medium text-gray-800">
                  Rs. {total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm hover:bg-purple-700 transition-all">
            Confirm payment
          </button>
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Today's cash summary</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Total invoices', value: 'Rs. 125,000', color: 'text-gray-800' },
              { label: 'Cash collected', value: 'Rs. 75,000', color: 'text-green-600' },
              { label: 'Credit given', value: 'Rs. 50,000', color: 'text-purple-600' },
              { label: 'Pending collection', value: 'Rs. 25,000', color: 'text-amber-600' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className={`text-sm font-medium ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CashAudit;