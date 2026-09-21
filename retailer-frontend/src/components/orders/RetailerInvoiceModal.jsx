import { useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  FiPrinter, 
  FiX, 
  FiCheckCircle, 
  FiPackage, 
  FiCalendar, 
  FiCreditCard, 
  FiDollarSign, 
  FiTruck,
  FiShoppingBag
} from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency, formatDate } from "../../utils/orderHelpers";

export default function RetailerInvoiceModal({ order, onClose }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!order) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDelivered = order.status === "Delivered" || order.backendStatus === "Delivered" || String(order.status).toLowerCase() === "delivered";
  const formattedOrderDate = formatDate(order.createdAt, true);
  const invoiceNumber = `INV-${String(order.orderId).replace("#", "")}`;

  const modalContent = (
    <div 
      className="retailer-invoice-portal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="retailer-invoice-card bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-blue-600/30">
              V
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                {t("orders.invoiceTitle", "Tax Invoice & Delivery Receipt")}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">#{invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close invoice modal"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Printable Invoice Document Body */}
        <div id="printable-retailer-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs">
          
          {/* Header & Company Brand */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <span className="text-xl font-black text-blue-600 tracking-tight block">VENDORA FMCG</span>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mt-0.5">
                Distribution Network • Official Tax Invoice
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoice Reference</span>
              <span className="font-mono font-bold text-slate-900 text-sm block">#{invoiceNumber}</span>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <FiCheckCircle size={11} className="text-emerald-500" />
                <span>{isDelivered ? "Delivered & Settled" : order.status}</span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier / Distributor</span>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <FiTruck size={14} className="text-blue-500 shrink-0" />
                <span>{order.distributor}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pt-0.5">Registered FMCG Authorized Distributor</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order & Delivery Details</span>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <FiCalendar size={13} className="text-slate-400" />
                <span>{formattedOrderDate}</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] font-medium text-slate-500">Payment:</span>
                <span className="font-bold text-slate-800 text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {order.paymentLabel || order.paymentMethod}
                </span>
                <span className="font-bold text-blue-700 text-[11px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  {order.orderType} Order
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="text-left px-4 py-3">Item Description</th>
                  <th className="text-center px-4 py-3">Unit</th>
                  <th className="text-center px-4 py-3">Qty</th>
                  <th className="text-right px-4 py-3">Unit Price</th>
                  <th className="text-right px-4 py-3">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order.items ?? []).map((item, idx) => (
                  <tr key={item.id ?? idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div>{item.name}</div>
                      {item.discountRate > 0 && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 border border-emerald-100">
                          {item.discountRate}% discount included
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.unit || "Unit"}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-700">{formatCurrency(order.subtotal)}</span>
            </div>

            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-emerald-700 text-xs">
                <span>Volume Tier Discount:</span>
                <span className="font-bold">- {formatCurrency(order.discount)}</span>
              </div>
            )}

            {(order.urgentCharge ?? 0) > 0 && (
              <div className="flex justify-between text-orange-700 text-xs">
                <span>Urgent Priority Handling Fee:</span>
                <span className="font-bold">+ {formatCurrency(order.urgentCharge)}</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Grand Total Invoiced:</span>
              <span className="text-blue-600 text-base">{formatCurrency(order.total)}</span>
            </div>

            {/* Payment Method Details */}
            {(order.cashAmount > 0 || order.creditUsed > 0 || order.creditAmount > 0) && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] space-y-1.5 mt-2">
                {order.cashAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1"><FiDollarSign size={12} className="text-emerald-500" /> Cash Component Paid:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(order.cashAmount)}</span>
                  </div>
                )}
                {(order.creditUsed > 0 || order.creditAmount > 0) && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1"><FiCreditCard size={12} className="text-purple-500" /> Supplier 30-Day Credit:</span>
                    <span className="font-bold text-purple-800">{formatCurrency(order.creditUsed || order.creditAmount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acknowledgement and Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[11px] text-slate-600 no-break">
            <div className="space-y-6">
              <span className="font-bold text-slate-700 block">Distributor Dispatch Authorization:</span>
              <div className="border-b border-slate-300 w-4/5"></div>
              <span className="text-[10px] text-slate-400 block">Authorized Signature & Stamp</span>
            </div>
            <div className="space-y-6 text-right">
              <span className="font-bold text-slate-700 block">Retail Store Receiving Acknowledgment:</span>
              <div className="border-b border-slate-300 w-4/5 ml-auto"></div>
              <span className="text-[10px] text-slate-400 block">Customer Signature</span>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 border-t border-slate-100 pt-3">
            Official delivery invoice issued via Vendora FMCG Distribution Network.
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            {t("common.close", "Close")}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shadow-blue-600/20 cursor-pointer"
          >
            <FiPrinter size={15} />
            <span>{t("orders.printInvoice", "Print / Save Invoice")}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
