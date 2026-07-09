import { useState } from "react";

function AddToCartModal({
  product,
  onClose,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Support real API field names first, then old mock shape
  const name     = product.product_name ?? product.name;
  const price    = product.unit_price   ?? product.base_price ?? product.price;
  const stockQty = product.available_qty ?? product.stock_qty ?? product.stock ?? 0;

  const subtotal = quantity * Number(price);

  let discountRate = 0;

  if (quantity >= 50) {
    discountRate = 15;
  } else if (quantity >= 25) {
    discountRate = 10;
  } else if (quantity >= 10) {
    discountRate = 5;
  }

  const discount = subtotal * discountRate / 100;
  const total = subtotal - discount;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[650px] max-w-[calc(100vw-2rem)]">
        <h2 className="text-2xl font-bold mb-4">
          {name}
        </h2>

        <p className="text-gray-600">
          Available Stock: {stockQty}
        </p>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
            className="bg-gray-200 w-10 h-10 rounded text-lg"
          >
            -
          </button>

          <span className="text-xl w-12 text-center font-semibold">
            {quantity}
          </span>

          <button
            onClick={() =>
              setQuantity((current) =>
                Math.min(stockQty, current + 1)
              )
            }
            className="bg-blue-600 text-white w-10 h-10 rounded text-lg"
          >
            +
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <p>Subtotal: Rs. {subtotal}</p>
          <p>Discount: {discountRate}%</p>
          <p className="font-bold text-lg">
            Total: Rs. {total}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onConfirm(product, quantity);
              setQuantity(1);
              onClose();
            }}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            Add To Cart
          </button>

          <button
            onClick={() => {
              setQuantity(1);
              onClose();
            }}
            className="bg-red-500 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
