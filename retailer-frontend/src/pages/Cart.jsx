import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContextObject";
import products from "../data/products";
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

  const distributorOrders = useMemo(() => {
    const orders = cartItems.reduce((groups, item) => {
      const product = products.find(
        (productItem) => productItem.id === item.id,
      );

      const distributorName =
        item.distributor || product?.distributor || "Unknown Distributor";

      if (!groups[distributorName]) {
        groups[distributorName] = {
          distributor: distributorName,
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        };
      }

      const subtotal = item.subtotal ?? item.price * item.quantity;
      const discount = item.discount ?? 0;
      const total = item.total ?? subtotal - discount;

      groups[distributorName].items.push({
        ...item,
        distributor: distributorName,
        subtotal,
        discount,
        total,
      });
      groups[distributorName].totalQuantity += item.quantity;
      groups[distributorName].subtotal += subtotal;
      groups[distributorName].discount += discount;
      groups[distributorName].total += total;

      return groups;
    }, {});

    return Object.values(orders);
  }, [cartItems]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>

          <p className="text-gray-500 mt-1">
            Review each distributor order separately.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {distributorOrders.map((order) => (
              <section
                key={order.distributor}
                className="bg-white border rounded-xl overflow-hidden"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-blue-50 px-5 py-4 border-b">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {order.distributor}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {order.items.length} product lines - {order.totalQuantity}{" "}
                      units
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">Order total</p>

                    <p className="text-xl font-bold text-blue-700">
                      Rs. {order.total}
                    </p>
                  </div>
                </div>

                <div className="divide-y">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Rs. {item.price} each
                        </p>

                        {item.discountRate > 0 && (
                          <p className="text-sm text-green-600">
                            {item.discountRate}% discount applied
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 rounded-lg bg-gray-100 text-lg"
                        >
                          -
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 rounded-lg bg-blue-600 text-white text-lg"
                        >
                          +
                        </button>

                        <div className="w-32 text-right">
                          {item.discount > 0 && (
                            <p className="text-xs text-gray-500 line-through">
                              Rs. {item.subtotal}
                            </p>
                          )}

                          <p className="font-bold">Rs. {item.total}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-4 bg-gray-50 border-t">
                  <div className="text-sm text-gray-600">
                    <span>Subtotal: Rs. {order.subtotal}</span>
                    <span className="mx-2">|</span>
                    <span>Discount: Rs. {order.discount}</span>
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
                    className="w-full md:w-auto bg-blue-600 text-white px-4 py-3 rounded-lg"
                  >
                    Place Order With {order.distributor}
                  </button>
                </div>
              </section>
            ))}
          </div>

          <aside className="bg-white border rounded-xl p-5 h-fit">
            <h2 className="text-lg font-bold mb-4">Cart Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Distributor orders</span>
                <span>{distributorOrders.length}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Product lines</span>
                <span>{cartItems.length}</span>
              </div>

              {distributorOrders.map((order) => (
                <div
                  key={order.distributor}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>{order.distributor}</span>
                  <span>Rs. {order.total}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 mt-4 border-t text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {cartSubtotal}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- Rs. {cartDiscount}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold pt-4 mt-4 border-t">
              <span>Total</span>
              <span>Rs. {cartTotal}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
