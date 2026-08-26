import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../auth/login";
import ResetPassword from "../pages/ResetPassword";
import AdminLayout from "../layouts/AdminLayout";
import ProductsPage from "../pages/ProductsPage";
import Dashboard from "../pages/dashboard";
import WarehousePage from "../pages/WarehousePage";
import DistributorPage from "../pages/DistributorPage";
import OrderRequestPage from "../pages/OrderRequestPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="warehouse" element={<WarehousePage />} />
                <Route path="distributor" element={<DistributorPage />} />
                <Route path="order-request" element={<OrderRequestPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;