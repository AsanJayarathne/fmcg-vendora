import { useState } from 'react';

function CashAudit() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const total = parseFloat(totalAmount) || 0;
  const cash = parseFloat(cashAmount) || 0;
  const credit = Math.max(0, total - cash);

  const todaysPayments = [
    { total: 32000, cash: 20000 },
    { total: 18500, cash: 18500 },
    { total: 47000, cash: 10000 },
    { total: 25000, cash: 25000 },
  ];

  const todaysTotal = todaysPayments.reduce((sum, p) => sum + p.total, 0);
  const todaysCash = todaysPayments.reduce((sum, p) => sum + p.cash, 0);
  const todaysCredit = todaysTotal - todaysCash;
  const todaysPending = todaysCredit;

  return (
    <div className="bg-white min-h-screen p-6">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Cash audit</h2>
        <p className="text-sm text-gray-400 mt-1">Split payment calculator</p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Payment Calculator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Payment calculator</h3>

          {/* Invoice Number */}
          <div className="mb-4">
            <label className="text-xs text-orange-500 mb-1.5 block">Invoice number</label>
            <input
              type="text"
              placeholder="e.g. INV-1234"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Customer ID */}
          <div className="mb-4">
            <label className="text-xs text-orange-500 mb-1.5 block">Customer ID</label>
            <input
              type="text"
              placeholder="e.g. CUST-5678"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Total Invoice Amount */}
          <div className="mb-4">
            <label className="text-xs text-orange-500 mb-1.5 block">Total invoice amount (Rs.)</label>
            <input
              type="number"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Cash Received */}
          <div className="mb-5">
            <label className="text-xs text-orange-500 mb-1.5 block">Cash received (Rs.)</label>
            <input
              type="number"
              placeholder="0.00"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Result */}
          <div className="border-t border-gray-100 pt-4 mb-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-400 mb-1">Cash</div>
                <div className="text-base font-bold text-green-500">
                  Rs. {cash.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Credit</div>
                <div className="text-base font-bold text-purple-500">
                  Rs. {credit.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Total</div>
                <div className="text-base font-bold text-gray-800">
                  Rs. {total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all">
            Confirm payment
          </button>
        </div>

        {/* Today's Cash Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Today's cash summary</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="text-sm text-gray-400">Total invoices</div>
              <div className="text-sm font-bold text-gray-900">Rs. {todaysTotal.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="text-sm text-gray-400">Cash collected</div>
              <div className="text-sm font-bold text-green-500">Rs. {todaysCash.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="text-sm text-gray-400">Credit given</div>
              <div className="text-sm font-bold text-purple-500">Rs. {todaysCredit.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="text-sm text-gray-400">Pending collection</div>
              <div className="text-sm font-bold text-orange-500">Rs. {todaysPending.toLocaleString()}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CashAudit;