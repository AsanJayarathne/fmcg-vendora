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
import MyInventoryPage from "../pages/MyInventoryPage";
import RequestStockPage from "../pages/RequestStockPage";
import PaymentsPage from "../pages/PaymentsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import SettingsPage from "../pages/SettingsPage";
import RegisterPage from "../auth/RegisterPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<DistributorLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="product" element={<ProductsPage />} />

        <Route path="orders" element={<OrdersPage />} />

        <Route path="order-history" element={<OrderHistory />} />
        <Route path="delivery" element={<DeliveryPage />} />
        <Route path="shops" element={<ShopsPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="my-inventory" element={<MyInventoryPage />} />
        <Route path="request-stock" element={<RequestStockPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
