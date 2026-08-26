import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DriverLayout from './layouts/DriverLayout';
import Dashboard from './pages/Dashboard';
import JobPool from './pages/JobPool';
import MyRoute from './pages/MyRoute';
import CashAudit from './pages/CashAudit';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DriverLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="jobpool" element={<JobPool />} />
            <Route path="myroute" element={<MyRoute />} />
            <Route path="myorders" element={<CashAudit />} />
            <Route path="cashaudit" element={<CashAudit />} />
            <Route path="profile" element={<Profile />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;