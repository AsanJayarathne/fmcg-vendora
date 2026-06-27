import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProductsPage from "../pages/ProductsPage";
import Dashboard from "../pages/dashboard";
import WarehousePage from "../pages/WarehousePage";
import DistributorPage from "../pages/DistributorPage";
import OrderRequestPage from "../pages/OrderRequestPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="warehouse" element={<WarehousePage />} />
                <Route path="distributor" element={<DistributorPage />} />
                <Route path="order-request" element={<OrderRequestPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;