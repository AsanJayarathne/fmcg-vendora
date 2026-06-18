import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import DistributorLayout from "../layout/DistributorLayout";
import Dashboard from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import OrdersPage from "../pages/OrdersPage";
import OrderHistory from "../pages/OrderHistoryPage";
import DeliveryPage from "../pages/DeliveryPage";
import ShopsPage from "../pages/ShopsPage";
import DriversPage from "../pages/DriversPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<DistributorLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="product" element={<ProductsPage />} />

        <Route path="orders" element={<OrdersPage />} />

        <Route path="order-history" element={<OrderHistory />} />
        <Route path="delivery" element={<DeliveryPage />} />
        <Route path="shops" element={<ShopsPage />} />
      <Route path="drivers" element={<DriversPage />} />
      </Route>
    </Routes>
  );
}
