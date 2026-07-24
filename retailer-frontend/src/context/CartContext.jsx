import { useMemo, useState } from "react";
import { CartContext } from "./CartContextObject";

function getDiscountRate(quantity) {
  if (quantity >= 56) {
    return 15;
  }

  if (quantity >= 32) {
    return 10;
  }

  if (quantity >= 8) {
    return 5;
  }

  return 0;
}

/**
 * Normalise a product object coming from either:
 *   - real API  → { product_id, product_name, unit_price, available_qty, category_name, ... }
 *   - old mock  → { id, name, price, stock, category, distributor, ... }
 * Returns a flat object with consistent id / name / price / stock keys.
 */
function normaliseProduct(product) {
  const baseId = product.product_id ?? product.id;
  const distId = product.distributor_id ?? null;
  return {
    ...product,
    // Stable id used as cart key
    id:          distId ? `${baseId}-${distId}` : baseId,
    productId:   baseId,
    // Display fields
    name:        product.product_name ?? product.name,
    price:       Number(product.unit_price ?? product.base_price ?? product.price ?? 0),
    stock:       product.available_qty ?? product.stock_qty ?? product.stock ?? 0,
    category:    product.category_name ?? product.category ?? "",
    distributor: product.distributor_name ?? product.distributor ?? "Unknown Distributor",
    distributor_id: distId,
  };
}

function buildCartItem(product, quantity) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const subtotal = product.price * safeQuantity;
  const discountRate = getDiscountRate(safeQuantity);
  const discount = subtotal * discountRate / 100;
  const total = subtotal - discount;

  return {
    ...product,
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
    const normalisedProduct = normaliseProduct(product);
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.id === normalisedProduct.id
      );

      if (existingItem) {
        return items.map((item) =>
          item.id === normalisedProduct.id
            ? buildCartItem(
                {
                  ...item,
                  distributor: item.distributor || normalisedProduct.distributor,
                },
                item.quantity + safeQuantity
              )
            : item
        );
      }

      return [
        ...items,
        buildCartItem(normalisedProduct, safeQuantity),
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
