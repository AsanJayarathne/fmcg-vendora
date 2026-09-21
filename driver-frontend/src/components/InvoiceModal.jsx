import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, Store, MapPin, Calendar, CreditCard, HandCoins, Package, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

function InvoiceModal({ delivery, onClose }) {
  useEffect(() => {
    if (!delivery) return;

    // Prevent background scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [delivery, onClose]);

  if (!delivery) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderId = delivery.order_id || delivery.id;
  const storeName = delivery.shop_name || delivery.store || 'Retail Store';
  const address = delivery.city ? `${delivery.shop_address || delivery.address}, ${delivery.city}` : (delivery.shop_address || delivery.address || 'N/A');
  const dateStr = delivery.delivery_date || delivery.claimed_at || delivery.created_at || new Date().toISOString();
  const formattedDate = new Date(dateStr).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const totalAmount = parseFloat(delivery.order_amount || delivery.total_amount || 0);
  const collectedAmount = parseFloat(delivery.collected_amount || 0);
  const cashAmount = parseFloat(delivery.cash_amount || 0);
  const creditAmount = parseFloat(delivery.credit_amount || 0);
  const outstandingCredit = parseFloat(delivery.outstanding_credit || 0);
  const totalCollectible = cashAmount + outstandingCredit;

  const modalContent = (
    <div 
      className="invoice-portal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="invoice-modal-card bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-orange-500/30">
              V
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 leading-tight">Delivery Invoice & Receipt</h3>
              <p className="text-[11px] text-slate-500">Order Ref: #ORD-{orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close invoice modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
          
          {/* Brand & Invoice Header */}
          <div className="flex items-start justify-between border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xl font-black text-orange-600 tracking-tight block">VENDORA FMCG</span>
              <span className="text-[11px] text-slate-400 font-medium">Driver Delivery Dispatch Receipt</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoice ID</span>
              <span className="font-mono font-bold text-slate-800 text-sm">#INV-ORD-{orderId}</span>
              <div className="mt-1">
                <StatusBadge status={delivery.status === 'CLAIMED' ? 'Pending' : (delivery.status === 'DELIVERED' ? 'Delivered' : (delivery.status === 'RETURNED' ? 'Returned' : delivery.status || 'Pending'))} />
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer / Store</span>
              <div className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Store size={12} className="text-orange-500 shrink-0" />
                <span className="truncate">{storeName}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-start gap-1 mt-1">
                <MapPin size={11} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{address}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Date & Time</span>
              <div className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                <Calendar size={12} className="text-slate-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">Payment Method</span>
              <span className="text-[11px] font-bold text-slate-800">
                {delivery.payment_method || delivery.paymentType || 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Items / Summary */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="bg-slate-50/80 px-3.5 py-2 border-b border-slate-100 font-bold text-[11px] text-slate-600 flex justify-between">
              <span>Item Description</span>
              <span>Details</span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-orange-500" />
                <div>
                  <span className="font-bold text-slate-800 block">Package Delivery Order</span>
                  <span className="text-[11px] text-slate-400">{delivery.total_items || delivery.items || 'Standard'} items dispatched</span>
                </div>
              </div>
              <span className="font-bold text-slate-800">
                Rs. {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment & Collection Breakdown */}
          <div className="space-y-2 border-t border-slate-200/80 pt-3.5">
            <div className="flex justify-between text-slate-500">
              <span>Order Subtotal:</span>
              <span className="font-medium text-slate-700">Rs. {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {cashAmount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1"><HandCoins size={11} className="text-emerald-500" /> Cash Component:</span>
                <span className="font-medium text-slate-700">Rs. {cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {creditAmount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1"><CreditCard size={11} className="text-purple-500" /> Credit Account:</span>
                <span className="font-medium text-slate-700">Rs. {creditAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {outstandingCredit > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Settled Outstanding Credit:</span>
                <span className="font-semibold">+ Rs. {outstandingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="border-t border-slate-200/80 pt-2 flex justify-between items-center font-bold text-sm">
              <span className="text-slate-800">Total Collectible:</span>
              <span className="text-orange-600">Rs. {(totalCollectible > 0 ? totalCollectible : totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-2.5 flex justify-between items-center mt-2">
              <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Actual Cash Collected:
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">
                Rs. {(collectedAmount > 0 ? collectedAmount : (delivery.status === 'DELIVERED' ? (totalCollectible || totalAmount) : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {delivery.remarks && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Remarks: </span>
                {delivery.remarks}
              </div>
            )}
          </div>

          {/* Signatures / Handover Section (Appears on print & modal) */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-[11px] text-slate-600 no-break">
            <div className="space-y-6">
              <span className="font-bold text-slate-700 block">Retailer Confirmation:</span>
              <div className="border-b border-slate-300 w-4/5"></div>
              <span className="text-[10px] text-slate-400 block">Signature & Stamp</span>
            </div>
            <div className="space-y-6 text-right">
              <span className="font-bold text-slate-700 block">Driver Dispatch Handover:</span>
              <div className="border-b border-slate-300 w-4/5 ml-auto"></div>
              <span className="text-[10px] text-slate-400 block">Driver Signature</span>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 border-t border-slate-100 pt-3">
            Thank you for choosing Vendora FMCG Distribution Network.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs shadow-orange-500/20 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default InvoiceModal;
