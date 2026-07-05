import { useMemo, useState } from "react";
import { CartContext } from "./CartContextObject";

function getDiscountRate(quantity) {
  if (quantity >= 50) {
    return 15;
  }

  if (quantity >= 25) {
    return 10;
  }

  if (quantity >= 10) {
    return 5;
  }

  return 0;
}

function buildCartItem(product, quantity) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const subtotal = product.price * safeQuantity;
  const discountRate = getDiscountRate(safeQuantity);
  const discount = subtotal * discountRate / 100;
  const total = subtotal - discount;

  return {
    ...product,
    distributor: product.distributor,
    quantity: safeQuantity,
    subtotal,
    discountRate,
    discount,
    total,
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return items.map((item) =>
          item.id === product.id
            ? buildCartItem(
                {
                  ...item,
                  distributor: item.distributor || product.distributor,
                },
                item.quantity + safeQuantity
              )
            : item
        );
      }

      return [
        ...items,
        buildCartItem(product, safeQuantity),
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? buildCartItem(item, quantity)
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.subtotal,
        0
      ),
    [cartItems]
  );

  const cartDiscount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.discount,
        0
      ),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.total,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
