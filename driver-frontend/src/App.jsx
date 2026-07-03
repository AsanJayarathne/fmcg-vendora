import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DriverLayout from './layouts/DriverLayout';
import Dashboard from './pages/Dashboard';
import JobPool from './pages/JobPool';
import MyRoute from './pages/MyRoute';
import CashAudit from './pages/CashAudit';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DriverLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobpool" element={<JobPool />} />
          <Route path="myroute" element={<MyRoute />} />
          <Route path="cashaudit" element={<CashAudit />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;