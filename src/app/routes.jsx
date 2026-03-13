import { Routes, Route } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { CustomerLayout } from "./layouts/CustomerLayout.jsx";
import { CustomerHome } from "./pages/customer/CustomerHome.jsx";
import { Cart } from "./pages/customer/Cart.jsx";
import { Orders } from "./pages/customer/Orders.jsx";
import { OrderHistory } from "./pages/customer/OrderHistory.jsx";
import { Profile } from "./pages/customer/Profile.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminLayout } from "./pages/admin/AdminLayout.jsx";
import { RestaurantManagement } from "./pages/admin/RestaurantManagement.jsx";
import { OrderMonitoring } from "./pages/admin/OrderMonitoring.jsx";
import { RevenueReports } from "./pages/admin/RevenueReports.jsx";
import { Complaints } from "./pages/admin/Complaints.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { RestaurantDashboard } from "./pages/restaurant/RestaurantDashboard.jsx";
import { MenuManagement } from "./pages/restaurant/MenuManagement.jsx";
import { OrderManagement } from "./pages/restaurant/OrderManagement.jsx";
import { RestaurantLayout } from "./pages/restaurant/RestaurantLayout.jsx";
import { SalesHistory } from "./pages/restaurant/SalesHistory.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute role="customer"><OrderHistory /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute role="customer"><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="restaurants" element={<ProtectedRoute role="admin"><RestaurantManagement /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute role="admin"><OrderMonitoring /></ProtectedRoute>} />
        <Route path="revenue" element={<ProtectedRoute role="admin"><RevenueReports /></ProtectedRoute>} />
        <Route path="complaints" element={<ProtectedRoute role="admin"><Complaints /></ProtectedRoute>} />
      </Route>

      <Route path="/restaurant" element={<RestaurantLayout />}>
        <Route index element={<ProtectedRoute role="restaurant"><RestaurantDashboard /></ProtectedRoute>} />
        <Route path="menu" element={<ProtectedRoute role="restaurant"><MenuManagement /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute role="restaurant"><OrderManagement /></ProtectedRoute>} />
        <Route path="sales" element={<ProtectedRoute role="restaurant"><SalesHistory /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export { AppRoutes };
