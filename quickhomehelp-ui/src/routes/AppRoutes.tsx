import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddService from "../pages/admin/AddService";
import ViewServices from "../pages/admin/ViewServices";
import VerifyExperts from "../pages/admin/VerifyExperts";
import ExpertDashboard from "../pages/expert/ExpertDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import BrowseServices from "../pages/customer/BrowserServices";
import MyBookings from "../pages/customer/MyBookings";
import ProtectedRoute from "./ProtectedRoute";

function AdminSection({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div>
      <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        Back
      </button>
      {children}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard homeOnly />} />
          
          <Route
            path="services/add"
            element={
              <AdminSection>
                <AddService />
              </AdminSection>
            }
          />

          <Route
            path="services"
            element={
              <AdminSection>
                <ViewServices />
              </AdminSection>
            }
          />
          <Route
            path="services/edit/:serviceId"
            element={
              <AdminSection>
                <ViewServices />
              </AdminSection>
            }
          />
          <Route
            path="services/delete/:serviceId"
            element={
              <AdminSection>
                <ViewServices />
              </AdminSection>
            }
          />
          <Route
            path="experts/verify"
            element={
              <AdminSection>
                <VerifyExperts />
              </AdminSection>
            }
          />
        </Route>

        <Route path="/expert" element={<Navigate to="/expert/dashboard" replace />} />
        <Route
          path="/expert/dashboard"
          element={
            <ProtectedRoute allowedRoles={["EXPERT"]}>
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="services" replace />} />
          <Route path="services" element={<BrowseServices />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
