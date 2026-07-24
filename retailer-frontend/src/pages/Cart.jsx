import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContextObject";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Shopping Cart</h1>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Review each distributor order separately.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4.5 py-2 border border-red-100 text-red-655 rounded-full hover:bg-red-50 font-bold text-xs cursor-pointer transition"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center text-slate-400 font-bold">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          <div className="space-y-6">
            {distributorOrders.map((order) => (
              <section
                key={order.distributor}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xs"
              >
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-blue-50/30 px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-800">
                      {order.distributor}
                    </h2>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {order.items.length} product lines — {order.totalQuantity} units
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-455 uppercase tracking-wider">Order total</p>
                    <p className="text-xl font-black text-blue-600">
                      Rs. {fmt(order.total)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <h3 className="font-extrabold text-slate-800 text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-450 mt-0.5">
                          Rs. {fmt(item.price)} each
                        </p>
                        {item.discountRate > 0 && (
                          <p className="text-[11px] font-bold text-green-600 mt-1">
                            {item.discountRate}% discount applied
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 shrink-0">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">
                          <button
                            onClick={() => {
                              if (item.quantity <= 8) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 8);
                              }
                            }}
                            className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 text-slate-805 text-sm font-black border border-slate-100 flex items-center justify-center cursor-pointer transition shadow-xs"
                          >
                            -
                          </button>

                          <span className="w-8 text-center font-black text-slate-800 text-xs">
                            {String(item.quantity).padStart(2, '0')}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 8)}
                            className="w-7 h-7 rounded-full bg-blue-650 hover:bg-blue-700 text-white text-sm font-black flex items-center justify-center cursor-pointer transition shadow-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="w-28 text-right min-w-[70px]">
                          {item.discount > 0 && (
                            <p className="text-[10px] text-slate-400 line-through font-bold">
                              Rs. {fmt(item.subtotal)}
                            </p>
                          )}
                          <p className="font-black text-sm text-blue-600">Rs. {fmt(item.total)}</p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100/70 text-red-600 font-black text-[10px] rounded-full cursor-pointer transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-5 bg-slate-50/30 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-455">
                    <span>Subtotal: Rs. {fmt(order.subtotal)}</span>
                    <span className="mx-2 text-slate-200">|</span>
                    <span className="text-green-600">Discount: Rs. {fmt(order.discount)}</span>
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
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-755 text-white font-bold text-xs px-5 py-3 rounded-full cursor-pointer transition shadow-xs"
                  >
                    Place Order With {order.distributor}
                  </button>
                </div>
              </section>
            ))}
          </div>

          <aside className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs h-fit">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-5">Cart Summary</h2>

            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-bold text-slate-455">
                <span>Distributor orders</span>
                <span className="text-slate-800 font-extrabold">{distributorOrders.length}</span>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-455">
                <span>Product lines</span>
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

            <div className="space-y-2.5 pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-455">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-extrabold">Rs. {fmt(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-extrabold">- Rs. {fmt(cartDiscount)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-black pt-4 mt-4 border-t border-slate-100 text-blue-650">
              <span>Total</span>
              <span>Rs. {fmt(cartTotal)}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
