import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import distributors from "../data/distributors";
import products from "../data/products";
import DistributorHeader from "../components/distributors/DistributorHeader";
import FastMovingProducts from "../components/distributors/FastMovingProducts";
import DistributorProducts from "../components/distributors/DistributorProducts";
import ProductDetailsModal from "../components/products/ProductDetailsModal";
import AddToCartModal from "../components/products/AddToCartModal";
import { CartContext } from "../context/CartContextObject";

function DistributorDetails() {
  const { id } = useParams();

  const {
    cartCount,
    addToCart,
  } = useContext(CartContext);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);

  const distributor =
    distributors.find(
      (d) => d.id === Number(id)
    );

  const distributorProducts =
    products.filter(
      (product) =>
        product.distributorId === Number(id)
    );

  if (!distributor) {
    return (
      <div className="p-6">
        Distributor not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <DistributorHeader
        distributor={distributor}
      />

      <div className="mb-6 bg-blue-50 p-4 rounded-xl">
        <h2 className="font-bold">
          Distributor Order
        </h2>

        <p>
          Items in Cart: {cartCount}
        </p>
      </div>

      <FastMovingProducts
        products={distributorProducts}
        onView={setSelectedProduct}
        onCart={setCartProduct}
      />

      <DistributorProducts
        products={distributorProducts}
        onView={setSelectedProduct}
        onCart={setCartProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <AddToCartModal
        product={cartProduct}
        onClose={() => setCartProduct(null)}
        onConfirm={addToCart}
      />
    </div>
  );
}

export default DistributorDetails;
