import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { getCustomerProfile } from "../../api/customerApi";
import type { Customer } from "../../types/authTypes";
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!userId) {
        return;
      }

      const res = await getCustomerProfile(userId);
      setCustomer(res.data);
    };

    fetchCustomer();
  }, [userId]);

  if (!customer) {
    return <p>Loading...</p>;
  }

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="customer-dashboard">
      <div className="customer-topbar">
        <div className="customer-info">{customer.name}</div>
        <h1 className="dashboard-title">Customer Dashboard</h1>
        <div className="topbar-right">
          <NotificationBell />
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="customer-body">
        <div className="customer-sidebar">
          <button onClick={() => navigate("/customer/services")}>
            Browse Services
          </button>
          <button onClick={() => navigate("/customer/bookings")}>
            My Bookings
          </button>
        </div>
        <div className="customer-content" key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
