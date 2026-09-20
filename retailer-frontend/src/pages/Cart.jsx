import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContextObject";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiAlertTriangle, FiX, FiShoppingCart, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

// ── Confirmation Modal ──────────────────────────────────────────────────────
function RemoveConfirmModal({ isOpen, onClose, onConfirm, title, message, cancelText, confirmText }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <FiTrash2 size={16} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-rose-50/60 border border-rose-100 rounded-2xl text-xs text-rose-700 leading-relaxed font-semibold">
            <FiAlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>{message}</div>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className="px-4.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition cursor-pointer"
          >
            {confirmText || "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const { t } = useLanguage();

  // Confirmation state: null | { type: 'single', item } | { type: 'all' }
  const [removeTarget, setRemoveTarget] = useState(null);

  const fmt = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const distributorOrders = useMemo(() => {
    const orders = cartItems.reduce((groups, item) => {
      const distributorName = item.distributor || "Unknown Distributor";

      if (!groups[distributorName]) {
        groups[distributorName] = {
          distributor: distributorName,
          distributor_id: item.distributor_id,
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      }

      const subtotal = item.subtotal ?? item.price * item.quantity;
      const discount = item.discount ?? 0;
      const total    = item.total    ?? subtotal - discount;

      groups[distributorName].items.push({ ...item, subtotal, discount, total });
      groups[distributorName].totalQuantity += item.quantity;
      groups[distributorName].subtotal      += subtotal;
      groups[distributorName].discount      += discount;
      groups[distributorName].total         += total;

      return groups;
    }, {});

    return Object.values(orders);
  }, [cartItems]);

  const handleConfirmRemoval = () => {
    if (!removeTarget) return;
    if (removeTarget.type === "single" && removeTarget.item) {
      removeFromCart(removeTarget.item.id);
    } else if (removeTarget.type === "all") {
      clearCart();
    }
    setRemoveTarget(null);
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <FiShoppingCart className="text-blue-600" />
            <span>{t("cart.title", "Shopping Cart")}</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {t("cart.subtitle", "Review orders organized separately by distributor.")}
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={() => setRemoveTarget({ type: "all" })}
            className="self-start sm:self-auto px-4 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shadow-2xs"
          >
            <FiTrash2 size={13} />
            <span>{t("cart.clearCart", "Clear Cart")}</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 sm:p-16 text-center text-slate-400 font-bold shadow-xs flex flex-col items-center justify-center">
          <FiShoppingCart className="text-slate-300 mb-3" size={40} />
          <p className="text-base sm:text-lg font-bold text-slate-700">{t("cart.emptyCartTitle", "Your cart is empty")}</p>
          <p className="text-xs text-slate-400 mt-1 mb-5">{t("cart.emptyCartSubtitle", "Browse our catalog to add wholesale items to your cart.")}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>{t("cart.startShopping", "Browse Products")}</span>
            <FiArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          <div className="space-y-5 sm:space-y-6">
            {distributorOrders.map((order) => (
              <section
                key={order.distributor}
                className="bg-white border border-slate-100 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xs"
              >
                {/* Distributor Order Card Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-blue-50/40 px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-800">
                      {order.distributor}
                    </h2>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {order.items.length} {t("common.items", "product lines")} — {order.totalQuantity} {t("common.units", "units")}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("cart.distributorTotal", "Distributor Total")}</p>
                    <p className="text-lg sm:text-xl font-black text-blue-600">
                      Rs. {fmt(order.total)}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                          Rs. {fmt(item.price)} {t("products.each", "each")}
                        </p>
                        {item.discountRate > 0 && (
                          <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                            {item.discountRate}% {t("cart.discountApplied", "bulk discount applied")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
                        {/* Quantity controls: [-] [qty] [+] */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 8) {
                                setRemoveTarget({ type: "single", item });
                              } else {
                                updateQuantity(item.id, item.quantity - 8);
                              }
                            }}
                            className="w-7 h-7 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black border border-slate-200 flex items-center justify-center cursor-pointer transition shadow-2xs"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={12} />
                          </button>

                          <span className="w-8 text-center font-black text-slate-800 text-xs sm:text-sm">
                            {String(item.quantity).padStart(2, '0')}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 8)}
                            className="w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center cursor-pointer transition shadow-2xs"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[75px]">
                          {item.discount > 0 && (
                            <p className="text-[10px] text-slate-400 line-through font-bold">
                              Rs. {fmt(item.subtotal)}
                            </p>
                          )}
                          <p className="font-black text-xs sm:text-sm text-blue-600">Rs. {fmt(item.total)}</p>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => setRemoveTarget({ type: "single", item })}
                          className="p-2 sm:px-3 sm:py-1.5 bg-red-50 hover:bg-red-100/70 text-red-600 font-black text-xs rounded-xl cursor-pointer transition flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Distributor Order Footer */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-slate-50/50 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500">
                    <span>{t("cart.subtotal", "Subtotal")}: Rs. {fmt(order.subtotal)}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="text-emerald-600">{t("cart.discount", "Discount")}: Rs. {fmt(order.discount)}</span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/payment/${encodeURIComponent(order.distributor)}`,
                        {
                          state: order,
                        }
                      )
                    }
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-2xl cursor-pointer transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
                  >
                    <span>{t("cart.placeOrderWith", "Place Order With")} {order.distributor}</span>
                    <FiArrowRight size={13} />
                  </button>
                </div>
              </section>
            ))}
          </div>

          {/* Cart Summary Sidebar */}
          <aside className="bg-white border border-slate-100 rounded-2xl sm:rounded-[32px] p-5 sm:p-6 shadow-xs h-fit">
            <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
              {t("cart.orderSummary", "Cart Summary")}
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>{t("cart.distributorOrders", "Distributor orders")}</span>
                <span className="text-slate-800 font-extrabold">{distributorOrders.length}</span>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>{t("cart.productLines", "Product lines")}</span>
                <span className="text-slate-800 font-extrabold">{cartItems.length}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                {distributorOrders.map((order) => (
                  <div
                    key={order.distributor}
                    className="flex justify-between text-[11px] font-semibold text-slate-500"
                  >
                    <span className="truncate pr-2">{order.distributor}</span>
                    <span className="shrink-0 font-bold text-blue-600">Rs. {fmt(order.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
              <div className="flex justify-between">
                <span>{t("cart.subtotal", "Subtotal")}</span>
                <span className="text-slate-800 font-extrabold">Rs. {fmt(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>{t("cart.discount", "Discount")}</span>
                <span className="font-extrabold">- Rs. {fmt(cartDiscount)}</span>
              </div>
            </div>

            <div className="flex justify-between text-base sm:text-lg font-black pt-4 mt-4 border-t border-slate-100 text-blue-600">
              <span>{t("cart.totalAmount", "Total")}</span>
              <span>Rs. {fmt(cartTotal)}</span>
            </div>
          </aside>
        </div>
      )}

      {/* Confirmation Modal */}
      <RemoveConfirmModal
        isOpen={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemoval}
        cancelText={t("common.cancel", "Cancel")}
        confirmText={t("cart.confirmRemove", "Yes, Remove")}
        title={removeTarget?.type === "all" ? t("cart.clearCart", "Clear Shopping Cart") : t("cart.removeItem", "Remove Item")}
        message={
          removeTarget?.type === "all"
            ? t("cart.clearCartConfirm", "Are you sure you want to remove all items from your shopping cart?")
            : `${t("cart.removeItemConfirm", "Are you sure you want to remove")} "${removeTarget?.item?.name}" ${t("cart.fromYourCart", "from your cart?")}`
        }
      />
    </div>
  );
}

export default Cart;
